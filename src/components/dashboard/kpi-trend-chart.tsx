"use client";

const MOCK_TREND = [
  { m: "ต.ค.", v: 72 },
  { m: "พ.ย.", v: 78 },
  { m: "ธ.ค.", v: 81 },
  { m: "ม.ค.", v: 76 },
  { m: "ก.พ.", v: 84 },
  { m: "มี.ค.", v: 79 },
  { m: "เม.ย.", v: 88 },
  { m: "พ.ค.", v: 87 },
];

export function KpiTrendChart() {
  const data = MOCK_TREND;
  const maxV = Math.max(...data.map((d) => d.v));

  return (
    <div className="flex h-[120px] items-end gap-2">
      {data.map((d, i) => {
        const isLast = i === data.length - 1;
        const color =
          d.v >= 80
            ? isLast
              ? "#6D28D9"
              : "#A78BFA"
            : d.v >= 60
              ? "#F59E0B"
              : "#EF4444";
        const heightPct = (d.v / maxV) * 100;
        return (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <span
              className="font-mono text-[10px]"
              style={{
                color: isLast ? "#6D28D9" : "#94A3B8",
                fontWeight: 600,
              }}
            >
              {d.v}%
            </span>
            <div
              style={{
                width: "100%",
                height: `${heightPct}%`,
                background: color,
                borderRadius: "4px 4px 0 0",
                transition: "height 400ms ease",
              }}
            />
            <span
              className="text-[10px]"
              style={{
                color: isLast ? "#6D28D9" : "#94A3B8",
                fontWeight: isLast ? 600 : 400,
              }}
            >
              {d.m}
            </span>
          </div>
        );
      })}
    </div>
  );
}
