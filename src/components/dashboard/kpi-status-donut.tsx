"use client";

import type { ApprovalStatus } from "@/lib/types";

type Slice = {
  label: string;
  count: number;
  color: string;
};

export function KpiStatusDonut({ statuses }: { statuses: ApprovalStatus[] }) {
  const total = statuses.length;
  const approved = statuses.filter((s) => s === "approved").length;
  const pending = statuses.filter((s) => s.startsWith("pending")).length;
  const returned = statuses.filter((s) => s === "revision_requested").length;
  const draft = statuses.filter((s) => s === "draft").length;

  const slices: Slice[] = [
    { label: "อนุมัติแล้ว", count: approved, color: "#16A34A" },
    { label: "รออนุมัติ", count: pending, color: "#D97706" },
    { label: "ส่งกลับ", count: returned, color: "#DC2626" },
    { label: "ฉบับร่าง", count: draft, color: "#8B5CF6" },
  ].filter((s) => s.count > 0);

  const r = 42;
  const circ = 2 * Math.PI * r;
  let offset = circ * 0.25;
  const pctApproved = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="flex items-center justify-center gap-4">
      <svg width={120} height={120} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={r} fill="none" stroke="#F3F0FF" strokeWidth={16} />
        {slices.map((s) => {
          const pct = total > 0 ? s.count / total : 0;
          const dash = pct * circ;
          const gap = circ - dash;
          const el = (
            <circle
              key={s.label}
              cx={50}
              cy={50}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={16}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset + circ * 0.25}
            />
          );
          offset += dash;
          return el;
        })}
        <text
          x={50}
          y={46}
          textAnchor="middle"
          fontSize={16}
          fontWeight={700}
          fill="#1A1A2E"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {pctApproved}%
        </text>
        <text
          x={50}
          y={59}
          textAnchor="middle"
          fontSize={8}
          fill="#94A3B8"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          อนุมัติ
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <div
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ background: s.color }}
            />
            <span className="text-slate-600">{s.label}</span>
            <span className="ml-auto pl-2 font-mono text-slate-400">
              {s.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
