import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "./db.js";

const cookieName = "construction_token";

function cookieOptions() {
  const secure = process.env.COOKIE_SECURE === "true";
  return {
    sameSite: secure ? "none" : "lax",
    secure,
  };
}

export function setAuthCookie(res, user) {
  const token = jwt.sign({ sub: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.cookie(cookieName, token, {
    ...cookieOptions(),
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(cookieName, cookieOptions());
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.[cookieName];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export async function findUser(username, password) {
  try {
    const users = await query(
      "select id, username, password_hash, role, display_name from users where username = :username and is_active = 1 limit 1",
      { username },
    );
    const user = users[0];
    if (user && await bcrypt.compare(password, user.password_hash)) {
      return { id: user.id, username: user.username, role: user.role || "admin", displayName: user.display_name || user.username };
    }
  } catch (error) {
    if (process.env.ALLOW_DEMO_LOGIN !== "true") throw error;
  }

  if (
    process.env.ALLOW_DEMO_LOGIN === "true" &&
    username === process.env.DEMO_USERNAME &&
    password === process.env.DEMO_PASSWORD
  ) {
    return { id: "demo-admin", username, role: "admin", displayName: "สมชาย ใจดี" };
  }

  return null;
}
