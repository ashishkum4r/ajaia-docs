const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", (req, res) => {
  const owned = db
    .prepare(`SELECT *, 'owner' as role FROM documents WHERE owner_id = ? ORDER BY updated_at DESC`)
    .all(req.user.id);

  const shared = db.prepare(`
    SELECT d.*, ds.permission as role
    FROM documents d
    JOIN document_shares ds ON ds.document_id = d.id
    WHERE ds.shared_with_id = ?
    ORDER BY d.updated_at DESC
  `).all(req.user.id);

  res.json({ owned, shared });
});

router.post("/", (req, res) => {
  const id = uuidv4();
  const { title = "Untitled Document", content = "" } = req.body;
  db.prepare(
    `INSERT INTO documents (id, title, content, owner_id) VALUES (?, ?, ?, ?)`
  ).run(id, title, content, req.user.id);
  const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);
  res.status(201).json(doc);
});

router.get("/:id", (req, res) => {
  const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });

  const hasAccess =
    doc.owner_id === req.user.id ||
    db
      .prepare("SELECT 1 FROM document_shares WHERE document_id = ? AND shared_with_id = ?")
      .get(req.params.id, req.user.id);

  if (!hasAccess) return res.status(403).json({ error: "Forbidden" });

  const shares = doc.owner_id === req.user.id
    ? db.prepare(`
        SELECT ds.*, u.name, u.email
        FROM document_shares ds
        JOIN users u ON u.id = ds.shared_with_id
        WHERE ds.document_id = ?
      `).all(req.params.id)
    : [];

  res.json({ ...doc, shares });
});

router.patch("/:id", (req, res) => {
  const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });

  const canEdit =
    doc.owner_id === req.user.id ||
    db
      .prepare("SELECT 1 FROM document_shares WHERE document_id = ? AND shared_with_id = ? AND permission = 'edit'")
      .get(req.params.id, req.user.id);

  if (!canEdit) return res.status(403).json({ error: "Forbidden" });

  const { title, content } = req.body;
  if (title !== undefined)
    db.prepare("UPDATE documents SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(title, req.params.id);
  if (content !== undefined)
    db.prepare("UPDATE documents SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(content, req.params.id);

  res.json(db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id));
});

router.delete("/:id", (req, res) => {
  const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  if (doc.owner_id !== req.user.id) return res.status(403).json({ error: "Only owner can delete" });
  db.prepare("DELETE FROM document_shares WHERE document_id = ?").run(req.params.id);
  db.prepare("DELETE FROM documents WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.post("/:id/share", (req, res) => {
  const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  if (doc.owner_id !== req.user.id) return res.status(403).json({ error: "Only owner can share" });

  const { userId, permission = "edit" } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });
  if (!["view", "edit"].includes(permission))
    return res.status(400).json({ error: "permission must be view or edit" });

  db.prepare(`
    INSERT INTO document_shares (id, document_id, shared_with_id, permission)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(document_id, shared_with_id) DO UPDATE SET permission = excluded.permission
  `).run(uuidv4(), req.params.id, userId, permission);

  res.json({ success: true });
});

router.delete("/:id/share/:userId", (req, res) => {
  const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  if (doc.owner_id !== req.user.id) return res.status(403).json({ error: "Only owner can revoke" });
  db.prepare("DELETE FROM document_shares WHERE document_id = ? AND shared_with_id = ?").run(req.params.id, req.params.userId);
  res.json({ success: true });
});

module.exports = router;
