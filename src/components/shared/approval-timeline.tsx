"use client";

import type { ApprovalLog } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  Clock,
  Send,
  X,
} from "lucide-react";

const ACTION_CONFIG: Record<string, { icon: typeof Check; color: string; bg: string; border: string }> = {
  approve: { icon: Check, color: "text-green-600", bg: "bg-green-50", border: "border-green-500" },
  revise: { icon: X, color: "text-red-600", bg: "bg-rose-50", border: "border-red-500" },
  submit: { icon: Send, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-600" },
};

const defaultCfg = { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-500" };

export function ApprovalTimeline({ logs }: { logs: ApprovalLog[] }) {
  if (!logs.length) return null;

  return (
    <div className="flex flex-col">
      {logs.map((log, i) => {
        const isLast = i === logs.length - 1;
        const cfg = ACTION_CONFIG[log.action] ?? defaultCfg;
        const Icon = cfg.icon;

        return (
          <div key={log.id} className="flex gap-2.5">
            {/* timeline dot + line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                  cfg.bg,
                  cfg.border,
                )}
              >
                <Icon className={cn("size-3", cfg.color)} />
              </div>
              {!isLast && <div className="my-1 min-h-3 w-0.5 flex-1 bg-slate-200" />}
            </div>

            {/* content */}
            <div className={cn("flex-1 pt-0.5", !isLast && "pb-3")}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-slate-900">{log.actorName}</span>
                  <span className="ml-1.5 text-[11px] text-slate-500">{log.actorRole}</span>
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">
                  {log.createdAt.slice(0, 10)}
                </span>
              </div>
              {log.reason && (
                <div className="mt-1 rounded-r-lg rounded-bl-lg bg-[#F8F7FC] px-2 py-1 text-[11px] leading-relaxed text-slate-600">
                  {log.reason}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
