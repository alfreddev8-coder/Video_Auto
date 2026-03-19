import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET() {
  try {
    const result = await turso.execute("SELECT * FROM projects ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
