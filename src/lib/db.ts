import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

const dataDir = process.env.VERCEL ? path.join("/tmp", "novera") : path.join(process.cwd(), "data");
const uploadDir = path.join(dataDir, "uploads");
const dbPath = path.join(process.cwd(), "data", "novera.db");

try {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
} catch {
  /* на Vercel диск только для чтения, файлы заявок всё равно временные */
}

const SCHEMA = `
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
`;

type SqlValue = string | number | bigint | null | Uint8Array;
type Driver = {
  get<T>(sql: string, args: unknown[]): Promise<T | undefined>;
  all<T>(sql: string, args: unknown[]): Promise<T[]>;
  run(sql: string, args: unknown[]): Promise<{ lastInsertRowid: number }>;
  exec(sql: string): Promise<void>;
};

export function remoteDatabaseEnabled() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

/** На Vercel локальный файл не сохраняется, поэтому без Turso писать некуда. */
export function databaseConfigured() {
  return remoteDatabaseEnabled() || !process.env.VERCEL;
}

function sqlArgs(args: unknown[]): SqlValue[] {
  return args.map((value) => (value === undefined ? null : (value as SqlValue)));
}

function plain<T>(row: Record<string, unknown>, columns: string[]): T {
  const out: Record<string, unknown> = {};
  for (const column of columns) {
    const value = row[column];
    out[column] = typeof value === "bigint" ? Number(value) : value;
  }
  return out as T;
}

async function remoteDriver(): Promise<Driver> {
  const { createClient } = await import("@libsql/client/http");
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!.replace(/^libsql:\/\//, "https://"),
    authToken: process.env.TURSO_AUTH_TOKEN,
    intMode: "number",
  });
  return {
    exec: (sql) => client.executeMultiple(sql),
    get: async <T,>(sql: string, args: unknown[]) => {
      const result = await client.execute({ sql, args: sqlArgs(args) });
      const row = result.rows[0] as unknown as Record<string, unknown> | undefined;
      return row ? plain<T>(row, result.columns) : undefined;
    },
    all: async <T,>(sql: string, args: unknown[]) => {
      const result = await client.execute({ sql, args: sqlArgs(args) });
      return result.rows.map((row) => plain<T>(row as unknown as Record<string, unknown>, result.columns));
    },
    run: async (sql, args) => {
      const result = await client.execute({ sql, args: sqlArgs(args) });
      return { lastInsertRowid: Number(result.lastInsertRowid ?? 0) };
    },
  };
}

async function localDriver(): Promise<Driver> {
  const { default: Database } = await import("better-sqlite3");
  const database = new Database(dbPath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  return {
    exec: async (sql) => {
      database.exec(sql);
    },
    get: async <T,>(sql: string, args: unknown[]) => database.prepare(sql).get(...sqlArgs(args)) as T | undefined,
    all: async <T,>(sql: string, args: unknown[]) => database.prepare(sql).all(...sqlArgs(args)) as T[],
    run: async (sql, args) => ({ lastInsertRowid: Number(database.prepare(sql).run(...sqlArgs(args)).lastInsertRowid) }),
  };
}

async function seed(driver: Driver) {
  const login = process.env.ADMIN_LOGIN || "admin";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return;
  const existing = await driver.get<{ id: number }>("SELECT id FROM admins WHERE login = ?", [login]);
  if (existing) return;
  try {
    await driver.run("INSERT INTO admins (login, password_hash) VALUES (?, ?)", [login, bcrypt.hashSync(password, 10)]);
  } catch {
    /* параллельный первый запрос */
  }
}

let opening: Promise<Driver> | undefined;

async function driver() {
  if (!databaseConfigured()) throw new Error("База для публичного сайта не подключена");
  if (!opening) {
    opening = (remoteDatabaseEnabled() ? remoteDriver() : localDriver())
      .then(async (next) => {
        await next.exec(SCHEMA);
        await seed(next);
        return next;
      })
      .catch((error) => {
        opening = undefined;
        throw error;
      });
  }
  return opening;
}

export async function dbGet<T>(sql: string, args: unknown[] = []) {
  return (await driver()).get<T>(sql, args);
}

export async function dbAll<T>(sql: string, args: unknown[] = []) {
  return (await driver()).all<T>(sql, args);
}

export async function dbRun(sql: string, args: unknown[] = []) {
  return (await driver()).run(sql, args);
}

export { uploadDir };

export async function getSetting(key: string): Promise<string> {
  const row = await dbGet<{ value: string }>("SELECT value FROM settings WHERE key = ?", [key]);
  return row?.value || process.env[key] || "";
}

export async function setSetting(key: string, value: string) {
  await dbRun("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [key, value]);
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
