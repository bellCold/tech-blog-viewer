"use client";

import { useEffect, useState } from "react";
import {
  ServiceStatus,
  StatusLevel,
  fetchAllStatuses,
  overallStatus,
} from "@/lib/status";

const STATUS_DOT: Record<StatusLevel, string> = {
  operational: "bg-green-500",
  degraded: "bg-yellow-500",
  outage: "bg-red-500",
  unknown: "bg-gray-300",
};

const STATUS_BG: Record<StatusLevel, string> = {
  operational: "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800",
  degraded: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800",
  outage: "bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800",
  unknown: "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700",
};

const STATUS_TEXT: Record<StatusLevel, string> = {
  operational: "text-green-700",
  degraded: "text-yellow-700",
  outage: "text-red-700",
  unknown: "text-gray-500",
};

const STATUS_LABEL: Record<StatusLevel, string> = {
  operational: "All Operational",
  degraded: "일부 장애",
  outage: "장애 발생",
  unknown: "확인 중",
};

export default function StatusSidebar({ top }: { top: number }) {
  const [statuses, setStatuses] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetchAllStatuses()
        .then(setStatuses)
        .catch(console.error)
        .finally(() => setLoading(false));
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const overall = overallStatus(statuses);

  if (top === 0) return null;

  return (
    <div
      className="absolute hidden 2xl:block"
      style={{ top, left: "calc(50% - 620px - 14rem)" }}
    >
      <div className="w-52">
        <div className={`rounded-2xl border p-4 ${STATUS_BG[overall]}`}>
          <div className="mb-3 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[overall]}`} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              서비스 상태
            </h3>
          </div>
          <p className={`mb-4 text-sm font-semibold ${STATUS_TEXT[overall]}`}>
            {loading ? "확인 중..." : STATUS_LABEL[overall]}
          </p>
          <div className="space-y-2.5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-5 animate-pulse rounded bg-white/50 dark:bg-gray-700/50" />
                ))
              : statuses.map((svc) => (
                  <a
                    key={svc.name}
                    href={svc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={svc.description}
                    className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2 transition-colors hover:bg-white dark:bg-gray-800/60 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[svc.status]}`} />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{svc.name}</span>
                    </div>
                    <span className={`text-[10px] font-medium ${STATUS_TEXT[svc.status]}`}>
                      {svc.status === "operational" ? "UP" : svc.status === "unknown" ? "?" : "DOWN"}
                    </span>
                  </a>
                ))}
          </div>
          <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500">30초마다 자동 갱신</p>
        </div>
      </div>
    </div>
  );
}
