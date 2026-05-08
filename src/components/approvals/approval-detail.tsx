"use client";

import Link from "next/link";
import { ApprovalActions } from "@/components/shared/approval-actions";
import { ApprovalTimeline } from "@/components/shared/approval-timeline";
import { DivBadge } from "@/components/shared/div-badge";
import { LevelBadge } from "@/components/shared/level-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import type { ApprovalQueueItem } from "@/lib/approval-queue-analytics";
import { cn } from "@/lib/utils";
import { MONTHS_TH } from "@/lib/workflow";
import {
  Clock3,
  ExternalLink,
  FileText,
  Gauge,
  Inbox,
  Target,
  UserRound,
} from "lucide-react";

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
      <div className="flex min-h-[560px] flex-col items-center justify-center gap-2.5 bg-slate-50 px-6 text-center text-slate-400">
        <Inbox className="size-10 text-slate-200" />
        <span className="text-[13px]">เลือกรายการเพื่อดูรายละเอียด</span>
      </div>
    );
  }

  const isKpi = item.kind === "kpi";

  return (
    <div className="min-h-[560px] bg-slate-50">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  isKpi
                    ? "bg-purple-50 text-purple-700"
                    : "bg-blue-50 text-blue-700",
                )}
              >
                {item.kindLabel}
              </span>
              <DivBadge div={item.division} />
              <StatusBadge status={item.status} />
            </div>
            <h2 className="text-[16px] leading-snug font-semibold text-slate-800">
              {item.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="font-mono font-semibold text-purple-500">
                {item.code}
              </span>
              <span>อัปเดต {item.updatedAt}</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3" />
                ค้าง {item.ageLabel}
              </span>
              {item.reportInfo && (
                <span>
                  {monthLabel(item.reportInfo.month)} {item.reportInfo.year}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
            {item.canAct && (
              <ApprovalActions
                showApprove
                showRevise
                onApprove={(note) => onApprove(item, note)}
                onRevise={(reason) => onRevise(item, reason)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailSection
          eyebrow={isKpi ? "KPI Master" : "Monthly report"}
          title="Review snapshot"
        >
          {isKpi && item.kpiInfo ? (
            <KpiSnapshot item={item} />
          ) : item.reportInfo ? (
            <ReportSnapshot item={item} />
          ) : null}
        </DetailSection>

        <DetailSection title="สาระสำคัญ">
          <p className="text-[13px] leading-relaxed text-slate-600">
            {item.description}
          </p>
        </DetailSection>

        <DetailSection title="ประวัติการดำเนินการ">
          {item.logs.length > 0 ? (
            <ApprovalTimeline logs={item.logs} />
          ) : (
            <div className="rounded-lg bg-slate-50 px-3 py-6 text-center text-[12px] text-slate-400">
              ยังไม่มีประวัติ
            </div>
          )}
        </DetailSection>
      </div>
    </div>
  );
}

function KpiSnapshot({ item }: { item: ApprovalQueueItem }) {
  const info = item.kpiInfo;
  if (!info) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile icon={Gauge} label="หน่วยวัด" value={info.unit} />
        <InfoTile icon={Target} label="น้ำหนัก" value={`${info.weight}%`} />
        <InfoTile icon={FileText} label="หมวดหมู่" value={info.category} />
        <InfoTile icon={UserRound} label="ผู้รับผิดชอบ" value={info.owner} />
      </div>
      <div>
        <div className="mb-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          เป้าหมายตามระดับคะแนน
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[5, 4, 3, 2, 1].map((level) => (
            <div
              key={level}
              className="rounded-lg border border-purple-100 bg-purple-50/60 px-2 py-2 text-center"
            >
              <div className="text-[10px] text-slate-400">ระดับ {level}</div>
              <div className="mt-0.5 truncate font-mono text-[13px] font-bold text-purple-700">
                {info.targets[level as 1 | 2 | 3 | 4 | 5]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportSnapshot({ item }: { item: ApprovalQueueItem }) {
  const info = item.reportInfo;
  if (!info) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-purple-100 bg-purple-50/60 px-4 py-3">
          <div className="mb-1 text-[11px] font-medium text-slate-500">
            ผลการดำเนินงานจริง
          </div>
          <div className="font-mono text-[28px] leading-none font-bold text-purple-700">
            {info.actual ?? "—"}{" "}
            <span className="text-[12px] font-normal text-purple-500">
              {info.unit}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-green-100 bg-green-50/70 px-4 py-3">
          <div className="mb-2 text-[11px] font-medium text-slate-500">
            ระดับผลงาน
          </div>
          <LevelBadge level={info.scoreLevel} />
        </div>
      </div>

      {info.obstacles && (
        <div className="rounded-lg border border-amber-100 bg-amber-50/50 px-3.5 py-3">
          <div className="mb-1 text-[11px] font-semibold text-amber-800">
            ประเด็นที่ต้องพิจารณา
          </div>
          <div className="text-[12px] leading-relaxed text-slate-600">
            {info.obstacles}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="mb-3">
        {eyebrow && (
          <div className="mb-0.5 font-mono text-[10px] font-semibold tracking-wide text-purple-500 uppercase">
            {eyebrow}
          </div>
        )}
        <div className="text-[13px] font-semibold text-slate-800">{title}</div>
      </div>
      {children}
    </section>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
        <Icon className="size-3" />
        {label}
      </div>
      <div className="truncate text-[12px] font-semibold text-slate-700">
        {value}
      </div>
    </div>
  );
}

function monthLabel(month: number) {
  return MONTHS_TH[month - 1] ?? "";
}
