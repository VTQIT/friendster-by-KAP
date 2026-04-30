import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { connectionsRouter } from "./connections-router";
import { activityRouter } from "./activity-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  connections: connectionsRouter,
  activity: activityRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
