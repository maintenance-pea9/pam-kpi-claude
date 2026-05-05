import type { ApprovalStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { key: "draft", label: "ฉบับร่าง" },
  { key: "pending_l1", label: "ผอ.กอง" },
  { key: "pending_l2", label: "ผู้รวบรวมฯ" },
  { key: "pending_l3", label: "ผอ.ฝ่าย" },
  { key: "approved", label: "อนุมัติ" },
] as const;

const STATUS_ORDER: Record<ApprovalStatus, number> = {
  draft: 0,
  revision_requested: 0,
  pending_l1: 1,
  pending_l2: 2,
  pending_l3: 3,
  approved: 4,
};

export function ApprovalSteps({ status }: { status: ApprovalStatus }) {
  const current = STATUS_ORDER[status];

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const idx = i;
        const done = idx < current;
        const active = idx === current;

        return (
          <div key={step.key} className="flex items-center">
            {i > 0 && (
              <div
                className={cn(
                  "h-0.5 w-5",
                  done ? "bg-purple-600" : "bg-slate-200",
                )}
              />
            )}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
                  done
                    ? "bg-purple-600 text-white"
                    : active
                      ? "border-2 border-purple-600 bg-white text-purple-700"
                      : "border border-slate-200 bg-white text-slate-400",
                )}
              >
                {done ? <Check className="size-3" /> : idx + 1}
              </div>
              <span
                className={cn(
                  "text-[9px] whitespace-nowrap",
                  done || active ? "font-medium text-purple-700" : "text-slate-400",
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
