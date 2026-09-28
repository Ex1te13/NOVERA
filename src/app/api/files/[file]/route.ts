import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getAdminSession } from "@/lib/auth";
import { uploadDir } from "@/lib/db";

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
};

export async function GET(_req: NextRequest, ctx: { params: Promise<{ file: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { file } = await ctx.params;
  const name = path.basename(file);
  const abs = path.join(uploadDir, name);
  if (!abs.startsWith(uploadDir) || !fs.existsSync(abs)) return NextResponse.json({ error: "404" }, { status: 404 });
  const buf = fs.readFileSync(abs);
  const ext = path.extname(name).toLowerCase();
  return new NextResponse(buf, {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(name.replace(/^\d+-\w+-/, ""))}`,
    },
  });
}
