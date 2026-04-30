import { desc, eq } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { activityLogs, users } from "@db/schema";

export const activityRouter = createRouter({
  // Get current user's activity feed
  feed: authedQuery.query(async () => {
    const db = getDb();

    const logs = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        details: activityLogs.details,
        createdAt: activityLogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(activityLogs)
      .innerJoin(users, eq(activityLogs.userId, users.id))
      .orderBy(desc(activityLogs.createdAt))
      .limit(50);

    return logs;
  }),

  // Get my activities
  myActivities: authedQuery.query(async ({ ctx }) => {
    const db = getDb();

    const logs = await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, ctx.user.id))
      .orderBy(desc(activityLogs.createdAt))
      .limit(20);

    return logs;
  }),
});
