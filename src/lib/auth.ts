import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { dbGet } from "./db";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "novera-session-secret-change-in-production-32chars"
);

const COOKIE = "novera_admin";

// привязка сессии к паролю: после смены пароля старые входы перестают действовать
const passwordStamp = (hash: string) => hash.slice(-12);

export async function startAdminSession(login: string, passwordHash: string) {
  const token = await new SignJWT({ sub: login, pw: passwordStamp(passwordHash) })
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
}

export async function loginAdmin(login: string, password: string) {
  const admin = await dbGet<{ id: number; login: string; password_hash: string }>("SELECT * FROM admins WHERE login = ?", [login]);
  if (!admin) return false;
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return false;
  await startAdminSession(admin.login, admin.password_hash);
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
    const login = payload.sub as string;
    if (!login) return null;
    const admin = await dbGet<{ password_hash: string }>("SELECT password_hash FROM admins WHERE login = ?", [login]);
    if (!admin || payload.pw !== passwordStamp(admin.password_hash)) return null;
    return login;
  } catch {
    return null;
  }
}
