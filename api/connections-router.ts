import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { connections, users, activityLogs } from "@db/schema";

export const connectionsRouter = createRouter({
  // Get all connections for current user
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const rows = await db
      .select({
        connection: connections,
        friend: users,
      })
      .from(connections)
      .innerJoin(users, eq(connections.friendId, users.id))
      .where(eq(connections.userId, userId))
      .orderBy(desc(connections.lastMeetupAt));

    return rows.map((r) => ({
      id: r.connection.id,
      friendId: r.friend.id,
      friendName: r.friend.name,
      friendAvatar: r.friend.avatar,
      connectionStrength: r.connection.connectionStrength,
      lastMeetupAt: r.connection.lastMeetupAt,
      status: r.connection.status,
      createdAt: r.connection.createdAt,
    }));
  }),

  // Add a new connection (friend)
  add: authedQuery
    .input(
      z.object({
        friendId: z.number().positive("Friend ID is required"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      if (userId === input.friendId) {
        throw new Error("Cannot add yourself as a friend");
      }

      // Check if connection already exists
      const existing = await db
        .select()
        .from(connections)
        .where(
          and(
            eq(connections.userId, userId),
            eq(connections.friendId, input.friendId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Connection already exists");
      }

      // Create bidirectional connection
      await db.insert(connections).values({
        userId,
        friendId: input.friendId,
        connectionStrength: 50,
        status: "active",
        lastMeetupAt: new Date(),
        nextFadeWarningAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      await db.insert(connections).values({
        userId: input.friendId,
        friendId: userId,
        connectionStrength: 50,
        status: "active",
        lastMeetupAt: new Date(),
        nextFadeWarningAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      // Log activity
      await db.insert(activityLogs).values({
        userId,
        action: "FRIEND_ADDED",
        details: { friendId: input.friendId },
      });

      return { success: true };
    }),

  // Schedule a meetup (strengthens connection)
  meetup: authedQuery
    .input(
      z.object({
        connectionId: z.number().positive(),
        location: z.string().min(1, "Location is required"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      const connectionRows = await db
        .select()
        .from(connections)
        .where(eq(connections.id, input.connectionId))
        .limit(1);

      const connection = connectionRows.at(0);
      if (!connection) {
        throw new Error("Connection not found");
      }

      const newStrength = Math.min(connection.connectionStrength + 10, 100);

      await db
        .update(connections)
        .set({
          connectionStrength: newStrength,
          lastMeetupAt: new Date(),
          nextFadeWarningAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "active",
        })
        .where(eq(connections.id, connection.id));

      // Also update reverse connection
      await db
        .update(connections)
        .set({
          connectionStrength: newStrength,
          lastMeetupAt: new Date(),
          nextFadeWarningAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "active",
        })
        .where(
          and(
            eq(connections.userId, connection.friendId),
            eq(connections.friendId, connection.userId),
          ),
        );

      // Log activity
      await db.insert(activityLogs).values({
        userId: ctx.user.id,
        action: "MEETUP_SCHEDULED",
        details: { connectionId: input.connectionId, location: input.location },
      });

      return { success: true, newStrength };
    }),
});
