"use client";

import Link from "next/link";
import { DivisionSummary } from "@/components/dashboard/division-summary";
import { KpiTrendChart } from "@/components/dashboard/kpi-trend-chart";
import { StatCards } from "@/components/dashboard/stat-cards";
import { StatusDonut } from "@/components/dashboard/status-donut";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildDashboardAnalytics } from "@/lib/dashboard-analytics";
import { shortRoleLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { MONTHS_TH } from "@/lib/workflow";
import { useApp } from "@/providers/app-provider";
import { BarChart3, CalendarDays, ListChecks } from "lucide-react";

export default function DashboardPage() {
  const {
    currentUser,
    selectedMonth,
    selectedYear,
    visibleKpis,
    reports,
  } = useApp();
  const monthLabel = MONTHS_TH[selectedMonth - 1];
  const analytics = buildDashboardAnalytics({
    kpis: visibleKpis,
    reports,
    selectedMonth,
    selectedYear,
  });
  const trendStart = analytics.trend[0];
  const trendEnd = analytics.trend.at(-1);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[20px] leading-tight font-bold text-slate-800">
            ภาพรวม KPI
          </h1>
          <p className="mt-0.5 text-[12px] text-slate-500">
            สวัสดี,{" "}
            <span className="font-semibold text-purple-600">
              {currentUser ? shortRoleLabels[currentUser.role] : "ผู้ใช้งาน"}
            </span>{" "}
            · ภาพรวม KPI ฝ่ายบริหารจัดการสินทรัพย์ระบบไฟฟ้า (ฝบร.)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-purple-100 bg-white px-2.5 py-[6px]">
            <CalendarDays className="size-3.5 text-purple-500" />
            <span className="font-mono text-[12px] font-medium text-purple-700">
              {monthLabel} {selectedYear}
            </span>
          </div>
          <Link
            href="/kpi"
            transitionTypes={["nav-forward"]}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "gap-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200",
            )}
          >
            <ListChecks className="size-3.5" />
            รายการตัวชี้วัด
          </Link>
          <Link
            href="/reports"
            transitionTypes={["nav-forward"]}
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1.5 bg-purple-600 hover:bg-purple-700",
            )}
          >
            <BarChart3 className="size-3.5" />
            รายงานผล
          </Link>
        </div>
      </div>

      <StatCards stats={analytics.stats} />

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_292px]">
        <Card className="rounded-xl border-purple-100 shadow-sm">
          <CardContent className="px-3.5 py-2.5">
            <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-[13px] font-semibold text-slate-800">
                  แนวโน้มผลการดำเนินงาน KPI รายกอง
                </div>
                <div className="mt-0.5 text-[11px] text-slate-400">
                  {trendStart?.monthLabel} {trendStart?.year} –{" "}
                  {trendEnd?.monthLabel} {trendEnd?.year} · แสดงตามสิทธิ์การมองเห็น
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[18px] leading-none font-bold text-purple-600">
                  {analytics.currentScore}%
                </span>
                {analytics.scoreDelta !== null && (
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                      analytics.scoreDelta >= 0
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600",
                    )}
                  >
                    {analytics.scoreDelta >= 0 ? "+" : ""}
                    {analytics.scoreDelta}%
                  </span>
                )}
              </div>
            </div>
            <KpiTrendChart trends={analytics.divisionTrends} />
          </CardContent>
        </Card>

        <Card className="rounded-xl border-purple-100 shadow-sm">
          <CardContent className="px-3.5 py-2.5">
            <div className="mb-2">
              <div className="text-[13px] font-semibold text-slate-800">
                สัดส่วนสถานะ KPI
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">
                {monthLabel} {selectedYear}
              </div>
            </div>
            <StatusDonut
              slices={analytics.statusSlices}
              total={analytics.totalKpis}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-xl border-purple-100 p-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <div>
            <div className="text-sm font-semibold text-slate-800">
              สรุปผลการดำเนินงานรายกอง
            </div>
            <div className="mt-0.5 text-xs text-slate-400">
              คลิกที่แต่ละกองเพื่อดูตัวชี้วัด · {monthLabel} {selectedYear}
            </div>
          </div>
          <Link
            href="/reports"
            transitionTypes={["nav-forward"]}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-slate-500 hover:text-purple-600",
            )}
          >
            ดูรายงาน
          </Link>
        </div>
        <DivisionSummary rows={analytics.divisionRows} />
      </Card>
    </div>
  );
}
