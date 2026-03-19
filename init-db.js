import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
  process.exit(1);
}

const turso = createClient({ url, authToken });

async function init() {
  console.log("Initializing database...");
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        niche TEXT NOT NULL,
        script TEXT,
        title TEXT,
        description TEXT,
        voice_type TEXT DEFAULT 'ai',
        voice_url TEXT,
        video_url TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  } finally {
    process.exit(0);
  }
}

init();
