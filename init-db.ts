import { initDb } from "./src/lib/turso";

async function run() {
  console.log("Initializing database...");
  try {
    await initDb();
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

run();
