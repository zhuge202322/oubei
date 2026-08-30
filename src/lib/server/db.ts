import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { getRuntimeConfig } from "@/lib/server/config";
import { migrateDatabase } from "@/lib/server/migrations";

export type DatabaseConnection = Database.Database;

export function openDatabase(databasePath?: string): DatabaseConnection {
  const resolvedPath = databasePath || getRuntimeConfig().databasePath;
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  const db = new Database(resolvedPath);
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  migrateDatabase(db);
  return db;
}

export function closeDatabase(db: DatabaseConnection) {
  if (db.open) db.close();
}
