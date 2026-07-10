import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { admin: boolean } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { admin: boolean };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  const cookie = req.cookies.get("admin_token");
  return cookie?.value || null;
}

export function isAdminAuthenticated(req: NextRequest): boolean {
  const token = getTokenFromRequest(req);
  if (!token) return false;
  const payload = verifyToken(token);
  return payload?.admin === true;
}
