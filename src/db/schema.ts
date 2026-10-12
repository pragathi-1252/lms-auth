
import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: varchar("password", { length: 255 }),

  role: mysqlEnum("role", [
    "student",
    "instructor",
    "admin",
  ])
    .notNull()
    .default("student"),

  googleId: varchar("google_id", { length: 255 }).unique(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});
