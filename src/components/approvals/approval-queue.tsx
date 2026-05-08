"use client";

import { useMemo, useState } from "react";
import { ApprovalDetail } from "@/components/approvals/approval-detail";
import { DivBadge } from "@/components/shared/div-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  buildApprovalQueueAnalytics,
  selectApprovalQueueItems,
  type ApprovalQueueItem,
  type QueueKind,
  type QueueTabState,
} from "@/lib/approval-queue-analytics";
import { MONTHS_TH } from "@/lib/workflow";
import { cn } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";
import {
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Inbox,
  ListChecks,
  Search,
  ShieldCheck,
  TimerReset,
  X,
  type LucideIcon,
} from "lucide-react";

type QuickAction = {
  item: ApprovalQueueItem;
  action: "approve" | "revise";
};

const kindOptions: Array<{ value: QueueKind; label: string }> = [
  { value: "all", label: "ทั้งหมด" },
  { value: "kpi", label: "KPI" },
  { value: "report", label: "รายงาน" },
];

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
  const [kind, setKind] = useState<QueueKind>("all");
  const [tab, setTab] = useState<QueueTabState>("pending");
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [quickAction, setQuickAction] = useState<QuickAction | null>(null);
  const [note, setNote] = useState("");

  const analytics = useMemo(
    () =>
      buildApprovalQueueAnalytics({
        currentUser,
        kpis,
        reports,
        canView,
        canApprove,
      }),
    [canApprove, canView, currentUser, kpis, reports],
  );

  const activeItems = useMemo(
    () => selectApprovalQueueItems(analytics, { kind, tab, query }),
    [analytics, kind, query, tab],
  );
  const activeTabItems = tab === "pending" ? analytics.pending : analytics.done;
  const selectedItem =
    activeItems.find((item) => item.key === selectedKey) ?? activeItems[0];

  const countForKind = (nextKind: QueueKind) =>
    nextKind === "all"
      ? activeTabItems.length
      : activeTabItems.filter((item) => item.kind === nextKind).length;

  const selectKind = (nextKind: QueueKind) => {
    setKind(nextKind);
    setSelectedKey("");
  };

  const selectTab = (nextTab: QueueTabState) => {
    setTab(nextTab);
    setSelectedKey("");
  };

  const approve = (item: ApprovalQueueItem, actionNote?: string) => {
    approveRecord(item.kind, item.id, actionNote);
    setSelectedKey("");
  };

  const revise = (item: ApprovalQueueItem, reason: string) => {
    reviseRecord(item.kind, item.id, reason);
    setSelectedKey("");
  };

  const closeQuickAction = () => {
    setQuickAction(null);
    setNote("");
  };

  const confirmQuickAction = () => {
    if (!quickAction) return;
    const trimmedNote = note.trim();

    if (quickAction.action === "approve") {
      approve(quickAction.item, trimmedNote || undefined);
      closeQuickAction();
      return;
    }

    if (trimmedNote) {
      revise(quickAction.item, trimmedNote);
      closeQuickAction();
    }
  };

  const activeKindLabel =
    kindOptions.find((option) => option.value === kind)?.label ?? "ทั้งหมด";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-800">
            คิวอนุมัติ
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            โต๊ะพิจารณางานอนุมัติ KPI และรายงานผลตามสิทธิ์ของผู้ใช้งาน
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-purple-100 bg-white px-3 py-2 text-[12px] text-slate-500 shadow-sm">
          <ShieldCheck className="size-3.5 text-purple-500" />
          <span className="font-medium text-slate-700">
            {currentUser?.title ?? "ยังไม่ได้เข้าสู่ระบบ"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <QueueStat
          icon={TimerReset}
          label="รอดำเนินการ"
          value={analytics.summary.pendingCount}
          sub="งานที่คุณอนุมัติได้ตอนนี้"
          tone="warning"
        />
        <QueueStat
          icon={ListChecks}
          label="KPI"
          value={analytics.summary.kpiPendingCount}
          sub="KPI Master รอพิจารณา"
          tone="purple"
        />
        <QueueStat
          icon={FileText}
          label="รายงาน"
          value={analytics.summary.reportPendingCount}
          sub="รายงานผลรอพิจารณา"
          tone="info"
        />
        <QueueStat
          icon={CheckCircle2}
          label="ดำเนินการแล้ว"
          value={analytics.summary.doneCount}
          sub="ประวัติที่เกี่ยวข้องกับคุณ"
          tone="success"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
        <section className="flex min-h-[560px] flex-col overflow-hidden rounded-xl border border-purple-100 bg-white shadow-sm xl:max-h-[calc(100vh-168px)]">
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[14px] font-semibold text-slate-800">
                  Approval inbox
                </div>
                <div className="mt-0.5 text-[12px] text-slate-400">
                  {activeKindLabel} · {activeItems.length} รายการ
                </div>
              </div>
              <span className="rounded-lg bg-purple-50 px-2.5 py-1 font-mono text-[12px] font-semibold text-purple-600">
                {analytics.summary.visibleCount}
              </span>
            </div>

            <div className="relative mt-3">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ค้นหารหัส ชื่อ KPI หรือกอง"
                className="h-9 rounded-lg border-slate-200 bg-slate-50 pl-8 text-[12px] focus-visible:border-purple-300 focus-visible:ring-purple-200"
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-slate-50 p-1">
              {kindOptions.map((option) => (
                <KindFilter
                  key={option.value}
                  active={kind === option.value}
                  count={countForKind(option.value)}
                  label={option.label}
                  onClick={() => selectKind(option.value)}
                />
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg bg-slate-50 p-1">
              <QueueTab
                active={tab === "pending"}
                count={analytics.summary.pendingCount}
                onClick={() => selectTab("pending")}
              >
                รอดำเนินการ
              </QueueTab>
              <QueueTab
                active={tab === "done"}
                count={analytics.summary.doneCount}
                onClick={() => selectTab("done")}
              >
                ดำเนินการแล้ว
              </QueueTab>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeItems.length === 0 ? (
              <QueueEmptyState tab={tab} hasQuery={query.trim().length > 0} />
            ) : (
              activeItems.map((item) => (
                <QueueRow
                  key={item.key}
                  item={item}
                  selected={selectedItem?.key === item.key}
                  onSelect={() => setSelectedKey(item.key)}
                  onQuickAction={(action) => setQuickAction({ item, action })}
                />
              ))
            )}
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl border border-purple-100 bg-slate-50 shadow-sm">
          <ApprovalDetail
            item={selectedItem}
            onApprove={approve}
            onRevise={revise}
          />
        </section>
      </div>

      <QuickActionDialog
        action={quickAction}
        note={note}
        onNoteChange={setNote}
        onClose={closeQuickAction}
        onConfirm={confirmQuickAction}
      />
    </div>
  );
}

function QueueStat({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  sub: string;
  tone: "purple" | "warning" | "info" | "success";
}) {
  const toneClass = {
    purple: "border-purple-100 bg-purple-50/40 text-purple-600",
    warning: "border-amber-100 bg-amber-50/60 text-amber-600",
    info: "border-blue-100 bg-blue-50/60 text-blue-600",
    success: "border-green-100 bg-green-50/60 text-green-600",
  }[tone];

  return (
    <div className="rounded-xl border border-purple-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-medium text-slate-500">{label}</div>
          <div className="mt-1 font-mono text-[24px] leading-none font-bold text-slate-800">
            {value}
          </div>
        </div>
        <div className={cn("rounded-lg border p-2", toneClass)}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-2 text-[11px] text-slate-400">{sub}</div>
    </div>
  );
}

function KindFilter({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-[12px] transition-all",
        active
          ? "bg-white font-semibold text-purple-700 shadow-sm ring-1 ring-slate-200/70"
          : "font-medium text-slate-500 hover:bg-white/70 hover:text-slate-700",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-px font-mono text-[9px] font-bold",
          active ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-500",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function QueueTab({
  active,
  count,
  children,
  onClick,
}: {
  active: boolean;
  count: number;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-[12px] transition-all",
        active
          ? "bg-white font-semibold text-purple-700 shadow-sm ring-1 ring-slate-200/70"
          : "font-medium text-slate-500 hover:bg-white/70 hover:text-slate-700",
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

function QueueRow({
  item,
  selected,
  onSelect,
  onQuickAction,
}: {
  item: ApprovalQueueItem;
  selected: boolean;
  onSelect: () => void;
  onQuickAction: (action: QuickAction["action"]) => void;
}) {
  const lastLog = item.lastLog;
  const priorityClass = {
    danger: "border-l-rose-500",
    warning: "border-l-amber-400",
    neutral: "border-l-transparent",
  }[item.priorityTone];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "group cursor-pointer border-b border-l-[3px] border-b-slate-100 px-4 py-3.5 text-left outline-none transition-colors",
        selected ? "border-l-purple-600 bg-purple-50/70" : priorityClass,
        !selected && "bg-white hover:bg-slate-50 focus-visible:bg-slate-50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[12px] font-semibold text-purple-600">
              {item.code}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                item.kind === "kpi"
                  ? "bg-purple-50 text-purple-700"
                  : "bg-blue-50 text-blue-700",
              )}
            >
              {item.kind === "kpi" ? "KPI" : "Report"}
            </span>
          </div>
          <div className="line-clamp-2 text-[13px] leading-snug font-semibold text-slate-800">
            {item.title}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <DivBadge div={item.division} />
          {item.canAct && (
            <div
              className={cn(
                "flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
                selected && "opacity-100",
              )}
            >
              <Button
                type="button"
                size="icon-xs"
                title="อนุมัติ"
                aria-label="อนุมัติ"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={(event) => {
                  event.stopPropagation();
                  onQuickAction("approve");
                }}
              >
                <Check className="size-3" />
              </Button>
              <Button
                type="button"
                size="icon-xs"
                title="ส่งกลับแก้ไข"
                aria-label="ส่งกลับแก้ไข"
                variant="outline"
                className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={(event) => {
                  event.stopPropagation();
                  onQuickAction("revise");
                }}
              >
                <X className="size-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusBadge status={item.status} size="sm" />
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]",
            item.priorityTone === "danger"
              ? "bg-rose-50 text-rose-600"
              : item.priorityTone === "warning"
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-50 text-slate-400",
          )}
        >
          <Clock3 className="size-3" />
          {item.ageLabel}
        </span>
        {item.reportInfo && (
          <span className="text-[11px] text-slate-400">
            {monthLabel(item.reportInfo.month)} {item.reportInfo.year}
          </span>
        )}
      </div>

      {lastLog && (
        <div className="mt-2 truncate text-[11px] text-slate-400">
          ล่าสุด {lastLog.createdAt.slice(0, 10)} · {lastLog.actorName}
        </div>
      )}
    </div>
  );
}

