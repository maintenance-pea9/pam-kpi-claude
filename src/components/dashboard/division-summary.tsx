"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DivBadge } from "@/components/shared/div-badge";
import { LevelBadge } from "@/components/shared/level-badge";
import type { DashboardDivisionRow } from "@/lib/dashboard-analytics";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export function DivisionSummary({ rows }: { rows: DashboardDivisionRow[] }) {
  const router = useRouter();
  const [expandedDivision, setExpandedDivision] = useState<string | null>(null);

  const navigateToReport = (reportId: string) => {
    router.push(`/reports/${reportId}`, { transitionTypes: ["nav-forward"] });
  };

  if (rows.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-[13px] text-slate-400">
        ยังไม่มีผลรายเดือนที่อนุมัติแล้วในเดือนที่เลือก
      </div>
    );
  }

  return (
    <div>
      {rows.map((row, index) => {
        const isOpen = expandedDivision === row.division;
        const avgColor =
          row.avg >= 80 ? "#16A34A" : row.avg >= 60 ? "#D97706" : "#DC2626";
        const deltaColor = row.delta >= 0 ? "#16A34A" : "#DC2626";

        return (
          <div
            key={row.division}
            className={cn(index < rows.length - 1 && "border-b border-slate-100")}
          >
            <button
              type="button"
              onClick={() =>
                setExpandedDivision(isOpen ? null : row.division)
              }
              className={cn(
                "flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors",
                isOpen ? "bg-purple-50" : "bg-white hover:bg-[#FAF9FF]",
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-md transition-all",
                  isOpen ? "bg-purple-700 text-white" : "bg-slate-100 text-slate-500",
                )}
              >
                <ChevronRight
                  className={cn("size-3 transition-transform", isOpen && "rotate-90")}
                />
              </span>
              <DivBadge div={row.division} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold text-slate-800">
                  {row.name}
                </div>
                <div className="mt-px truncate text-[10px] text-slate-400">
                  รายงานอนุมัติแล้ว {row.total} รายการ · ระดับ 4-5 {row.level45} ·
                  ต้องติดตาม {row.lowScore}
                </div>
              </div>
              <MiniSparkline row={row} />
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className="font-mono text-[16px] leading-none font-bold"
                  style={{ color: avgColor }}
                >
                  {row.avg}%
                </span>
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold"
                  style={{
                    color: deltaColor,
                    background: row.delta >= 0 ? "#F0FDF4" : "#FEF2F2",
                  }}
                >
                  {row.delta >= 0 ? "+" : ""}
                  {row.delta}%
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-purple-100 bg-[#FAF9FF] px-4 py-2.5">
                {row.kpis.length === 0 ? (
                  <div className="py-6 text-center text-[12px] text-slate-400">
                    ยังไม่มีผลรายเดือนที่อนุมัติแล้ว
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-purple-100 bg-white">
                    <table className="w-full min-w-[760px] border-collapse">
                      <thead>
                        <tr className="bg-[#FAFAFA]">
                          {[
                            "รหัส",
                            "ชื่อตัวชี้วัด",
                            "น้ำหนัก",
                            "ระดับ",
                            "ผลจริง",
                            "รอบรายงาน",
                            "",
                          ].map((header) => (
                            <th
                              key={header}
                              className="border-b border-slate-100 px-3 py-2 text-left text-[10px] font-semibold tracking-[0.04em] whitespace-nowrap text-slate-400 uppercase"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {row.kpis.map((kpi) => (
                          <tr
                            key={kpi.reportId}
                            role="link"
                            tabIndex={0}
                            onClick={() => navigateToReport(kpi.reportId)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                navigateToReport(kpi.reportId);
                              }
                            }}
                            className="cursor-pointer transition-colors hover:bg-purple-50/50 focus:bg-purple-50/50 focus:outline-none"
                          >
                            <td className="border-b border-slate-50 px-3 py-2 font-mono text-[11px] font-semibold whitespace-nowrap text-purple-600">
                              {kpi.code}
                            </td>
                            <td className="border-b border-slate-50 px-3 py-2 text-[12px] font-medium text-slate-700">
                              <div className="line-clamp-2">{kpi.title}</div>
                            </td>
                            <td className="border-b border-slate-50 px-3 py-2 font-mono text-[12px] whitespace-nowrap text-slate-500">
                              {kpi.weight}%
                            </td>
                            <td className="border-b border-slate-50 px-3 py-2">
                              {kpi.scoreLevel > 0 ? (
                                <LevelBadge level={kpi.scoreLevel} />
                              ) : (
                                <span className="text-[11px] text-slate-300">
                                  —
                                </span>
                              )}
                            </td>
                            <td className="border-b border-slate-50 px-3 py-2 font-mono text-[12px] font-semibold whitespace-nowrap text-slate-700">
                              {kpi.actual !== null ? `${kpi.actual} ${kpi.unit}` : "—"}
                            </td>
                            <td className="border-b border-slate-50 px-3 py-2 font-mono text-[11px] whitespace-nowrap text-slate-400">
                              {kpi.reportMonth}/{kpi.reportYear}
                            </td>
                            <td
                              className="border-b border-slate-50 px-3 py-2 text-right"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <Link
                                href={`/reports/${kpi.reportId}`}
                                transitionTypes={["nav-forward"]}
                                className="inline-flex size-6 items-center justify-center rounded-md text-slate-300 hover:bg-purple-100 hover:text-purple-700"
                                aria-label={`ดูรายงานผล ${kpi.code}`}
                              >
                                <ChevronRight className="size-4" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MiniSparkline({ row }: { row: DashboardDivisionRow }) {
  const values = row.trend.map((point) => point.score);
  if (values.length === 0) return null;

  const path = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 100;
      const y = 28 - (Math.max(0, Math.min(100, value)) / 100) * 24;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  const color = row.avg >= 80 ? "#16A34A" : row.avg >= 60 ? "#D97706" : "#DC2626";
  const lastY = 28 - (Math.max(0, Math.min(100, values.at(-1) ?? 0)) / 100) * 24;

  return (
    <svg
      width="88"
      height="28"
      viewBox="0 0 104 34"
      className="hidden shrink-0 md:block"
      aria-hidden="true"
    >
      <path d={path} fill="none" stroke={color} strokeWidth="1.7" />
      <circle cx="100" cy={lastY} r="2.6" fill={color} />
    </svg>
  );
}
