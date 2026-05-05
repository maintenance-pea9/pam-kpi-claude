import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max = 100,
  height = "h-1.5",
  showLabel = false,
}: {
  value: number;
  max?: number;
  height?: string;
  showLabel?: boolean;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const gradient =
    pct >= 100
      ? "from-green-600 to-green-400"
      : pct >= 80
        ? "from-purple-700 to-purple-500"
        : pct >= 60
          ? "from-amber-600 to-amber-400"
          : "from-red-600 to-red-400";
  const textColor =
    pct >= 100
      ? "text-green-600"
      : pct >= 80
        ? "text-purple-700"
        : pct >= 60
          ? "text-amber-600"
          : "text-red-600";

  return (
    <div className="flex items-center gap-2">
      <div className={cn("flex-1 overflow-hidden rounded-full bg-purple-100", height)}>
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-400 ease-out", gradient)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("min-w-[36px] text-right font-mono text-xs font-semibold", textColor)}>
          {pct}%
        </span>
      )}
    </div>
  );
}
