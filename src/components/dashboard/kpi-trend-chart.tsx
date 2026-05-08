"use client";

import type { DashboardDivisionTrend } from "@/lib/dashboard-analytics";

type ScoredTrendPoint = DashboardDivisionTrend["points"][number] & {
  index: number;
};

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

function pathFor(points: ScoredTrendPoint[], count: number) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${xAt(point.index, count)} ${yAt(point.score)}`,
    )
    .join(" ");
}

function areaFor(points: ScoredTrendPoint[], count: number) {
  const line = pathFor(points, count);
  const firstPoint = points[0];
  const lastPoint = points.at(-1);
  if (!firstPoint || !lastPoint) return "";
  return `${line} L ${xAt(lastPoint.index, count)} ${padT + innerH} L ${xAt(firstPoint.index, count)} ${padT + innerH} Z`;
}

function scoredSegments(points: DashboardDivisionTrend["points"]) {
  const segments: ScoredTrendPoint[][] = [];

  points.forEach((point, index) => {
    if (!point.reportCount) return;
    const current = segments.at(-1);
    const nextPoint = { ...point, index };

    if (!current || current.at(-1)?.index !== index - 1) {
      segments.push([nextPoint]);
      return;
    }

    current.push(nextPoint);
  });

  return segments;
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
          const segments = scoredSegments(trend.points);
          const scoredPoints = segments.flat();
          const lastPoint = scoredPoints.at(-1);

          return (
            <g key={trend.division}>
              {segments.map((segment) => (
                <g key={`${trend.division}-${segment[0]?.index}`}>
                  {segment.length > 1 && (
                    <>
                      <path
                        d={areaFor(segment, trend.points.length)}
                        fill={trend.color}
                        opacity="0.06"
                      />
                      <path
                        d={pathFor(segment, trend.points.length)}
                        fill="none"
                        stroke={trend.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </g>
              ))}
              {scoredPoints.map((point) => (
                <circle
                  key={`${trend.division}-${point.index}`}
                  cx={xAt(point.index, trend.points.length)}
                  cy={yAt(point.score)}
                  r={point.index === lastPoint?.index ? 4 : 2.5}
                  fill={trend.color}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              ))}
              {lastPoint && (
                <text
                  x={Math.min(
                    chartW - 17,
                    xAt(lastPoint.index, trend.points.length) + 7,
                  )}
                  y={yAt(lastPoint.score) + 3}
                  fontSize="10"
                  fontWeight="700"
                  fill={trend.color}
                  fontFamily="IBM Plex Mono"
                >
                  {lastPoint.score}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
