"use client";

import type { DashboardInsight } from "@/lib/dashboard-analytics";
import { AlertTriangle, CheckCircle2, CircleDot, Clock3 } from "lucide-react";

const toneStyles: Record<
  DashboardInsight["tone"],
  {
    icon: typeof AlertTriangle;
    color: string;
    background: string;
    borderColor: string;
  }
> = {
  danger: {
    icon: AlertTriangle,
    color: "#DC2626",
    background: "#FFF1F2",
    borderColor: "#FEE2E2",
  },
  warning: {
    icon: Clock3,
    color: "#D97706",
    background: "#FFFBEB",
    borderColor: "#FEF3C7",
  },
  success: {
    icon: CheckCircle2,
    color: "#16A34A",
    background: "#F0FDF4",
    borderColor: "#DCFCE7",
  },
  info: {
    icon: CircleDot,
    color: "#6D28D9",
    background: "#F5F3FF",
    borderColor: "#EDE9FE",
  },
};

export function DashboardInsights({
  insights,
}: {
  insights: DashboardInsight[];
}) {
  return (
    <div className="space-y-3">
      {insights.map((insight) => {
        const style = toneStyles[insight.tone];
        const Icon = style.icon;

        return (
          <div
            key={insight.title}
            className="rounded-lg border px-3.5 py-3"
            style={{
              background: style.background,
              borderColor: style.borderColor,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white"
                style={{ color: style.color }}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <div
                  className="text-[13px] font-semibold"
                  style={{ color: style.color }}
                >
                  {insight.title}
                </div>
                <div className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  {insight.description}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
