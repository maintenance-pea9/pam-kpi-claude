"use client";

import type { DashboardDivisionTrend } from "@/lib/dashboard-analytics";

const chartW = 560;
const chartH = 112;
const padL = 34;
const padR = 22;
const padT = 8;
const padB = 18;
const innerW = chartW - padL - padR;
const innerH = chartH - padT - padB;

function xAt(index: number, count: number) {
  return padL + (index / Math.max(1, count - 1)) * innerW;
}

function yAt(value: number) {
  const clamped = Math.max(0, Math.min(100, value));
  return padT + innerH - (clamped / 100) * innerH;
}

function pathFor(values: number[]) {
  return values
    .map(
      (value, index) =>
        `${index === 0 ? "M" : "L"} ${xAt(index, values.length)} ${yAt(value)}`,
    )
    .join(" ");
}

function areaFor(values: number[]) {
  const line = pathFor(values);
  return `${line} L ${xAt(values.length - 1, values.length)} ${padT + innerH} L ${xAt(0, values.length)} ${padT + innerH} Z`;
}

export function KpiTrendChart({
  trends,
}: {
  trends: DashboardDivisionTrend[];
}) {
  const months = trends[0]?.points.map((point) => point.monthLabel) ?? [];

  return (
    <div className="overflow-hidden rounded-lg border border-purple-50 bg-[#FCFBFF] px-3 py-2">
      <div className="mb-1 flex flex-wrap items-center justify-end gap-2.5">
        {trends.map((trend) => (
          <div key={trend.division} className="flex items-center gap-1.5">
            <span
              className="h-1 w-3 rounded-full"
              style={{ background: trend.color }}
            />
            <span className="font-mono text-[11px] text-slate-500">
              {trend.division}
            </span>
          </div>
        ))}
      </div>
      <svg
        width="100%"
        viewBox={`0 0 ${chartW} ${chartH}`}
        className="block"
        role="img"
        aria-label="แนวโน้มผลการดำเนินงาน KPI รายกอง"
      >
        {[0, 25, 50, 75, 100].map((mark) => (
          <g key={mark}>
            <line
              x1={padL}
              x2={chartW - padR}
              y1={yAt(mark)}
              y2={yAt(mark)}
              stroke="#F1F5F9"
              strokeWidth="1"
            />
            <text
              x={padL - 7}
              y={yAt(mark) + 3}
              textAnchor="end"
              fontSize="9"
              fill="#94A3B8"
              fontFamily="IBM Plex Mono"
            >
              {mark}
            </text>
          </g>
        ))}

        {months.map((month, index) => (
          <text
            key={`${month}-${index}`}
            x={xAt(index, months.length)}
            y={chartH - 7}
            textAnchor="middle"
            fontSize="10"
            fill="#94A3B8"
          >
            {month}
          </text>
        ))}

        {trends.map((trend) => {
          const values = trend.points.map((point) => point.score);
          const lastValue = values.at(-1) ?? 0;
          const lastX = xAt(values.length - 1, values.length);
          const lastY = yAt(lastValue);

          return (
            <g key={trend.division}>
              <path d={areaFor(values)} fill={trend.color} opacity="0.06" />
              <path
                d={pathFor(values)}
                fill="none"
                stroke={trend.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {values.map((value, index) => (
                <circle
                  key={`${trend.division}-${index}`}
                  cx={xAt(index, values.length)}
                  cy={yAt(value)}
                  r={index === values.length - 1 ? 4 : 2.5}
                  fill={trend.color}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  opacity={trend.points[index]?.reportCount ? 1 : 0.35}
                />
              ))}
              <text
                x={Math.min(chartW - 17, lastX + 7)}
                y={lastY + 3}
                fontSize="10"
                fontWeight="700"
                fill={trend.color}
                fontFamily="IBM Plex Mono"
              >
                {lastValue}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
