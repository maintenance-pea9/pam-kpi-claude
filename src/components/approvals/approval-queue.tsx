"use client";

import { useMemo, useState } from "react";
import { ApprovalDetail, type ApprovalQueueItem } from "@/components/approvals/approval-detail";
import { DivBadge } from "@/components/shared/div-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";
import { Clock3, Inbox } from "lucide-react";

type QueueKind = "kpi" | "report";
type QueueTabState = "pending" | "done";

function filterDone(
  items: ApprovalQueueItem[],
  currentUser: UserProfile | null,
): ApprovalQueueItem[] {
  if (!currentUser) return [];

  return items.filter(
    (item) =>
      !item.canAct &&
      item.logs.some(
        (log) =>
          log.actorId === currentUser.id &&
          (log.action === "approve" || log.action === "revise"),
      ),
  );
}

export function ApprovalQueue() {
  const {
    currentUser,
    kpis,
    reports,
    canView,
    canApprove,
    approveRecord,
    reviseRecord,
  } = useApp();
  const [kind, setKind] = useState<QueueKind>("kpi");
  const [tab, setTab] = useState<QueueTabState>("pending");
  const [selectedKey, setSelectedKey] = useState("");

  const kpiNameById = useMemo(
    () => new Map(kpis.map((kpi) => [kpi.id, { name: kpi.criterion, code: kpi.code, definition: kpi.definition, weight: kpi.weight, unit: kpi.unit, category: kpi.category, owner: kpi.primaryOwner, targets: kpi.targets }])),
    [kpis],
  );

  const kpiItems = useMemo<ApprovalQueueItem[]>(() => {
    if (!currentUser) return [];

    return kpis
      .filter((kpi) => canView(currentUser, kpi))
      .map<ApprovalQueueItem>((kpi) => ({
        key: `kpi:${kpi.id}`,
        id: kpi.id,
        kind: "kpi",
        kindLabel: "KPI Master",
        code: kpi.code,
        title: kpi.criterion,
        description: kpi.definition,
        division: kpi.division,
        status: kpi.status,
        updatedAt: kpi.updatedAt,
        href: `/kpi/${kpi.id}`,
        logs: kpi.approvalLogs,
        canAct: canApprove(currentUser, kpi),
        kpiInfo: {
          weight: kpi.weight,
          unit: kpi.unit,
          category: kpi.category,
          owner: kpi.primaryOwner,
          targets: kpi.targets,
        },
      }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [canApprove, canView, currentUser, kpis]);

  const reportItems = useMemo<ApprovalQueueItem[]>(() => {
    if (!currentUser) return [];

    return reports
      .filter((report) => canView(currentUser, report))
      .map<ApprovalQueueItem>((report) => {
        const kpi = kpiNameById.get(report.kpiId);
        return {
          key: `report:${report.id}`,
          id: report.id,
          kind: "report",
          kindLabel: "รายงาน",
          code: kpi?.code ?? report.id,
          title: kpi?.name ?? report.id,
          description: report.performanceSummary || "ไม่มีรายละเอียดประกอบผล",
          division: report.division,
          status: report.status,
          updatedAt: report.updatedAt,
          href: `/reports/${report.id}`,
          logs: report.approvalLogs,
          canAct: canApprove(currentUser, report),
          reportInfo: {
            month: report.month,
            year: report.year,
            actual: report.actual,
            scoreLevel: report.scoreLevel,
            performanceSummary: report.performanceSummary,
            obstacles: report.obstacles,
            unit: kpi?.unit ?? "",
          },
        };
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [canApprove, canView, currentUser, kpiNameById, reports]);

  const kpiPending = kpiItems.filter((item) => item.canAct);
  const kpiDone = filterDone(kpiItems, currentUser);
  const reportPending = reportItems.filter((item) => item.canAct);
  const reportDone = filterDone(reportItems, currentUser);
  const activePending = kind === "kpi" ? kpiPending : reportPending;
  const activeDone = kind === "kpi" ? kpiDone : reportDone;
  const activeItems = tab === "pending" ? activePending : activeDone;
  const selectedItem =
    activeItems.find((item) => item.key === selectedKey) ?? activeItems[0];
  const emptyText =
    kind === "kpi"
      ? tab === "pending"
        ? "ไม่มีตัวชี้วัดรออนุมัติ"
        : "ยังไม่มีประวัติการอนุมัติตัวชี้วัด"
      : tab === "pending"
        ? "ไม่มีรายงานรออนุมัติ"
        : "ยังไม่มีประวัติการอนุมัติรายงาน";
  const activeKindLabel = kind === "kpi" ? "ตัวชี้วัด" : "รายงานรายเดือน";

  const switchKind = (nextKind: QueueKind) => {
    setKind(nextKind);
    setSelectedKey("");
  };

  const approve = (item: ApprovalQueueItem, note?: string) => {
    approveRecord(item.kind, item.id, note);
  };

  const revise = (item: ApprovalQueueItem, reason: string) => {
    reviseRecord(item.kind, item.id, reason);
  };

  return (
    <div
      className="flex overflow-hidden rounded-xl border border-slate-200 bg-white"
      style={{
        boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 10px 30px rgba(15,23,42,0.04)",
        minHeight: 620,
      }}
    >
      {/* Left panel — queue */}
      <aside className="flex w-[360px] shrink-0 flex-col border-r border-slate-200">
        <div className="border-b border-slate-100 p-3.5">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-50 p-1">
            <KindTab
              active={kind === "kpi"}
              onClick={() => switchKind("kpi")}
              pendingCount={kpiPending.length}
              label="ตัวชี้วัด"
              sublabel="KPI"
            />
            <KindTab
              active={kind === "report"}
              onClick={() => switchKind("report")}
              pendingCount={reportPending.length}
              label="รายงาน"
              sublabel="รายเดือน"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[13px] font-semibold text-slate-800">
                {activeKindLabel}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">
                {activePending.length} รอดำเนินการ · {activeDone.length} ดำเนินการแล้ว
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg bg-slate-50 p-1">
            <QueueTab
              active={tab === "pending"}
              onClick={() => setTab("pending")}
              count={activePending.length}
            >
              รอดำเนินการ
            </QueueTab>
            <QueueTab
              active={tab === "done"}
              onClick={() => setTab("done")}
              count={activeDone.length}
            >
              ดำเนินการแล้ว
            </QueueTab>
          </div>
        </div>

        {/* Queue list */}
        <div className="flex-1 overflow-y-auto">
          {activeItems.length === 0 && (
            <div className="px-5 py-10 text-center text-slate-400">
              <Inbox className="mx-auto size-8 text-slate-200" />
              <div className="mt-2.5 text-[13px]">
                {emptyText}
              </div>
            </div>
          )}
          {activeItems.map((item) => {
            const isSel = selectedItem?.key === item.key;
            const lastLog = item.logs[item.logs.length - 1];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedKey(item.key)}
                className={cn(
                  "block w-full cursor-pointer border-b border-slate-100 px-4 py-3.5 text-left transition-colors",
                  isSel ? "bg-purple-50/70" : "bg-white hover:bg-slate-50",
                )}
                style={{
                  borderLeft: `3px solid ${isSel ? "#7C3AED" : "transparent"}`,
                }}
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="font-mono text-[12px] font-semibold text-purple-500">
                    {item.code}
                  </div>
                  <DivBadge div={item.division} />
                </div>
                <div className="text-[13px] leading-snug font-medium text-slate-800">
                  {item.title}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={item.status} size="sm" />
                  {item.kind === "report" && item.reportInfo && (
                    <span className="text-[11px] text-slate-400">
                      {monthLabel(item.reportInfo.month)} {item.reportInfo.year}
                    </span>
                  )}
                </div>
                {lastLog && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock3 className="size-3 text-slate-300" />
                    <span className="truncate">
                      {lastLog.createdAt.slice(0, 10)} · {lastLog.actorName}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right detail panel */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <ApprovalDetail item={selectedItem} onApprove={approve} onRevise={revise} />
      </div>
    </div>
  );
}

function KindTab({
  active,
  onClick,
  pendingCount,
  label,
  sublabel,
}: {
  active: boolean;
  onClick: () => void;
  pendingCount: number;
  label: string;
  sublabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-14 flex-col justify-center gap-0.5 rounded-lg px-3 py-2 text-left transition-all",
        active
          ? "bg-white text-purple-700 shadow-sm ring-1 ring-purple-100"
          : "text-slate-500 hover:bg-white/70 hover:text-slate-700",
      )}
    >
      <span className="flex items-center gap-1.5 text-[12px] font-semibold">
        {label}
        {pendingCount > 0 && (
          <span className="rounded-full bg-amber-100 px-1.5 py-px font-mono text-[9px] font-bold text-amber-700">
            {pendingCount}
          </span>
        )}
      </span>
      <span
        className={cn(
          "text-[10px]",
          active ? "text-purple-400" : "text-slate-400",
        )}
      >
        {sublabel}
      </span>
    </button>
  );
}

function QueueTab({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-8 items-center justify-center gap-1.5 rounded-md px-2 text-[12px] transition-all",
        active
          ? "bg-white font-semibold text-purple-700 shadow-sm ring-1 ring-slate-200/70"
          : "font-medium text-slate-400 hover:bg-white/70 hover:text-slate-700",
      )}
    >
      {children}
      {count > 0 && (
        <span
          className={cn(
            "rounded-full px-1.5 py-px font-mono text-[9px] font-bold",
            active ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-500",
          )}
        >
          {count}
        </span>
      )}
    </button>
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
