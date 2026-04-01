const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_PATH = path.join(__dirname, "../data/docs.db");
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Untitled Document',
    content TEXT NOT NULL DEFAULT '',
    owner_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS document_shares (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    shared_with_id TEXT NOT NULL,
    permission TEXT NOT NULL DEFAULT 'view',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (shared_with_id) REFERENCES users(id),
    UNIQUE(document_id, shared_with_id)
  );
`);

const seedUsers = [
  { id: "user-1", email: "alice@ajaia.com", name: "Alice", password: "password123" },
  { id: "user-2", email: "bob@ajaia.com",   name: "Bob",   password: "password123" },
  { id: "user-3", email: "carol@ajaia.com", name: "Carol", password: "password123" },
];

const insertUser = db.prepare(
  `INSERT OR IGNORE INTO users (id, email, password, name) VALUES (?, ?, ?, ?)`
);

for (const u of seedUsers) {
  const hash = bcrypt.hashSync(u.password, 10);
  insertUser.run(u.id, u.email, hash, u.name);
}

module.exports = db;
