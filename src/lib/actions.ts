"use server";

import { v4 as uuidv4 } from "uuid";
import { turso } from "./turso";
import { generateScript, generateMetadata } from "./groq";

export async function createProject(niche: string, customScript?: string) {
  const id = uuidv4();
  let script = customScript;

  if (!script) {
    script = await generateScript(niche);
  }

  const { titles, description } = await generateMetadata(script!);

  await turso.execute({
    sql: "INSERT INTO projects (id, niche, script, title, description, status) VALUES (?, ?, ?, ?, ?, ?)",
    args: [id, niche, script, titles[0], description, "pending"],
  });

  return { id, script, titles, description };
}

export async function triggerWorkflow(projectId: string) {
  const githubToken = process.env.GH_TOKEN;
  const repoOwner = process.env.GH_OWNER;
  const repoName = process.env.GH_REPO;

  if (!githubToken || !repoOwner || !repoName) {
    throw new Error("GitHub credentials not configured");
  }

  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/generate_video.yml/dispatches`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${githubToken}`,
      "Accept": "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      ref: "main",
      inputs: {
        projectId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to trigger GitHub Action");
  }

  await turso.execute({
    sql: "UPDATE projects SET status = ? WHERE id = ?",
    args: ["processing", projectId],
  });
}
