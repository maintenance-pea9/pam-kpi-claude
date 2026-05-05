"use client";

import { useMemo, useState } from "react";
import { ApprovalDetail, type ApprovalQueueItem } from "@/components/approvals/approval-detail";
import { DivBadge } from "@/components/shared/div-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";
import { Clock, Inbox } from "lucide-react";

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
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const [selectedKey, setSelectedKey] = useState("");

  const kpiNameById = useMemo(
    () => new Map(kpis.map((kpi) => [kpi.id, { name: kpi.criterion, code: kpi.code, definition: kpi.definition, weight: kpi.weight, unit: kpi.unit, category: kpi.category, owner: kpi.primaryOwner, targets: kpi.targets }])),
    [kpis],
  );

  const allItems = useMemo<ApprovalQueueItem[]>(() => {
    if (!currentUser) return [];

    const kpiItems = kpis
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
      }));

    const reportItems = reports
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
      });

    return [...kpiItems, ...reportItems].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  }, [canApprove, canView, currentUser, kpiNameById, kpis, reports]);

  const pending = allItems.filter((item) => item.canAct);
  const done = currentUser
    ? allItems.filter(
        (item) =>
          !item.canAct &&
          item.logs.some(
            (log) =>
              log.actorId === currentUser.id &&
              (log.action === "approve" || log.action === "revise"),
          ),
      )
    : [];
  const activeItems = tab === "pending" ? pending : done;
  const selectedItem =
    activeItems.find((item) => item.key === selectedKey) ?? activeItems[0];

  const approve = (item: ApprovalQueueItem, note?: string) => {
    approveRecord(item.kind, item.id, note);
  };

  const revise = (item: ApprovalQueueItem, reason: string) => {
    reviseRecord(item.kind, item.id, reason);
  };

  return (
    <div
      className="flex overflow-hidden rounded-xl border border-purple-100 bg-white"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(107,33,168,0.05)",
        minHeight: 600,
      }}
    >
      {/* Left panel — queue */}
      <aside className="flex w-[340px] shrink-0 flex-col border-r border-purple-100">
        <div className="border-b border-slate-100 px-4 pt-4 pb-0">
          <div className="mb-3 text-sm font-semibold text-slate-800">
            คิวอนุมัติ
          </div>
          <div className="flex">
            <QueueTab
              active={tab === "pending"}
              onClick={() => setTab("pending")}
              count={pending.length}
              showCount
            >
              รอดำเนินการ
            </QueueTab>
            <QueueTab
              active={tab === "done"}
              onClick={() => setTab("done")}
              count={done.length}
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
                {tab === "pending" ? "ไม่มีรายการรออนุมัติ" : "ไม่มีประวัติ"}
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
                className="block w-full cursor-pointer border-b border-slate-50 px-4 py-3.5 text-left transition-colors"
                style={{
                  background: isSel ? "#F5F3FF" : "#fff",
                  borderLeft: `3px solid ${isSel ? "#6D28D9" : "transparent"}`,
                }}
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className="rounded-full px-1.5 py-px text-[10px] font-semibold whitespace-nowrap"
                      style={{
                        background: item.kind === "kpi" ? "#F5F3FF" : "#EFF6FF",
                        color: item.kind === "kpi" ? "#6D28D9" : "#1D4ED8",
                      }}
                    >
                      {item.kind === "kpi" ? "KPI" : "รายงาน"}
                    </span>
                    <DivBadge div={item.division} />
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <div className="mb-0.5 font-mono text-[12px] text-purple-500">
                  {item.code}
                </div>
                <div className="text-[13px] leading-snug font-medium text-slate-800">
                  {item.title}
                </div>
                {item.kind === "report" && item.reportInfo && (
                  <div className="mt-1 text-[11px] text-slate-400">
                    {monthLabel(item.reportInfo.month)} {item.reportInfo.year}
                  </div>
                )}
                {lastLog && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="size-3 text-slate-300" />
                    {lastLog.createdAt.slice(0, 10)} · {lastLog.actorName}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right detail panel */}
      <div className="flex-1 overflow-y-auto bg-[#F8F7FC]">
        <ApprovalDetail item={selectedItem} onApprove={approve} onRevise={revise} />
      </div>
    </div>
  );
}

function QueueTab({
  active,
  onClick,
  count,
  showCount = false,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  showCount?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2 text-[12px] transition-all",
        active
          ? "border-purple-600 font-semibold text-purple-600"
          : "border-transparent font-normal text-slate-400 hover:text-purple-500",
      )}
    >
      {children}
      {showCount && count > 0 && (
        <span className="rounded-full bg-amber-600 px-1.5 py-px font-mono text-[9px] font-bold text-white">
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
