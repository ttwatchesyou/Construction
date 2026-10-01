import "dotenv/config";
import { pool } from "../src/db.js";

const required = ["JWT_SECRET", "FRONTEND_ORIGIN", "DB_HOST", "DB_USER", "DB_NAME"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required env: ${missing.join(", ")}`);
  process.exit(1);
}

if (process.env.NODE_ENV === "production") {
  const weakSecrets = new Set(["change-me-before-production", "local-dev-secret-change-on-server"]);
  if (weakSecrets.has(process.env.JWT_SECRET) || process.env.JWT_SECRET.length < 32) {
    console.error("JWT_SECRET must be changed to a long random value in production.");
    process.exit(1);
  }

  if (process.env.COOKIE_SECURE !== "true") {
    console.error("COOKIE_SECURE=true is required for Vercel/Tailscale Funnel cross-site cookies.");
    process.exit(1);
  }

  if (process.env.ALLOW_DEMO_LOGIN === "true") {
    console.error("ALLOW_DEMO_LOGIN must be false in production.");
    process.exit(1);
  }
}

try {
  await pool.query("select 1 as ok");
  console.log("Configuration OK. Database connection OK.");
} catch (error) {
  console.error("Database connection failed.");
  console.error(error.message);
  process.exit(1);
} finally {
  await pool.end();
}
