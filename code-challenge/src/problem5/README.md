# Problem 5 - ExpressJS + TypeScript CRUD (SQLite)

This is a simple backend service using ExpressJS + TypeScript with SQLite (via better-sqlite3) for data persistence.

## Features

- Create an item
- List items with basic filters and pagination
- Get a single item
- Update an item (partial update)
- Delete an item

## Tech Stack

- ExpressJS (TypeScript)
- SQLite with `better-sqlite3`
- Nodemon + ts-node for development

## Getting Started

### 1) Install dependencies

```bash
cd src/problem5
npm install
```

### 2) Run in development

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

### 3) Build and run (production-like)

```bash
npm run build
npm start
```

## API

Base URL: `http://localhost:3000`

- Health check

  - `GET /health` → `{ status: "ok" }`

- Create item

  - `POST /api/items`
  - Body: `{ "title": string, "description?": string }`
  - 201 → created item

- List items (filters)

  - `GET /api/items?q=keyword&limit=20&offset=0`
  - 200 → `{ items, limit, offset, count }`

- Get item

  - `GET /api/items/:id`
  - 200 → item object, 404 if not found

- Update item (partial)

  - `PATCH /api/items/:id`
  - Body: `{ "title?": string, "description?": string }`
  - 200 → updated item

- Delete item
  - `DELETE /api/items/:id`
  - 204 → no content

## Notes

- Database file `data.sqlite` is created automatically in `src/problem5` on first run.
- All endpoints return JSON.
- Request validation is minimal and can be extended as needed.

## Development Tips

- Adjust the port with `PORT=4000 npm run dev` (PowerShell: `$env:PORT=4000; npm run dev`).
- You can reset data by deleting the `data.sqlite` file while the server is stopped.
