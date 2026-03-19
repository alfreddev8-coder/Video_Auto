import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

export const turso = createClient({
  url,
  authToken,
});

export async function initDb() {
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
}
