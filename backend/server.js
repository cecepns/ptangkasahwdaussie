const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const UPLOAD_DIR = path.resolve(__dirname, process.env.UPLOAD_DIR || "uploads-aussie");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(UPLOAD_DIR));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "aussie_cms",
  waitForConnections: true,
  connectionLimit: 10,
});

// ─── Helpers ────────────────────────────────────────────────

function parseJson(val, fallback = null) {
  if (val == null) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function paginate(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function paginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    req.admin = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error("Only images and PDF files are allowed"), ext && mime);
  },
});

function getUploadUrl(filename) {
  return `/uploads/${filename}`;
}

async function initAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const email = process.env.ADMIN_EMAIL || "admin@angkasahwdaussie.com";
  const [rows] = await pool.query("SELECT id FROM admins WHERE username = ?", [username]);
  if (rows.length === 0) {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO admins (username, email, password_hash, name) VALUES (?, ?, ?, ?)",
      [username, email, hash, "Administrator"]
    );
    console.log(`Admin created: ${username} / ${password}`);
  }
}

// ─── Public Routes ──────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.get("/api/content", async (_req, res) => {
  try {
    const [[settings]] = await pool.query("SELECT * FROM site_settings WHERE id = 1");
    const [services] = await pool.query(
      "SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC"
    );
    const [stats] = await pool.query(
      "SELECT * FROM stats WHERE is_active = 1 ORDER BY sort_order ASC"
    );
    const [contentItems] = await pool.query(
      "SELECT * FROM content_items WHERE is_active = 1 ORDER BY sort_order ASC"
    );
    const [pageSections] = await pool.query(
      "SELECT * FROM page_sections WHERE is_active = 1 ORDER BY sort_order ASC"
    );
    const [legalDocuments] = await pool.query(
      "SELECT * FROM legal_documents WHERE is_published = 1 ORDER BY sort_order ASC"
    );
    const [jobListings] = await pool.query(
      "SELECT * FROM job_listings WHERE status = 'active' ORDER BY sort_order ASC, published_at DESC"
    );

    const groupedItems = {};
    for (const item of contentItems) {
      if (!groupedItems[item.group_key]) groupedItems[item.group_key] = [];
      groupedItems[item.group_key].push(item);
    }

    const sections = {};
    for (const sec of pageSections) {
      if (!sections[sec.page]) sections[sec.page] = {};
      sections[sec.page][sec.section_key] = {
        ...sec,
        extra_data: parseJson(sec.extra_data),
      };
    }

    res.json({
      success: true,
      data: {
        settings: settings
          ? {
              ...settings,
              emails: parseJson(settings.emails, []),
              phones: parseJson(settings.phones, []),
              whatsapp: parseJson(settings.whatsapp, {}),
              address: parseJson(settings.address, {}),
              office_hours: parseJson(settings.office_hours, []),
              office_images: parseJson(settings.office_images, []),
            }
          : null,
        services,
        stats,
        contentItems: groupedItems,
        pageSections: sections,
        legalDocuments,
        jobListings,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch content" });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    const [result] = await pool.query(
      "INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)",
      [name.trim(), email.trim(), phone?.trim() || null, message.trim()]
    );
    res.status(201).json({ success: true, data: { id: result.insertId }, message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to submit message" });
  }
});

// ─── Auth Routes ────────────────────────────────────────────

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }
    const [rows] = await pool.query("SELECT * FROM admins WHERE username = ? OR email = ?", [
      username,
      username,
    ]);
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin.id, username: admin.username, email: admin.email, name: admin.name },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

