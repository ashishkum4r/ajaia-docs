const router = require("express").Router();
const multer = require("multer");
const mammoth = require("mammoth");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const auth = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".txt", ".md", ".docx"];
    const ext = "." + file.originalname.split(".").pop().toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only .txt, .md, and .docx files are supported"));
  },
});

router.post("/", auth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const ext = "." + req.file.originalname.split(".").pop().toLowerCase();
  let content = "";

  try {
    if (ext === ".docx") {
      const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
      content = result.value;
    } else {
      content = "<p>" + req.file.buffer
        .toString("utf-8")
        .split("\n")
        .join("</p><p>") + "</p>";
    }

    const id = uuidv4();
    const title = req.file.originalname.replace(/\.[^.]+$/, "");
    db.prepare(
      "INSERT INTO documents (id, title, content, owner_id) VALUES (?, ?, ?, ?)"
    ).run(id, title, content, req.user.id);

    res.status(201).json(
      db.prepare("SELECT * FROM documents WHERE id = ?").get(id)
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to process file: " + err.message });
  }
});

module.exports = router;
