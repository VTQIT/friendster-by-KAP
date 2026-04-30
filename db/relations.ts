import { relations } from "drizzle-orm";
import { users, connections, activityLogs } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  connections: many(connections, { relationName: "userConnections" }),
  friendConnections: many(connections, { relationName: "friendConnections" }),
  activityLogs: many(activityLogs),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  user: one(users, {
    fields: [connections.userId],
    references: [users.id],
    relationName: "userConnections",
  }),
  friend: one(users, {
    fields: [connections.friendId],
    references: [users.id],
    relationName: "friendConnections",
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));