function QueueEmptyState({
  tab,
  hasQuery,
}: {
  tab: QueueTabState;
  hasQuery: boolean;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center text-slate-400">
      <Inbox className="size-9 text-slate-200" />
      <div className="mt-3 text-[13px] font-medium text-slate-500">
        {hasQuery
          ? "ไม่พบรายการที่ตรงกับคำค้น"
          : tab === "pending"
            ? "ไม่มีรายการรอดำเนินการ"
            : "ยังไม่มีประวัติการดำเนินการ"}
      </div>
      <div className="mt-1 max-w-[240px] text-[12px] leading-relaxed">
        {hasQuery
          ? "ลองค้นด้วยรหัส KPI ชื่อรายการ หรือรหัสกอง"
          : "เมื่อมีรายการที่เกี่ยวข้อง ระบบจะแสดงใน inbox นี้"}
      </div>
    </div>
  );
}

function QuickActionDialog({
  action,
  note,
  onNoteChange,
  onClose,
  onConfirm,
}: {
  action: QuickAction | null;
  note: string;
  onNoteChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isRevise = action?.action === "revise";
  const title = isRevise ? "ส่งกลับแก้ไข" : "ยืนยันการอนุมัติ";
  const description = isRevise
    ? "กรุณาระบุเหตุผลให้ผู้จัดทำใช้ปรับแก้รายการนี้"
    : "เมื่อยืนยันแล้ว สถานะจะเดินหน้าตามลำดับอนุมัติเดิม";

  return (
    <Dialog
      open={action !== null}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {action && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="font-mono text-[11px] font-semibold text-purple-600">
              {action.item.code}
            </div>
            <div className="mt-0.5 line-clamp-2 text-[12px] font-medium text-slate-700">
              {action.item.title}
            </div>
          </div>
        )}
        <Textarea
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder={isRevise ? "ระบุเหตุผล..." : "หมายเหตุ (ถ้ามี)"}
          rows={3}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isRevise && !note.trim()}
            className={
              isRevise
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }
          >
            {isRevise ? "ยืนยันส่งกลับ" : "ยืนยันอนุมัติ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function monthLabel(month: number) {
  return MONTHS_TH[month - 1] ?? "";
}
