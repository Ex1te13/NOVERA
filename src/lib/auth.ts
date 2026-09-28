import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "novera-session-secret-change-in-production-32chars"
);

const COOKIE = "novera_admin";

export async function loginAdmin(login: string, password: string) {
  const admin = db.prepare("SELECT * FROM admins WHERE login = ?").get(login) as
    | { id: number; login: string; password_hash: string }
    | undefined;
  if (!admin) return false;
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return false;
  const token = await new SignJWT({ sub: admin.login })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return true;
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload.sub as string) || null;
  } catch {
    return null;
  }
}
