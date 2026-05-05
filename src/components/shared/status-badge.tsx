"use client";

import type { ApprovalStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ApprovalStatus,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  draft: { label: "ฉบับร่าง", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400", border: "border-purple-200" },
  pending_l1: { label: "รอ ผอ.กอง อนุมัติ", bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-500", border: "border-amber-200" },
  pending_l2: { label: "รอผู้รวบรวมฯ ตรวจสอบ", bg: "bg-amber-50/70", text: "text-amber-700", dot: "bg-amber-400", border: "border-amber-200" },
  pending_l3: { label: "รอ ผอ.ฝ่าย อนุมัติ", bg: "bg-orange-50", text: "text-orange-800", dot: "bg-orange-500", border: "border-orange-200" },
  approved: { label: "อนุมัติแล้ว", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", border: "border-green-200" },
  revision_requested: { label: "ส่งกลับแก้ไข", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", border: "border-rose-200" },
};

export function StatusBadge({
  status,
  size = "md",
}: {
  status: ApprovalStatus;
  size?: "sm" | "md";
}) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium whitespace-nowrap",
        cfg.bg,
        cfg.text,
        cfg.border,
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
