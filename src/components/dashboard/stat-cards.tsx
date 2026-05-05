import type { ApprovalStatus } from "@/lib/types";

type Stat = {
  label: string;
  value: number;
  unit: string;
  sub: string;
  color: string;
  borderColor: string;
};

export function StatCards({
  statuses,
  pctApproved,
}: {
  statuses: ApprovalStatus[];
  pctApproved: number;
}) {
  const total = statuses.length;
  const approved = statuses.filter((s) => s === "approved").length;
  const pending = statuses.filter((s) => s.startsWith("pending")).length;
  const returned = statuses.filter((s) => s === "revision_requested").length;
  const draft = statuses.filter((s) => s === "draft").length;

  const stats: Stat[] = [
    {
      label: "KPI ทั้งหมด",
      value: total,
      unit: "รายการ",
      sub: `ฉบับร่าง ${draft} รายการ`,
      color: "#6D28D9",
      borderColor: "#EDE9FE",
    },
    {
      label: "อนุมัติแล้ว",
      value: approved,
      unit: "รายการ",
      sub: `${pctApproved}% ของทั้งหมด`,
      color: "#16A34A",
      borderColor: "#DCFCE7",
    },
    {
      label: "รออนุมัติ",
      value: pending,
      unit: "รายการ",
      sub: "ต้องการการดำเนินการ",
      color: "#D97706",
      borderColor: "#FEF3C7",
    },
    {
      label: "ส่งกลับแก้ไข",
      value: returned,
      unit: "รายการ",
      sub: "รอการแก้ไข",
      color: "#DC2626",
      borderColor: "#FEE2E2",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-white shadow-sm"
          style={{
            border: `1px solid ${stat.borderColor}`,
            padding: "16px 20px",
          }}
        >
          <div className="mb-2.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {stat.label}
          </div>
          <div className="mb-2 flex items-baseline gap-1.5">
            <span
              className="font-mono text-[32px] leading-none font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
            <span className="text-[13px] text-slate-400">{stat.unit}</span>
          </div>
          <div className="text-[11px] text-slate-400">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}
