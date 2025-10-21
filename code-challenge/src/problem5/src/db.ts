import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "data.sqlite");
export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS items (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	description TEXT DEFAULT '',
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS trg_items_updated_at
AFTER UPDATE ON items
FOR EACH ROW BEGIN
	UPDATE items SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`);

export type Item = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};
