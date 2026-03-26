import { NextResponse } from "next/server";

type StatusLevel = "operational" | "degraded" | "outage" | "unknown";

interface ServiceResult {
  name: string;
  status: StatusLevel;
  description: string;
  url: string;
}

const STATUSPAGE_SERVICES = [
  { name: "GitHub", endpoint: "https://www.githubstatus.com/api/v2/status.json", url: "https://www.githubstatus.com" },
  { name: "Claude", endpoint: "https://status.claude.com/api/v2/status.json", url: "https://status.claude.com" },
  { name: "GPT", endpoint: "https://status.openai.com/api/v2/status.json", url: "https://status.openai.com" },
  { name: "Postman", endpoint: "https://status.postman.com/api/v2/status.json", url: "https://status.postman.com" },
  { name: "Notion", endpoint: "https://www.notion-status.com/api/v2/status.json", url: "https://www.notion-status.com" },
];

function parseIndicator(indicator: string): StatusLevel {
  switch (indicator) {
    case "none": return "operational";
    case "minor": return "degraded";
    case "major":
    case "critical": return "outage";
    default: return "unknown";
  }
}

async function fetchStatuspage(svc: typeof STATUSPAGE_SERVICES[0]): Promise<ServiceResult> {
  try {
    const res = await fetch(svc.endpoint, { cache: "no-store" });
    const data = await res.json();
    return {
      name: svc.name,
      status: parseIndicator(data.status?.indicator),
      description: data.status?.description || "Unknown",
      url: svc.url,
    };
  } catch {
    return { name: svc.name, status: "unknown", description: "Failed to fetch", url: svc.url };
  }
}

async function fetchSlack(): Promise<ServiceResult> {
  try {
    const res = await fetch("https://slack-status.com/api/v2.0.0/current", { cache: "no-store" });
    const data = await res.json();
    const hasIncidents = data.active_incidents?.length > 0;
    return {
      name: "Slack",
      status: hasIncidents ? "degraded" : "operational",
      description: hasIncidents ? `${data.active_incidents.length} active incident(s)` : "All Systems Operational",
      url: "https://status.slack.com",
    };
  } catch {
    return { name: "Slack", status: "unknown", description: "Failed to fetch", url: "https://status.slack.com" };
  }
}

async function fetchDockerHub(): Promise<ServiceResult> {
  try {
    const res = await fetch("https://www.dockerstatus.com", { cache: "no-store" });
    const html = await res.text();
    const statuses = [...html.matchAll(/component-status"[^>]*>([^<]+)/g)].map(m => m[1].trim());
    const hasOutage = statuses.some(s => s !== "Operational");
    return {
      name: "Docker Hub",
      status: hasOutage ? "degraded" : "operational",
      description: hasOutage ? "Some Components Degraded" : "All Systems Operational",
      url: "https://www.dockerstatus.com",
    };
  } catch {
    return { name: "Docker Hub", status: "unknown", description: "Failed to fetch", url: "https://www.dockerstatus.com" };
  }
}

export async function GET() {
  const results = await Promise.all([
    ...STATUSPAGE_SERVICES.map(fetchStatuspage),
    fetchSlack(),
    fetchDockerHub(),
  ]);

  return NextResponse.json(results, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
