import { Router } from "express";
import { db, Item } from "../db";

export const itemsRouter = Router();

// Create a resource
itemsRouter.post("/", (req, res) => {
  const { title, description } = req.body ?? {};
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  const stmt = db.prepare(
    "INSERT INTO items (title, description) VALUES (?, ?)"
  );
  const info = stmt.run(
    title.trim(),
    typeof description === "string" ? description : ""
  );
  const created = db
    .prepare("SELECT * FROM items WHERE id = ?")
    .get(info.lastInsertRowid) as Item;
  return res.status(201).json(created);
});

// List resources with basic filters (?q=keyword)
itemsRouter.get("/", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
  const offset = Math.max(0, Number(req.query.offset) || 0);
  let rows: Item[] = [];
  if (q) {
    rows = db
      .prepare(
        `SELECT * FROM items WHERE title LIKE ? OR description LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`
      )
      .all(`%${q}%`, `%${q}%`, limit, offset) as Item[];
  } else {
    rows = db
      .prepare(`SELECT * FROM items ORDER BY id DESC LIMIT ? OFFSET ?`)
      .all(limit, offset) as Item[];
  }
  return res.json({ items: rows, limit, offset, count: rows.length });
});

// Get details of a resource
itemsRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "invalid id" });
  const row = db.prepare("SELECT * FROM items WHERE id = ?").get(id) as
    | Item
    | undefined;
  if (!row) return res.status(404).json({ error: "not found" });
  return res.json(row);
});

// Update resource details (partial)
itemsRouter.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "invalid id" });
  const existing = db.prepare("SELECT * FROM items WHERE id = ?").get(id) as
    | Item
    | undefined;
  if (!existing) return res.status(404).json({ error: "not found" });
  const { title, description } = req.body ?? {};
  const newTitle =
    typeof title === "string" && title.trim() ? title.trim() : existing.title;
  const newDesc =
    typeof description === "string" ? description : existing.description;
  db.prepare("UPDATE items SET title = ?, description = ? WHERE id = ?").run(
    newTitle,
    newDesc,
    id
  );
  const updated = db
    .prepare("SELECT * FROM items WHERE id = ?")
    .get(id) as Item;
  return res.json(updated);
});

// Delete a resource
itemsRouter.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "invalid id" });
  const info = db.prepare("DELETE FROM items WHERE id = ?").run(id);
  if (info.changes === 0) return res.status(404).json({ error: "not found" });
  return res.status(204).send();
});
