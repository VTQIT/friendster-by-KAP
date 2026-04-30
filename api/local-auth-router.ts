import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, gt } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, magicLinks, activityLogs } from "@db/schema";
import {
  hashPassword,
  comparePassword,
  comparePin,
  signLocalToken,
  generateMagicToken,
} from "./lib/local-auth";
import { getAdminSettings } from "./queries/admin";

export const localAuthRouter = createRouter({
  // Username/Password Registration
  register: publicQuery
    .input(
      z.object({
        username: z
          .string()
          .min(3, "Username must be at least 3 characters")
          .max(20, "Username must be at most 20 characters")
          .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores",
          ),
        email: z.string().email("Invalid email address"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain uppercase, lowercase, and a number",
          ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // Check if username already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.name, input.username))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already taken",
        });
      }

      // Check if email already exists
      const existingEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingEmail.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      const passwordHash = await hashPassword(input.password);

      // Create user
      const result = await db.insert(users).values({
        unionId: `local_${input.email}`,
        name: input.username,
        email: input.email,
        avatar: null,
        passwordHash,
        role: "user",
        authMethod: "password",
        lastSignInAt: new Date(),
      });

      const userId = Number(result[0].insertId);

      // Log activity
      await db.insert(activityLogs).values({
        userId,
        action: "USER_REGISTERED",
        details: { method: "password", username: input.username },
        ipAddress: ctx.req.headers.get("x-forwarded-for") || "unknown",
      });

      const token = await signLocalToken(userId);

      return { success: true, token, userId };
    }),

  // Username/Password Login
  login: publicQuery
    .input(
      z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // Find user by username
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.name, input.username))
        .limit(1);

      const user = rows.at(0);

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const valid = await comparePassword(input.password, user.passwordHash);
      if (!valid) {
        // Log failed attempt
        await db.insert(activityLogs).values({
          userId: user.id,
          action: "USER_LOGIN_FAILED",
          details: { method: "password", username: input.username },
          ipAddress: ctx.req.headers.get("x-forwarded-for") || "unknown",
        });
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      // Update last sign in
      await db
        .update(users)
        .set({ lastSignInAt: new Date() })
        .where(eq(users.id, user.id));

      // Log activity
      await db.insert(activityLogs).values({
        userId: user.id,
        action: "USER_LOGGED_IN",
        details: { method: "password", username: input.username },
        ipAddress: ctx.req.headers.get("x-forwarded-for") || "unknown",
      });

      const token = await signLocalToken(user.id);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      };
    }),

  // Send Magic Link
  sendMagicLink: publicQuery
    .input(z.object({ email: z.string().email("Invalid email address") }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const token = generateMagicToken();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await db.insert(magicLinks).values({
        email: input.email,
        token,
        expiresAt,
        used: "false",
      });

      // Log the magic link to console (simulating email)
      console.log(`[Magic Link] Token: ${token} for ${input.email}`);

      return { success: true, message: "Magic link sent to your email" };
    }),

  // Verify Magic Link
  verifyMagicLink: publicQuery
    .input(z.object({ token: z.string().min(1, "Token is required") }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      const rows = await db
        .select()
        .from(magicLinks)
        .where(
          and(
            eq(magicLinks.token, input.token),
            eq(magicLinks.used, "false"),
            gt(magicLinks.expiresAt, new Date()),
          ),
        )
        .limit(1);

      const magicLink = rows.at(0);
      if (!magicLink) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired magic link",
        });
      }

      // Mark as used
      await db
        .update(magicLinks)
        .set({ used: "true" })
        .where(eq(magicLinks.id, magicLink.id));

      // Find or create user
      let userRows = await db
        .select()
        .from(users)
        .where(eq(users.email, magicLink.email))
        .limit(1);

      let user = userRows.at(0);

      if (!user) {
        const result = await db.insert(users).values({
          unionId: `magic_${magicLink.email}`,
          name: magicLink.email.split("@")[0],
          email: magicLink.email,
          avatar: null,
          role: "user",
          authMethod: "magic_link",
          lastSignInAt: new Date(),
        });
        const userId = Number(result[0].insertId);
        const newRows = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
        user = newRows.at(0);
      } else {
        await db
          .update(users)
          .set({ lastSignInAt: new Date() })
          .where(eq(users.id, user.id));
      }

      if (!user) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create user" });
      }

      // Log activity
      await db.insert(activityLogs).values({
        userId: user.id,
        action: "USER_LOGGED_IN",
        details: { method: "magic_link", email: magicLink.email },
        ipAddress: ctx.req.headers.get("x-forwarded-for") || "unknown",
      });

      const token = await signLocalToken(user.id);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      };
    }),

  // Admin PIN Login
  adminPinLogin: publicQuery
    .input(z.object({ pin: z.string().length(6, "PIN must be exactly 6 digits") }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // Get admin settings
      const settings = await getAdminSettings();
      if (!settings) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Admin settings not configured",
        });
      }

      // Verify PIN
      const valid = await comparePin(input.pin, settings.adminPinHash);

      if (!valid) {
        // Log failed attempt
        await db.insert(activityLogs).values({
          action: "ADMIN_LOGIN_FAILED",
          details: { pinAttempt: input.pin },
          ipAddress: ctx.req.headers.get("x-forwarded-for") || "unknown",
        });
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid admin PIN",
        });
      }

      // Find or create admin user
      let adminRows = await db
        .select()
        .from(users)
        .where(eq(users.unionId, "admin_pin_user"))
        .limit(1);

      let adminUser = adminRows.at(0);

      if (!adminUser) {
        const result = await db.insert(users).values({
          unionId: "admin_pin_user",
          name: "Administrator",
          email: "admin@friendster.local",
          avatar: null,
          role: "admin",
          authMethod: "admin_pin",
          lastSignInAt: new Date(),
        });
        const userId = Number(result[0].insertId);
        const newRows = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
        adminUser = newRows.at(0);
      } else {
        if (adminUser.role !== "admin") {
          await db
            .update(users)
            .set({ role: "admin", lastSignInAt: new Date() })
            .where(eq(users.id, adminUser.id));
          const updated = await db
            .select()
            .from(users)
            .where(eq(users.id, adminUser.id))
            .limit(1);
          adminUser = updated.at(0);
        } else {
          await db
            .update(users)
            .set({ lastSignInAt: new Date() })
            .where(eq(users.id, adminUser.id));
        }
      }

      if (!adminUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create admin user",
        });
      }

      // Log successful admin login
      await db.insert(activityLogs).values({
        userId: adminUser.id,
        action: "ADMIN_LOGIN",
        details: { method: "admin_pin" },
        ipAddress: ctx.req.headers.get("x-forwarded-for") || "unknown",
      });

      const token = await signLocalToken(adminUser.id);

      return {
        success: true,
        token,
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          avatar: adminUser.avatar,
          role: adminUser.role,
        },
      };
    }),
});
