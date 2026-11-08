import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = process.env.DB_PATH ?? path.join(process.cwd(), "data", "cb.db");
let db: Database.Database | undefined;

export function getDb() {
  if (db) return db;
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const isNew = !fs.existsSync(dbPath);
  db = new Database(dbPath);
  if (isNew) db.exec(fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8"));
  return db;
}
