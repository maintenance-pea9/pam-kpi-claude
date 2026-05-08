import type { DashboardStatusSlice } from "@/lib/dashboard-analytics";

const radius = 31;
const circumference = 2 * Math.PI * radius;

export function StatusDonut({
  slices,
  total,
}: {
  slices: DashboardStatusSlice[];
  total: number;
}) {
  const visibleSlices = slices.filter((slice) => slice.count > 0);
  const segments = visibleSlices.reduce<
    Array<DashboardStatusSlice & { dash: number; offset: number }>
  >((items, slice) => {
    const previousOffset = items.reduce((sum, item) => sum + item.dash, 0);
    const dash = total > 0 ? (slice.count / total) * circumference : 0;
    return [...items, { ...slice, dash, offset: previousOffset }];
  }, []);
  const level45 = slices
    .filter((slice) => slice.key === "level5" || slice.key === "level4")
    .reduce((sum, slice) => sum + slice.count, 0);
  const level45Pct = total > 0 ? Math.round((level45 / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center xl:flex-col 2xl:flex-row">
      <div className="flex justify-center">
        <svg
          width="98"
          height="98"
          viewBox="0 0 100 100"
          role="img"
          aria-label="สัดส่วนระดับผลประเมิน KPI"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#F3F0FF"
            strokeWidth="12"
          />
          {segments.map((slice) => (
            <circle
              key={slice.key}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="12"
              strokeDasharray={`${slice.dash} ${circumference - slice.dash}`}
              strokeDashoffset={-slice.offset}
              strokeLinecap="butt"
              transform="rotate(-90 50 50)"
            />
          ))}
          <text
            x="50"
            y="46"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#1E293B"
            fontFamily="IBM Plex Mono"
          >
            {level45Pct}%
          </text>
          <text x="50" y="59" textAnchor="middle" fontSize="8" fill="#94A3B8">
            ระดับ 4-5
          </text>
        </svg>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {slices.map((slice) => (
          <div key={slice.key} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-[3px]"
              style={{ background: slice.color }}
            />
            <span className="text-[11px] text-slate-600">{slice.label}</span>
            <span className="ml-auto font-mono text-[11px] font-semibold text-slate-400">
              {slice.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
