// tutaj bedzie przetszymywana baza danych z better-sqlite3
import Database from "better-sqlite3";

const db = new Database("fishlog.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS catches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fishName TEXT NOT NULL,
    location TEXT,
    note TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export default db;