"use client";

import Link from "next/link";
import { ApprovalActions } from "@/components/shared/approval-actions";
import { ApprovalTimeline } from "@/components/shared/approval-timeline";
import { DivBadge } from "@/components/shared/div-badge";
import { LevelBadge } from "@/components/shared/level-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import type {
  ApprovalLog,
  ApprovalStatus,
  DivisionCode,
  KpiTargets,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { ExternalLink, Inbox } from "lucide-react";

type KpiInfo = {
  weight: number;
  unit: string;
  category: string;
  owner: string;
  targets: KpiTargets;
};

type ReportInfo = {
  month: number;
  year: number;
  actual: number | null;
  scoreLevel: 0 | 1 | 2 | 3 | 4 | 5;
  performanceSummary: string;
  obstacles: string;
  unit: string;
};

export type ApprovalQueueItem = {
  key: string;
  id: string;
  kind: "kpi" | "report";
  kindLabel: string;
  code: string;
  title: string;
  description: string;
  division: DivisionCode;
  status: ApprovalStatus;
  updatedAt: string;
  href: string;
  logs: ApprovalLog[];
  canAct: boolean;
  kpiInfo?: KpiInfo;
  reportInfo?: ReportInfo;
};

export function ApprovalDetail({
  item,
  onApprove,
  onRevise,
}: {
  item: ApprovalQueueItem | undefined;
  onApprove: (item: ApprovalQueueItem, note?: string) => void;
  onRevise: (item: ApprovalQueueItem, reason: string) => void;
}) {
  if (!item) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-2.5 text-slate-400">
        <Inbox className="size-10 text-slate-200" />
        <span className="text-[13px]">เลือกรายการเพื่อดูรายละเอียด</span>
      </div>
    );
  }

  const isKpi = item.kind === "kpi";

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: isKpi ? "#F5F3FF" : "#EFF6FF",
                color: isKpi ? "#6D28D9" : "#1D4ED8",
              }}
            >
              {item.kindLabel}
            </span>
            <DivBadge div={item.division} />
          </div>
          <h2 className="text-[15px] leading-snug font-semibold text-slate-800">
            {item.title}
          </h2>
          {item.reportInfo && (
            <div className="mt-0.5 text-[12px] text-slate-400">
              {monthLabel(item.reportInfo.month)} {item.reportInfo.year}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={item.status} />
          <Link
            href={item.href}
            transitionTypes={["nav-forward"]}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 border-slate-200 bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700",
            )}
          >
            ดูรายละเอียดเต็ม <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>

      {/* KPI info card */}
      {isKpi && item.kpiInfo && (
        <DetailSection>
          <p className="mb-3 text-[12px] leading-relaxed text-slate-500">
            {item.description}
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Info label="หน่วยวัด" value={item.kpiInfo.unit} />
            <Info label="น้ำหนัก" value={`${item.kpiInfo.weight}%`} />
            <Info label="หมวดหมู่" value={item.kpiInfo.category} />
            <Info label="ผู้รับผิดชอบ" value={item.kpiInfo.owner} />
          </div>
          <div className="mt-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              เป้าหมาย
            </div>
            <div className="flex gap-1.5">
              {[5, 4, 3, 2, 1].map((lvl) => (
                <div
                  key={lvl}
                  className="flex-1 rounded-md bg-purple-50 px-2 py-1.5 text-center"
                >
                  <div className="text-[9px] text-slate-400">ระดับ {lvl}</div>
                  <div className="mt-0.5 font-mono text-[12px] font-bold text-purple-600">
                    {item.kpiInfo!.targets[lvl as 1 | 2 | 3 | 4 | 5]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DetailSection>
      )}

      {/* Report info card */}
      {!isKpi && item.reportInfo && (
        <DetailSection>
          <div className="mb-3.5 grid gap-2.5 sm:grid-cols-2">
            <div
              className="rounded-lg px-3.5 py-2.5"
              style={{ background: "#F5F3FF" }}
            >
              <div className="mb-1 text-[10px] text-slate-400">
                ผลการดำเนินงานจริง
              </div>
              <div className="font-mono text-[22px] leading-none font-bold text-purple-600">
                {item.reportInfo.actual ?? "—"}{" "}
                <span className="text-[12px] font-normal">
                  {item.reportInfo.unit}
                </span>
              </div>
            </div>
            <div
              className="rounded-lg px-3.5 py-2.5"
              style={{ background: "#F0FDF4" }}
            >
              <div className="mb-1 text-[10px] text-slate-400">ระดับผลงาน</div>
              <LevelBadge level={item.reportInfo.scoreLevel} />
            </div>
          </div>
          {item.reportInfo.performanceSummary && (
            <div className="mb-2.5">
              <div className="mb-1 text-[11px] font-semibold text-slate-500">
                ผลการดำเนินงาน
              </div>
              <div className="text-[12px] leading-relaxed text-slate-600">
                {item.reportInfo.performanceSummary}
              </div>
            </div>
          )}
          {item.reportInfo.obstacles && (
            <div>
              <div className="mb-1 text-[11px] font-semibold text-slate-500">
                ปัญหา / อุปสรรค
              </div>
              <div className="text-[12px] leading-relaxed text-slate-600">
                {item.reportInfo.obstacles}
              </div>
            </div>
          )}
        </DetailSection>
      )}

      {/* Timeline */}
      <DetailSection>
        <div className="mb-3 text-[12px] font-semibold text-slate-700">
          ประวัติการดำเนินการ
        </div>
        {item.logs.length > 0 ? (
          <ApprovalTimeline logs={item.logs} />
        ) : (
          <div className="py-2 text-center text-[12px] text-slate-300">
            ยังไม่มีประวัติ
          </div>
        )}
      </DetailSection>

      {/* Actions */}
      {item.canAct && (
        <ApprovalActions
          showApprove
          showRevise
          onApprove={(note) => onApprove(item, note)}
          onRevise={(reason) => onRevise(item, reason)}
        />
      )}
    </div>
  );
}

function DetailSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <div className="mb-0.5 text-[10px] text-slate-400">{label}</div>
      <div className="text-[12px] font-semibold text-slate-700">{value}</div>
    </div>
  );
}

function monthLabel(month: number) {
  const names = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  return names[month - 1] ?? "";
}
