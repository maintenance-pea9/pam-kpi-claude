import type { DashboardStat } from "@/lib/dashboard-analytics";

const toneStyles: Record<
  DashboardStat["tone"],
  { color: string; borderColor: string; background: string }
> = {
  success: {
    color: "#16A34A",
    borderColor: "#DCFCE7",
    background: "#FFFFFF",
  },
  warning: {
    color: "#D97706",
    borderColor: "#FEF3C7",
    background: "#FFFFFF",
  },
  danger: {
    color: "#DC2626",
    borderColor: "#FEE2E2",
    background: "#FFFFFF",
  },
  info: {
    color: "#6D28D9",
    borderColor: "#EDE9FE",
    background: "#FFFFFF",
  },
};

export function StatCards({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl shadow-sm"
          style={{
            background: toneStyles[stat.tone].background,
            border: `1px solid ${toneStyles[stat.tone].borderColor}`,
            padding: "8px 12px",
          }}
        >
          <div className="mb-1 text-[10px] font-semibold tracking-[0.04em] text-slate-400 uppercase">
            {stat.label}
          </div>
          <div className="mb-1 flex items-baseline gap-1.5">
            <span
              className="font-mono text-[22px] leading-none font-bold"
              style={{ color: toneStyles[stat.tone].color }}
            >
              {stat.value}
            </span>
            <span className="text-[13px] text-slate-400">รายการ</span>
          </div>
          <div className="truncate text-[10px] text-slate-400">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}
