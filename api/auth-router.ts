import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { activityLogs } from "@db/schema";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );

    // Log logout activity
    try {
      await getDb().insert(activityLogs).values({
        userId: ctx.user.id,
        action: "USER_LOGGED_OUT",
        details: { method: "oauth" },
      });
    } catch {
      // Ignore logging errors on logout
    }

    return { success: true };
  }),
});
