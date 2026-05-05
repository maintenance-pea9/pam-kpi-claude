"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DivisionSummary } from "@/components/dashboard/division-summary";
import { KpiStatusDonut } from "@/components/dashboard/kpi-status-donut";
import { KpiTrendChart } from "@/components/dashboard/kpi-trend-chart";
import { StatCards } from "@/components/dashboard/stat-cards";
import { shortRoleLabels } from "@/lib/labels";
import { MONTHS_TH } from "@/lib/workflow";
import { useApp } from "@/providers/app-provider";
import { cn } from "@/lib/utils";
import { ChevronRight, ListChecks, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const {
    currentUser,
    selectedMonth,
    selectedYear,
    visibleKpis,
    visibleReports,
    kpis,
  } = useApp();
  const statuses = visibleKpis.map((kpi) => kpi.status);
  const total = statuses.length;
  const approved = statuses.filter((s) => s === "approved").length;
  const pctApproved = total > 0 ? Math.round((approved / total) * 100) : 0;
  const monthLabel = MONTHS_TH[selectedMonth - 1];
  const previousYear = selectedYear - 1;

  return (
    <div className="space-y-6">
      {/* Welcome strip */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            สวัสดี,{" "}
            <span className="text-purple-600">
              {currentUser ? shortRoleLabels[currentUser.role] : "ผู้ใช้งาน"}
            </span>
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            ภาพรวม KPI ฝ่ายบริหารจัดการสินทรัพย์ระบบไฟฟ้า (ฝบร.) · {monthLabel} {selectedYear}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5 bg-purple-600 hover:bg-purple-700")}
          >
            <BarChart3 className="size-3.5" />
            รายงานผล
          </Link>
        </div>
      </div>

      {/* Stat cards row */}
      <StatCards statuses={statuses} pctApproved={pctApproved} />

      {/* Bar chart + Donut row */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="rounded-xl border-purple-100 shadow-sm">
          <CardContent className="px-6 py-5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  แนวโน้มผลการดำเนินงาน KPI
                </div>
                <div className="mt-0.5 text-xs text-slate-400">
                  ต.ค. {previousYear} – {monthLabel} {selectedYear} · เฉลี่ยทุกกอง
                </div>
              </div>
              <span className="font-mono text-[22px] font-bold text-purple-600">
                87%
              </span>
            </div>
            <KpiTrendChart />
          </CardContent>
        </Card>

        <Card className="rounded-xl border-purple-100 shadow-sm">
          <CardContent className="px-6 py-5">
            <div className="mb-1 text-sm font-semibold text-slate-800">
              สัดส่วนสถานะ KPI
            </div>
            <div className="mb-4 text-xs text-slate-400">
              {monthLabel} {selectedYear} · รวมทุกกอง
            </div>
            <KpiStatusDonut statuses={statuses} />
          </CardContent>
        </Card>
      </div>

      {/* Division summary table */}
      <Card className="overflow-hidden rounded-xl border-purple-100 p-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <div className="text-sm font-semibold text-slate-800">
              สรุปผลการดำเนินงานรายกอง
            </div>
            <div className="mt-0.5 text-xs text-slate-400">
              ฝ่ายบริหารจัดการสินทรัพย์ระบบไฟฟ้า (ฝบร.) · {monthLabel} {selectedYear}
            </div>
          </div>
          <Link
            href="/reports"
            transitionTypes={["nav-forward"]}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-purple-600"
          >
            ดูรายงาน <ChevronRight className="size-3" />
          </Link>
        </div>
        <DivisionSummary kpis={kpis} reports={visibleReports} />
      </Card>
    </div>
  );
}
