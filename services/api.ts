import { buildApiUrl } from "@/lib/api";
import { CreateProjectPayload } from "@/types/project";

export async function analyzeProject(data: CreateProjectPayload, userId?: number) {
  const res = await fetch(buildApiUrl("/api/projects/analyze"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ...data, user_id: userId })
  });

  if (!res.ok) {
    let errMsg = `Failed to analyze project: ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.message) errMsg = `Failed to analyze project: ${body.message}`;
    } catch (e) {
      // ignore json parse errors
    }
    throw new Error(errMsg);
  }

  return res.json();
}

export async function getProjectById(id: string) {
  if (!id || id === "undefined") {
    throw new Error("Invalid project id provided to getProjectById");
  }
  const res = await fetch(buildApiUrl(`/api/projects/${id}`), {
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }

  return res.json();
}

export async function getMetrics(range: string = '24h', userId?: number | null) {
  let url = buildApiUrl(`/api/metrics?range=${range}`);
  if (userId) {
    url += `&user_id=${userId}`;
  }

  const res = await fetch(url, {
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch metrics");
  }

  return res.json();
}
