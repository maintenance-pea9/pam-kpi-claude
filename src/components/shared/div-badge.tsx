import type { DivisionCode } from "@/lib/types";
import { cn } from "@/lib/utils";

type DivLike = DivisionCode | "ฝบร.";

const DIV_CONFIG: Record<DivLike, { bg: string; text: string; border: string }> = {
  "กบผ.": { bg: "bg-[#FDF8EC]", text: "text-[#92660A]", border: "border-[#E0CC94]" },
  "กบร.": { bg: "bg-[#EFF6FF]", text: "text-[#1D4ED8]", border: "border-[#BFDBFE]" },
  "กบค.": { bg: "bg-[#F0FDF4]", text: "text-[#15803D]", border: "border-[#BBF7D0]" },
  "ฝบร.": { bg: "bg-[#F5F3FF]", text: "text-[#6D28D9]", border: "border-[#DDD6FE]" },
};

export function DivBadge({ div }: { div: DivLike }) {
  const cfg = DIV_CONFIG[div] ?? {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-bold whitespace-nowrap",
        cfg.bg,
        cfg.text,
        cfg.border,
      )}
    >
      {div}
    </span>
  );
}
