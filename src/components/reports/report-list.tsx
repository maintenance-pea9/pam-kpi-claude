"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DivBadge } from "@/components/shared/div-badge";
import { LevelBadge } from "@/components/shared/level-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import type { DivisionCode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DIVISIONS, MONTHS_TH } from "@/lib/workflow";
import { useApp } from "@/providers/app-provider";
import { Calendar, Edit, Eye } from "lucide-react";

const TH = [
  "รหัส KPI",
  "ชื่อตัวชี้วัด",
  "กอง",
  "หน่วย",
  "ผลจริง",
  "ระดับ",
  "สถานะรายงาน",
  "ดำเนินการ",
];

export function ReportList() {
  const router = useRouter();
  const {
    currentUser,
    visibleKpis,
    reports,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    createReport,
  } = useApp();
  const [division, setDivision] = useState<"all" | DivisionCode>("all");

  const isAssignee = currentUser?.role === "assignee";
  const years = [2567, 2568, 2569, 2570];

  const divFilters: Array<{ key: "all" | DivisionCode; label: string }> = [
    { key: "all", label: "ทุกกอง" },
    ...DIVISIONS.map((d) => ({ key: d, label: d })),
  ];

  const approvedKpis = useMemo(
    () => visibleKpis.filter((kpi) => kpi.status === "approved"),
    [visibleKpis],
  );

  const rows = useMemo(() => {
    return approvedKpis
      .filter((kpi) => division === "all" || kpi.division === division)
      .map((kpi) => ({
        kpi,
        report: reports.find(
          (report) =>
            report.kpiId === kpi.id &&
            report.month === selectedMonth &&
            report.year === selectedYear,
        ),
      }));
  }, [approvedKpis, division, reports, selectedMonth, selectedYear]);

  const filled = rows.filter(
    (row) => row.report?.actual !== null && row.report?.actual !== undefined,
  ).length;
  const approved = rows.filter((row) => row.report?.status === "approved").length;
  const pending = rows.filter(
    (row) => row.report && row.report.status.startsWith("pending"),
  ).length;
  const total = rows.length;

  const openOrCreate = (kpiId: string) => {
    const id = createReport(kpiId, selectedMonth, selectedYear);
    router.push(`/reports/${id}`, { transitionTypes: ["nav-forward"] });
  };

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-[10px] border border-purple-100 bg-white px-3 py-1.5">
          <Calendar className="size-3.5 text-purple-500" />
          <select
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(Number(event.target.value))}
            className="cursor-pointer border-0 bg-transparent text-[13px] font-medium text-slate-800 outline-none"
          >
            {MONTHS_TH.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
            className="cursor-pointer border-0 bg-transparent font-mono text-[13px] font-semibold text-purple-600 outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                พ.ศ. {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {divFilters.map((f) => (
            <Pill
              key={f.key}
              active={division === f.key}
              onClick={() => setDivision(f.key)}
              mono
            >
              {f.label}
            </Pill>
          ))}
        </div>

        <span className="ml-auto text-[13px] text-slate-400">
          บันทึกแล้ว {filled}/{total} · อนุมัติ {approved} · รออนุมัติ {pending}
        </span>
      </div>

      {/* Mini summary cards */}
      <div className="grid gap-3.5 sm:grid-cols-3">
        <SummaryCard label="รายงานทั้งหมด" value={total} unit="รายการ" color="#6D28D9" />
        <SummaryCard label="บันทึกแล้ว" value={filled} unit={`/ ${total}`} color="#2563EB" />
        <SummaryCard label="อนุมัติแล้ว" value={approved} unit="รายการ" color="#16A34A" />
      </div>

      {/* Table card */}
      <div
        className="overflow-hidden rounded-xl border border-purple-100 bg-white"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(107,33,168,0.05)" }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div className="text-sm font-semibold text-slate-800">
            รายงานผลการดำเนินงาน — {MONTHS_TH[selectedMonth - 1]} {selectedYear}
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {TH.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    "border-b border-slate-100 bg-[#FAFAFA] px-4 py-2.5 text-[11px] font-semibold tracking-wider whitespace-nowrap text-slate-500 uppercase",
                    i === TH.length - 1 ? "text-center" : "text-left",
                    i === 1 && "w-[30%]",
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={TH.length}
                  className="px-10 py-10 text-center text-[13px] text-slate-400"
                >
                  ไม่มีตัวชี้วัดที่อนุมัติแล้วในขอบเขตนี้
                </td>
              </tr>
            )}
            {rows.map(({ kpi, report }, i) => {
              const hasData =
                report &&
                report.actual !== null &&
                report.actual !== undefined;
              return (
                <tr
                  key={kpi.id}
                  onClick={() =>
                    report
                      ? router.push(`/reports/${report.id}`, {
                          transitionTypes: ["nav-forward"],
                        })
                      : openOrCreate(kpi.id)
                  }
                  className="cursor-pointer transition-colors hover:!bg-[#F5F3FF]"
                  style={{ background: i % 2 === 0 ? "#fff" : "#FAF9FF" }}
                >
                  <td className="px-4 py-3 font-mono text-[12px] whitespace-nowrap text-purple-500">
                    {kpi.code}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-slate-800">
                    {kpi.criterion}
                  </td>
                  <td className="px-4 py-3">
                    <DivBadge div={kpi.division} />
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-slate-500">
                    {kpi.unit}
                  </td>
                  <td
                    className="px-4 py-3 font-mono text-[14px] font-bold"
                    style={{ color: hasData ? "#1E293B" : "#CBD5E1" }}
                  >
                    {hasData ? report?.actual : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {hasData ? (
                      <LevelBadge level={report?.scoreLevel ?? 0} />
                    ) : (
                      <span className="text-[11px] text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {report ? (
                      <StatusBadge status={report.status} size="sm" />
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span className="inline-block size-1.5 rounded-full bg-slate-200" />
                        ยังไม่บันทึก
                      </span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        report
                          ? router.push(`/reports/${report.id}`, {
                              transitionTypes: ["nav-forward"],
                            })
                          : openOrCreate(kpi.id)
                      }
                      className="mx-auto flex w-fit cursor-pointer items-center gap-1 rounded-md bg-purple-50 px-3 py-[5px] text-[11px] font-medium text-purple-500"
                    >
                      {isAssignee ? (
                        <Edit className="size-3" />
                      ) : (
                        <Eye className="size-3" />
                      )}
                      {isAssignee ? "บันทึกผล" : "ดูรายละเอียด"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl border border-purple-100 bg-white shadow-sm"
      style={{ padding: "14px 18px" }}
    >
      <div className="mb-1.5 text-[11px] font-medium text-slate-400">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[24px] font-bold" style={{ color }}>
          {value}
        </span>
        <span className="text-[12px] text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
  mono = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-[5px] text-[12px] font-medium transition-colors",
        mono && "font-mono font-semibold",
        active
          ? "border-purple-600 bg-purple-600 text-white"
          : "border-slate-200 bg-white text-slate-500 hover:bg-purple-50",
      )}
    >
      {children}
    </button>
  );
}
