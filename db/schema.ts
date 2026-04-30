import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  json,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

// OAuth users (Kimi login)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  passwordHash: varchar("passwordHash", { length: 255 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  authMethod: mysqlEnum("authMethod", ["oauth", "password", "magic_link", "admin_pin"])
    .default("oauth")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Friend connections between users
export const connections = mysqlTable("connections", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  friendId: bigint("friendId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  connectionStrength: int("connectionStrength").default(50).notNull(), // 0-100
  lastMeetupAt: timestamp("lastMeetupAt").defaultNow().notNull(),
  nextFadeWarningAt: timestamp("nextFadeWarningAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["active", "fading", "broken"])
    .default("active")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Connection = typeof connections.$inferSelect;
export type InsertConnection = typeof connections.$inferInsert;

// Activity logs for user tracking and admin monitoring
export const activityLogs = mysqlTable("activityLogs", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 50 }).notNull(),
  details: json("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

// Admin settings (PIN, fade days, maintenance mode)
export const adminSettings = mysqlTable("adminSettings", {
  id: serial("id").primaryKey(),
  adminPinHash: varchar("adminPinHash", { length: 255 }).notNull(),
  connectionFadeDays: int("connectionFadeDays").default(30).notNull(),
  maintenanceMode: mysqlEnum("maintenanceMode", ["true", "false"])
    .default("false")
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = typeof adminSettings.$inferInsert;

// Magic link tokens
export const magicLinks = mysqlTable("magicLinks", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  used: mysqlEnum("used", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MagicLink = typeof magicLinks.$inferSelect;
export type InsertMagicLink = typeof magicLinks.$inferInsert;
