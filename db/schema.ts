import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Reusable table field configurations.
const id = () => text({ length: 26 }).notNull();
const uid = () => id().unique();
const deletedAt = () => integer({ mode: "timestamp_ms" });
const updatedAt = () => integer({ mode: "timestamp_ms" }).default(sql`CURRENT_TIMESTAMP`);

// TODO: Add layers of authorizations with an account type field.
// TODO: Add an account provider for Google and Github as well in the future.

const accountsTable = sqliteTable("Accounts", {
  id: uid(),
  email: text().unique(),
  provider: text({ enum: ["CREDENTIALS"] }).notNull(),
  verifiedAt: integer({ mode: "timestamp_ms" }),
  deletedAt: deletedAt(),
  updatedAt: updatedAt(),
});

// NOTE: The `deletedAt` field is to handle soft content deletes, because
// those data can be useful in some investigation or that kind of stuff.

const credentialsTable = sqliteTable("Credentials", {
  id: uid(),
  accountId: uid().references(() => accountsTable.id),
  email: text().unique().notNull(),
  password: text({ length: 60 }).notNull(),
  updatedAt: updatedAt(),
});

const profilesTable = sqliteTable("Profiles", {
  id: uid(),
  accountId: uid().references(() => accountsTable.id),
  username: text().unique().notNull(),
  bio: text(),
  deletedAt: deletedAt(),
  updatedAt: updatedAt(),
});

export { accountsTable, credentialsTable, profilesTable };
