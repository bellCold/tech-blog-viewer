export type StatusLevel = "operational" | "degraded" | "outage" | "unknown";

export interface ServiceStatus {
  name: string;
  status: StatusLevel;
  description: string;
  url: string;
}

export async function fetchAllStatuses(): Promise<ServiceStatus[]> {
  try {
    const res = await fetch("/api/status", { cache: "no-store" });
    return await res.json();
  } catch {
    return [];
  }
}

export function overallStatus(statuses: ServiceStatus[]): StatusLevel {
  if (statuses.some((s) => s.status === "outage")) return "outage";
  if (statuses.some((s) => s.status === "degraded")) return "degraded";
  if (statuses.some((s) => s.status === "unknown")) return "unknown";
  return "operational";
}
