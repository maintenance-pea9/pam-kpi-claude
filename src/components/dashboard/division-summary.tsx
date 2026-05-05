import { DivBadge } from "@/components/shared/div-badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import type { DivisionCode, KpiItem, MonthlyReport } from "@/lib/types";
import { divisionLabels } from "@/lib/labels";
import { DIVISIONS } from "@/lib/workflow";

const HEADERS = [
  "กอง",
  "ชื่อกอง",
  "KPI ทั้งหมด",
  "อนุมัติแล้ว",
  "ค่าเฉลี่ย (%)",
  "ความคืบหน้า",
];

export function DivisionSummary({
  kpis,
  reports,
}: {
  kpis: KpiItem[];
  reports: MonthlyReport[];
}) {
  const rows = DIVISIONS.map((division: DivisionCode) => {
    const divisionKpis = kpis.filter((kpi) => kpi.division === division);
    const divisionReports = reports.filter(
      (report) => report.division === division,
    );
    const approved = divisionKpis.filter(
      (kpi) => kpi.status === "approved",
    ).length;
    const filled = divisionReports.filter((report) => report.actual !== null);
    const avg = filled.length
      ? Math.round(
          (filled.reduce((sum, report) => sum + report.scoreLevel, 0) /
            filled.length) *
            20,
        )
      : 0;
    return {
      division,
      name: divisionLabels[division],
      total: divisionKpis.length,
      approved,
      avg,
    };
  }).filter((row) => row.total > 0);

  const totalKpis = rows.reduce((sum, row) => sum + row.total, 0);
  const totalApproved = rows.reduce((sum, row) => sum + row.approved, 0);
  const overallAvg = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.avg, 0) / rows.length)
    : 0;

  const numColor = (avg: number) =>
    avg >= 80 ? "#16A34A" : avg >= 60 ? "#D97706" : "#DC2626";

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#FAFAFA]">
          {HEADERS.map((h) => (
            <th
              key={h}
              className="border-b border-slate-100 px-5 py-2.5 text-left text-[11px] font-semibold tracking-wider whitespace-nowrap text-slate-500 uppercase"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.division}
            style={{ background: i % 2 === 0 ? "#fff" : "#FAF9FF" }}
          >
            <td className="px-5 py-3.5">
              <DivBadge div={row.division} />
            </td>
            <td className="px-5 py-3.5 text-[13px] font-medium text-slate-700">
              {row.name}
            </td>
            <td className="px-5 py-3.5 font-mono text-[13px] text-slate-500">
              {row.total}
            </td>
            <td className="px-5 py-3.5 font-mono text-[13px] text-green-600">
              {row.approved}/{row.total}
            </td>
            <td className="px-5 py-3.5">
              <span
                className="font-mono text-[15px] font-bold"
                style={{ color: numColor(row.avg) }}
              >
                {row.avg}%
              </span>
            </td>
            <td className="min-w-[180px] px-5 py-3.5">
              <ProgressBar value={row.avg} max={100} />
            </td>
          </tr>
        ))}
        {rows.length > 0 && (
          <tr
            style={{
              background: "#F5F3FF",
              borderTop: "2px solid #EDE9FE",
            }}
          >
            <td className="px-5 py-3.5">
              <DivBadge div="ฝบร." />
            </td>
            <td className="px-5 py-3.5 text-[13px] font-semibold text-purple-900">
              รวมทั้งฝ่าย
            </td>
            <td className="px-5 py-3.5 font-mono text-[13px] font-bold text-purple-600">
              {totalKpis}
            </td>
            <td className="px-5 py-3.5 font-mono text-[13px] font-bold text-green-600">
              {totalApproved}/{totalKpis}
            </td>
            <td className="px-5 py-3.5">
              <span className="font-mono text-[15px] font-bold text-purple-600">
                {overallAvg}%
              </span>
            </td>
            <td className="px-5 py-3.5">
              <ProgressBar value={overallAvg} max={100} showLabel={false} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
