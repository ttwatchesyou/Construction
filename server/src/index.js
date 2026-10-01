import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { clearAuthCookie, findUser, requireAuth, setAuthCookie } from "./auth.js";
import { loadDashboard } from "./dashboard.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000").split(",").map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || frontendOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/auth/login", async (req, res, next) => {
  try {
    const user = await findUser(req.body?.username, req.body?.password);
    if (!user) return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    setAuthCookie(res, user);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

app.get("/auth/me", requireAuth, (req, res) => res.json({ user: req.user }));

app.post("/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get("/dashboard", requireAuth, async (_req, res, next) => {
  try {
    res.json(await loadDashboard());
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Backend service error" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Construction backend listening on 0.0.0.0:${port}`);
});
