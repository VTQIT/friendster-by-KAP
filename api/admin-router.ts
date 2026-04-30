import { z } from "zod";
import { eq, desc, sql, count } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, connections, activityLogs, adminSettings } from "@db/schema";
import { hashPin } from "./lib/local-auth";

export const adminRouter = createRouter({
  // Get dashboard statistics
  stats: adminQuery.query(async () => {
    const db = getDb();

    const [userCount] = await db.select({ count: count() }).from(users);
    const [connectionCount] = await db.select({ count: count() }).from(connections);
    const [logCount] = await db.select({ count: count() }).from(activityLogs);

    // Get active users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeToday] = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.lastSignInAt} >= ${today}`);

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [recentRegs] = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.createdAt} >= ${sevenDaysAgo}`);

    return {
      totalUsers: userCount.count,
      totalConnections: connectionCount.count,
      totalActivities: logCount.count,
      activeToday: activeToday.count,
      recentRegistrations: recentRegs.count,
    };
  }),

  // Get all users (paginated)
  users: adminQuery
    .input(
      z
        .object({
          page: z.number().default(1),
          limit: z.number().default(20),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      const rows = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);

      const [totalResult] = await db.select({ count: count() }).from(users);

      return {
        users: rows,
        total: totalResult.count,
        page,
        totalPages: Math.ceil(totalResult.count / limit),
      };
    }),

  // Update user role
  updateUserRole: adminQuery
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["user", "admin"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      await db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.userId));

      // Log activity
      await db.insert(activityLogs).values({
        userId: ctx.user.id,
        action: "ADMIN_ROLE_CHANGED",
        details: { targetUserId: input.userId, newRole: input.role },
      });

      return { success: true };
    }),

  // Get activity logs (paginated, filterable)
  activityLogs: adminQuery
    .input(
      z
        .object({
          page: z.number().default(1),
          limit: z.number().default(50),
          action: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 50;
      const offset = (page - 1) * limit;

      let query = db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit)
        .offset(offset);

      const rows = await query;

      const [totalResult] = await db.select({ count: count() }).from(activityLogs);

      return {
        logs: rows,
        total: totalResult.count,
        page,
        totalPages: Math.ceil(totalResult.count / limit),
      };
    }),

  // Update admin PIN
  updatePin: adminQuery
    .input(
      z.object({
        newPin: z.string().length(6, "PIN must be exactly 6 digits"),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const newPinHash = await hashPin(input.newPin);

      const settings = await db.select().from(adminSettings).limit(1);
      if (settings.length === 0) {
        throw new Error("Admin settings not found");
      }

      await db
        .update(adminSettings)
        .set({ adminPinHash: newPinHash })
        .where(eq(adminSettings.id, settings[0].id));

      return { success: true };
    }),

  // Get system settings
  settings: adminQuery.query(async () => {
    const db = getDb();
    const rows = await db.select().from(adminSettings).limit(1);
    return rows.at(0);
  }),

  // Update system settings
  updateSettings: adminQuery
    .input(
      z.object({
        connectionFadeDays: z.number().min(1).max(365).optional(),
        maintenanceMode: z.enum(["true", "false"]).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const settings = await db.select().from(adminSettings).limit(1);
      if (settings.length === 0) {
        throw new Error("Admin settings not found");
      }

      const updateData: Record<string, unknown> = {};
      if (input.connectionFadeDays !== undefined) {
        updateData.connectionFadeDays = input.connectionFadeDays;
      }
      if (input.maintenanceMode !== undefined) {
        updateData.maintenanceMode = input.maintenanceMode;
      }

      await db
        .update(adminSettings)
        .set(updateData)
        .where(eq(adminSettings.id, settings[0].id));

      return { success: true };
    }),
});
