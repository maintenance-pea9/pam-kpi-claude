import { cn } from "@/lib/utils";

const LEVEL_CONFIG: Record<number, { bg: string; text: string; label: string }> = {
  5: { bg: "bg-green-50", text: "text-green-700", label: "ระดับ 5 — ดีเยี่ยม" },
  4: { bg: "bg-green-100", text: "text-green-600", label: "ระดับ 4 — ดีมาก" },
  3: { bg: "bg-yellow-100", text: "text-yellow-800", label: "ระดับ 3 — ผ่านเกณฑ์" },
  2: { bg: "bg-orange-100", text: "text-orange-800", label: "ระดับ 2 — ต่ำกว่าเกณฑ์" },
  1: { bg: "bg-red-100", text: "text-red-800", label: "ระดับ 1 — ต้องปรับปรุง" },
  0: { bg: "bg-slate-100", text: "text-slate-500", label: "ยังไม่มีข้อมูล" },
};

export function LevelBadge({ level }: { level: 0 | 1 | 2 | 3 | 4 | 5 }) {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[0];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        cfg.bg,
        cfg.text,
      )}
    >
      {cfg.label}
    </span>
  );
}