app.get("/api/auth/profile", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, name, created_at FROM admins WHERE id = ?",
      [req.admin.id]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: "Admin not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});

// ─── Upload ─────────────────────────────────────────────────

app.post("/api/admin/upload", authMiddleware, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    data: {
      filename: req.file.filename,
      url: getUploadUrl(req.file.filename),
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
});

// ─── Generic CRUD Builder ───────────────────────────────────

function buildCrudRoutes(route, table, options = {}) {
  const {
    searchFields = ["title"],
    defaultSort = "sort_order ASC, id ASC",
    transform = null,
    beforeCreate = null,
    beforeUpdate = null,
  } = options;

  app.get(`/api/admin/${route}`, authMiddleware, async (req, res) => {
    try {
      const { page, limit, offset } = paginate(req.query);
      const search = req.query.search?.trim();
      const filter = req.query.filter;
      let where = "1=1";
      const params = [];

      if (search) {
        const conditions = searchFields.map((f) => `${f} LIKE ?`).join(" OR ");
        where += ` AND (${conditions})`;
        searchFields.forEach(() => params.push(`%${search}%`));
      }

      if (filter && options.filterField) {
        where += ` AND ${options.filterField} = ?`;
        params.push(filter);
      }

      if (req.query.group_key) {
        where += " AND group_key = ?";
        params.push(req.query.group_key);
      }

      if (req.query.status) {
        where += " AND status = ?";
        params.push(req.query.status);
      }

      const sort = req.query.sort || defaultSort;
      const [[{ total }]] = await pool.query(
        `SELECT COUNT(*) as total FROM ${table} WHERE ${where}`,
        params
      );
      const [rows] = await pool.query(
        `SELECT * FROM ${table} WHERE ${where} ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      const data = transform ? rows.map(transform) : rows;
      res.json({ success: true, data, pagination: paginationMeta(page, limit, total) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: `Failed to fetch ${table}` });
    }
  });

  app.get(`/api/admin/${route}/:id`, authMiddleware, async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!rows[0]) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: transform ? transform(rows[0]) : rows[0] });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch item" });
    }
  });

  app.post(`/api/admin/${route}`, authMiddleware, async (req, res) => {
    try {
      let body = { ...req.body };
      if (beforeCreate) body = beforeCreate(body);
      const keys = Object.keys(body).filter((k) => body[k] !== undefined);
      const values = keys.map((k) => (typeof body[k] === "object" ? JSON.stringify(body[k]) : body[k]));
      const [result] = await pool.query(
        `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
        values
      );
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [result.insertId]);
      res.status(201).json({ success: true, data: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to create item" });
    }
  });

  app.put(`/api/admin/${route}/:id`, authMiddleware, async (req, res) => {
    try {
      let body = { ...req.body };
      if (beforeUpdate) body = beforeUpdate(body);
      const keys = Object.keys(body).filter((k) => body[k] !== undefined);
      if (keys.length === 0) {
        return res.status(400).json({ success: false, message: "No fields to update" });
      }
      const values = keys.map((k) => (typeof body[k] === "object" ? JSON.stringify(body[k]) : body[k]));
      await pool.query(
        `UPDATE ${table} SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
        [...values, req.params.id]
      );
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!rows[0]) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to update item" });
    }
  });

  app.delete(`/api/admin/${route}/:id`, authMiddleware, async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!rows[0]) return res.status(404).json({ success: false, message: "Not found" });

      if (options.fileField && rows[0][options.fileField]) {
        const filename = path.basename(rows[0][options.fileField]);
        const filePath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to delete item" });
    }
  });
}

// ─── Site Settings ──────────────────────────────────────────

app.get("/api/admin/settings", authMiddleware, async (_req, res) => {
  try {
    const [[settings]] = await pool.query("SELECT * FROM site_settings WHERE id = 1");
    if (!settings) return res.status(404).json({ success: false, message: "Settings not found" });
    res.json({
      success: true,
      data: {
        ...settings,
        emails: parseJson(settings.emails, []),
        phones: parseJson(settings.phones, []),
        whatsapp: parseJson(settings.whatsapp, {}),
        address: parseJson(settings.address, {}),
        office_hours: parseJson(settings.office_hours, []),
        office_images: parseJson(settings.office_images, []),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
});

app.put("/api/admin/settings", authMiddleware, async (req, res) => {
  try {
    const fields = [
      "company_name", "short_name", "tagline", "director", "director_title", "about",
      "emails", "phones", "whatsapp", "address", "office_hours", "office_images",
      "seo_title", "seo_description", "hero_badge", "hero_title", "hero_subtitle",
    ];
    const updates = {};
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates[f] = typeof req.body[f] === "object" ? JSON.stringify(req.body[f]) : req.body[f];
      }
    }
    const keys = Object.keys(updates);
    if (keys.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }
    await pool.query(
      `UPDATE site_settings SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = 1`,
      Object.values(updates)
    );
    const [[settings]] = await pool.query("SELECT * FROM site_settings WHERE id = 1");
    res.json({
      success: true,
      data: {
        ...settings,
        emails: parseJson(settings.emails, []),
        phones: parseJson(settings.phones, []),
        whatsapp: parseJson(settings.whatsapp, {}),
        address: parseJson(settings.address, {}),
        office_hours: parseJson(settings.office_hours, []),
        office_images: parseJson(settings.office_images, []),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update settings" });
  }
});

// ─── CRUD Routes ────────────────────────────────────────────

buildCrudRoutes("services", "services", {
  searchFields: ["title", "description"],
});

buildCrudRoutes("stats", "stats", {
  searchFields: ["value", "label"],
});

buildCrudRoutes("content-items", "content_items", {
  searchFields: ["title", "description", "group_key"],
});

buildCrudRoutes("page-sections", "page_sections", {
  searchFields: ["page", "section_key", "title", "subtitle"],
  defaultSort: "page ASC, sort_order ASC",
});

buildCrudRoutes("legal-documents", "legal_documents", {
  searchFields: ["title", "doc_type", "description"],
  fileField: "file_url",
});

buildCrudRoutes("job-listings", "job_listings", {
  searchFields: ["title", "location", "description"],
  filterField: "status",
  fileField: "image_url",
});

buildCrudRoutes("contact-submissions", "contact_submissions", {
  searchFields: ["name", "email", "phone", "message"],
  defaultSort: "created_at DESC",
});

// ─── Dashboard Stats ──────────────────────────────────────────

app.get("/api/admin/dashboard", authMiddleware, async (_req, res) => {
  try {
    const [[{ services }]] = await pool.query("SELECT COUNT(*) as services FROM services WHERE is_active = 1");
    const [[{ jobs }]] = await pool.query("SELECT COUNT(*) as jobs FROM job_listings WHERE status = 'active'");
    const [[{ legal }]] = await pool.query("SELECT COUNT(*) as legal FROM legal_documents WHERE is_published = 1");
    const [[{ contacts }]] = await pool.query("SELECT COUNT(*) as contacts FROM contact_submissions WHERE status = 'new'");
    res.json({
      success: true,
      data: { services, jobs, legal, newContacts: contacts },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch dashboard" });
  }
});

// ─── Error Handler ──────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

// ─── Start ──────────────────────────────────────────────────

async function start() {
  try {
    await pool.query("SELECT 1");
    await initAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Uploads: ${UPLOAD_DIR}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    console.error("Make sure MySQL is running and database is imported from sql/database.sql");
    process.exit(1);
  }
}

start();
