const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DB_DIR, "events.db");
const fs = require("fs");

// ensure data dir
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);

// open db
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to open DB:", err);
    process.exit(1);
  }
});

// create table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      side TEXT NOT NULL
    )`
  );
});

app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(bodyParser.json());

// helper to format month input like "2025-05" -> "May 2025"
function formatDate(dateInput) {
  if (!dateInput) return dateInput;
  try {
    const d = new Date(dateInput);

    // Check for "Invalid Date"
    if (isNaN(d.getTime())) {
        throw new Error("Invalid Date");
    }
    
    // Format to Month Year only, as required for the timeline
    return d.toLocaleString("default", { day:"numeric", month: "long", year: "numeric" });
  } catch (e) {
    console.warn(`Could not parse date: ${dateInput}. Falling back to original string.`);
    return dateInput;
  }
}

// GET all events
app.get("/api/events", (req, res) => {
  db.all("SELECT * FROM events ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new event
app.post("/api/events", (req, res) => {
  const { date, title, description } = req.body;
  if (!date || !title) {
    return res.status(400).json({ error: "date and title required" });
  }

  // determine side based on last row
  db.get("SELECT side FROM events ORDER BY id DESC LIMIT 1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    const lastSide = row ? row.side : "right";
    const side = lastSide === "left" ? "right" : "left";

    const formattedDate = formatDate(date);

    const stmt = db.prepare(
      "INSERT INTO events (date, title, description, side) VALUES (?, ?, ?, ?)"
    );
    stmt.run(formattedDate, title, description || "A new chapter in our story, written with love.", side, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const insertedId = this.lastID;
      db.get("SELECT * FROM events WHERE id = ?", [insertedId], (err2, newRow) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json(newRow);
      });
    });
    stmt.finalize();
  });
});

// PUT update an event
app.put("/api/events/:id", (req, res) => {
  const { id } = req.params;
  const { date, title, description } = req.body;
  if (!date || !title) {
    return res.status(400).json({ error: "date and title required" });
  }

  const formattedDate = formatDate(date);

  db.run(
    "UPDATE events SET date = ?, title = ?, description = ? WHERE id = ?",
    [formattedDate, title, description || "", id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      // if no rows changed, the id probably didn't exist
      if (this.changes === 0) return res.status(404).json({ error: "Event not found" });
      db.get("SELECT * FROM events WHERE id = ?", [id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(row);
      });
    }
  );
});

// DELETE remove an event
app.delete("/api/events/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM events WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Event not found" });
    res.json({ success: true });
  });
});

app.listen(PORT, "::", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});