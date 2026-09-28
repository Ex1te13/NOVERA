import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

const dataDir = process.env.VERCEL ? path.join("/tmp", "novera") : path.join(process.cwd(), "data");
const uploadDir = path.join(dataDir, "uploads");
const dbPath = path.join(dataDir, "novera.db");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

declare global {
  // eslint-disable-next-line no-var
  var __noveraDb: Database.Database | undefined;
}

function open() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    region TEXT,
    services TEXT,
    area REAL,
    description TEXT,
    files TEXT,
    calculator TEXT,
    source TEXT,
    referrer TEXT,
    utm TEXT,
    referral_code TEXT,
    landing_page TEXT,
    visitor_id TEXT,
    user_agent TEXT,
    ip TEXT,
    status TEXT DEFAULT 'new'
  );
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    session_id TEXT,
    path TEXT,
    referrer TEXT,
    utm TEXT,
    referral_code TEXT,
    user_agent TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at);
  CREATE INDEX IF NOT EXISTS idx_visits_ref ON visits(referral_code);
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    session_id TEXT,
    type TEXT NOT NULL,
    payload TEXT,
    path TEXT,
    referral_code TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
  CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
  CREATE TABLE IF NOT EXISTS first_visits (
    visitor_id TEXT PRIMARY KEY,
    first_seen TEXT NOT NULL,
    referral_code TEXT,
    utm TEXT,
    referrer TEXT
  );
  CREATE TABLE IF NOT EXISTS referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
  `);

  const login = process.env.ADMIN_LOGIN || "admin";
  const password = process.env.ADMIN_PASSWORD || "NoveraAdmin2026";
  const existing = db.prepare("SELECT id FROM admins WHERE login = ?").get(login) as { id: number } | undefined;
  if (!existing) {
    try {
      db.prepare("INSERT INTO admins (login, password_hash) VALUES (?, ?)").run(login, bcrypt.hashSync(password, 10));
    } catch {
      /* parallel workers */
    }
  }
  return db;
}

let cached: Database.Database | undefined;

function getDb() {
  if (cached) return cached;
  if (globalThis.__noveraDb) {
    cached = globalThis.__noveraDb;
    return cached;
  }
  cached = open();
  if (process.env.NODE_ENV !== "production") globalThis.__noveraDb = cached;
  return cached;
}

/** База открывается при первом запросе, а не во время сборки страниц. */
export const db = new Proxy({} as Database.Database, {
  get(_target, prop, receiver) {
    const database = getDb();
    const value = Reflect.get(database, prop, receiver);
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(database) : value;
  },
});

export { uploadDir };

export function getSetting(key: string): string {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined;
  return row?.value || process.env[key] || "";
}

export function setSetting(key: string, value: string) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(
    key,
    value
  );
}

export type LeadRow = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  region: string | null;
  services: string | null;
  area: number | null;
  description: string | null;
  files: string | null;
  calculator: string | null;
  source: string | null;
  referrer: string | null;
  utm: string | null;
  referral_code: string | null;
  landing_page: string | null;
  visitor_id: string | null;
  user_agent: string | null;
  ip: string | null;
  status: string | null;
};
