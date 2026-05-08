import type {
  ApprovalStatus,
  DivisionCode,
  KpiItem,
  MonthlyReport,
} from "./types";

type Tone = "success" | "warning" | "danger" | "info";

export type DashboardTrendPoint = {
  month: number;
  year: number;
  monthLabel: string;
  score: number;
  reportCount: number;
};

export type DashboardDivisionTrend = {
  division: DivisionCode;
  color: string;
  points: DashboardTrendPoint[];
};

export type DashboardStatusSlice = {
  key: "approved" | "pending" | "returned" | "draft";
  label: string;
  count: number;
  color: string;
};

export type DashboardDivisionKpiRow = {
  id: string;
  code: string;
  title: string;
  weight: number;
  unit: string;
  status: ApprovalStatus;
  latestLevel: {
    level: 0 | 1 | 2 | 3 | 4 | 5;
    actual: number | null;
    month: number;
    year: number;
  } | null;
};

export type DashboardDivisionRow = {
  division: DivisionCode;
  name: string;
  total: number;
  approved: number;
  pending: number;
  avg: number;
  previousAvg: number;
  delta: number;
  trend: DashboardTrendPoint[];
  kpis: DashboardDivisionKpiRow[];
};

export type DashboardInsight = {
  title: string;
  description: string;
  tone: Tone;
  count: number;
};

export type DashboardStat = {
  label: string;
  value: string;
  sub: string;
  tone: Tone;
};

export type DashboardAnalytics = {
  currentScore: number;
  previousScore: number | null;
  scoreDelta: number | null;
  totalKpis: number;
  approvedKpis: number;
  pendingKpis: number;
  returnedKpis: number;
  draftKpis: number;
  lowScoreReports: number;
  attentionCount: number;
  trend: DashboardTrendPoint[];
  divisionTrends: DashboardDivisionTrend[];
  statusSlices: DashboardStatusSlice[];
  divisionRows: DashboardDivisionRow[];
  stats: DashboardStat[];
  insights: DashboardInsight[];
};

type DashboardAnalyticsInput = {
  kpis: KpiItem[];
  reports: MonthlyReport[];
  selectedMonth: number;
  selectedYear: number;
};

const MONTHS_SHORT_TH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const DIVISION_ORDER: DivisionCode[] = ["กบผ.", "กบร.", "กบค."];

const DIVISION_NAMES: Record<DivisionCode, string> = {
  "กบผ.": "กองจัดการงานบำรุงรักษาระบบผลิต",
  "กบร.": "กองบริหารจัดการระบบไฟฟ้า",
  "กบค.": "กองบริหารจัดการงานเครื่องกล",
};

const DIVISION_COLORS: Record<DivisionCode, string> = {
  "กบผ.": "#6D28D9",
  "กบร.": "#0EA5E9",
  "กบค.": "#F59E0B",
};

const pendingStatuses: ApprovalStatus[] = [
  "pending_l1",
  "pending_l2",
  "pending_l3",
];

function isPendingStatus(status: ApprovalStatus): boolean {
  return pendingStatuses.includes(status);
}

function monthWindow(selectedMonth: number, selectedYear: number, size = 8) {
  return Array.from({ length: size }, (_, index) => {
    const offset = size - index - 1;
    const zeroBasedMonth = selectedMonth - 1 - offset;
    const year = selectedYear + Math.floor(zeroBasedMonth / 12);
    const normalizedMonth = ((zeroBasedMonth % 12) + 12) % 12;

    return {
      month: normalizedMonth + 1,
      year,
      monthLabel: MONTHS_SHORT_TH[normalizedMonth],
    };
  });
}

function previousMonth(month: number, year: number) {
  if (month === 1) return { month: 12, year: year - 1 };
  return { month: month - 1, year };
}

function scoreFromReports(reports: MonthlyReport[]): number {
  const filledReports = reports.filter((report) => report.actual !== null);

  if (filledReports.length === 0) {
    return 0;
  }

  const averageLevel =
    filledReports.reduce((sum, report) => sum + report.scoreLevel, 0) /
    filledReports.length;

  return Math.round(averageLevel * 20);
}

function countByDivision(kpis: KpiItem[]): Record<DivisionCode, number> {
  return kpis.reduce(
    (counts, kpi) => ({
      ...counts,
      [kpi.division]: (counts[kpi.division] ?? 0) + 1,
    }),
    {} as Record<DivisionCode, number>,
  );
}

function divisionList(kpis: KpiItem[]): DivisionCode[] {
  const visibleDivisions = new Set(kpis.map((kpi) => kpi.division));
  return DIVISION_ORDER.filter((division) => visibleDivisions.has(division));
}

function reportsForDivisionMonth(
  reports: MonthlyReport[],
  division: DivisionCode,
  month: number,
  year: number,
): MonthlyReport[] {
  return reports.filter(
    (report) =>
      report.division === division &&
      report.month === month &&
      report.year === year,
  );
}

function latestApprovedReport(
  reports: MonthlyReport[],
  kpiId: string,
): MonthlyReport | undefined {
  return reports
    .filter((report) => report.kpiId === kpiId && report.status === "approved")
    .sort((a, b) => b.year * 12 + b.month - (a.year * 12 + a.month))[0];
}

function buildDivisionTrends({
  divisions,
  trendWindow,
  reports,
}: {
  divisions: DivisionCode[];
  trendWindow: DashboardTrendPoint[];
  reports: MonthlyReport[];
}): DashboardDivisionTrend[] {
  return divisions.map((division) => ({
    division,
    color: DIVISION_COLORS[division],
    points: trendWindow.map((point) => {
      const divisionReports = reportsForDivisionMonth(
        reports,
        division,
        point.month,
        point.year,
      );

      return {
        ...point,
        score: scoreFromReports(divisionReports),
        reportCount: divisionReports.filter((report) => report.actual !== null)
          .length,
      };
    }),
  }));
}

function buildDivisionRows({
  divisions,
  kpis,
  reports,
  divisionTrends,
  selectedMonth,
  selectedYear,
}: {
  divisions: DivisionCode[];
  kpis: KpiItem[];
  reports: MonthlyReport[];
  divisionTrends: DashboardDivisionTrend[];
  selectedMonth: number;
  selectedYear: number;
}): DashboardDivisionRow[] {
  const previous = previousMonth(selectedMonth, selectedYear);

  return divisions.map((division) => {
    const divisionKpis = kpis.filter((kpi) => kpi.division === division);
    const selectedReports = reportsForDivisionMonth(
      reports,
      division,
      selectedMonth,
      selectedYear,
    );
    const previousReports = reportsForDivisionMonth(
      reports,
      division,
      previous.month,
      previous.year,
    );
    const avg = scoreFromReports(selectedReports);
    const previousAvg = scoreFromReports(previousReports);

    return {
      division,
      name: DIVISION_NAMES[division],
      total: divisionKpis.length,
      approved: divisionKpis.filter((kpi) => kpi.status === "approved").length,
      pending: divisionKpis.filter((kpi) => isPendingStatus(kpi.status)).length,
      avg,
      previousAvg,
      delta: avg - previousAvg,
      trend:
        divisionTrends.find((trend) => trend.division === division)?.points ??
        [],
      kpis: divisionKpis.map((kpi) => {
        const latestReport = latestApprovedReport(reports, kpi.id);

        return {
          id: kpi.id,
          code: kpi.code,
          title: kpi.criterion,
          weight: kpi.weight,
          unit: kpi.unit,
          status: kpi.status,
          latestLevel: latestReport
            ? {
                level: latestReport.scoreLevel,
                actual: latestReport.actual,
                month: latestReport.month,
                year: latestReport.year,
              }
            : null,
        };
      }),
    };
  });
}

function buildInsights({
  pendingKpis,
  returnedKpis,
  draftKpis,
  lowScoreReports,
  selectedMonthReports,
  kpis,
}: {
  pendingKpis: number;
  returnedKpis: number;
  draftKpis: number;
  lowScoreReports: number;
  selectedMonthReports: MonthlyReport[];
  kpis: KpiItem[];
}): DashboardInsight[] {
  const divisionCounts = countByDivision(kpis);
  const busiestDivision = Object.entries(divisionCounts).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0] as DivisionCode | undefined;

  const insights: DashboardInsight[] = [];

  if (returnedKpis > 0) {
    insights.push({
      title: `ส่งกลับแก้ไข ${returnedKpis} รายการ`,
      description: "ควรเร่งปรับเกณฑ์หรือแผนดำเนินงานก่อนรอบสรุปผล",
      tone: "danger",
      count: returnedKpis,
    });
  }

  if (pendingKpis > 0) {
    insights.push({
      title: `รออนุมัติ ${pendingKpis} รายการ`,
      description: "ติดตามลำดับอนุมัติให้ครบก่อนปิดเดือน",
      tone: "warning",
      count: pendingKpis,
    });
  }

  if (lowScoreReports > 0) {
    insights.push({
      title: `คะแนนต่ำกว่าระดับ 4 จำนวน ${lowScoreReports} รายการ`,
      description: "ตรวจแผนแก้ไขและอุปสรรคของ KPI ที่ยังต่ำกว่าเป้า",
      tone: "warning",
      count: lowScoreReports,
    });
  }

  if (draftKpis > 0 && insights.length < 3) {
    insights.push({
      title: `ฉบับร่าง ${draftKpis} รายการ`,
      description: "เตรียมส่งเข้ากระบวนการอนุมัติเมื่อข้อมูลครบ",
      tone: "info",
      count: draftKpis,
    });
  }

  if (insights.length < 3 && selectedMonthReports.length > 0) {
    insights.push({
      title: "ผลรายเดือนพร้อมสรุป",
      description: `${selectedMonthReports.length} รายงานมีข้อมูลผลจริงแล้ว`,
      tone: "success",
      count: selectedMonthReports.length,
    });
  }

  if (insights.length < 3 && busiestDivision) {
    insights.push({
      title: `${busiestDivision} มี KPI มากที่สุด`,
      description: "เหมาะสำหรับเริ่มตรวจความครบถ้วนของแผนรายกอง",
      tone: "info",
      count: divisionCounts[busiestDivision],
    });
  }

  while (insights.length < 3) {
    insights.push({
      title: "ไม่มีรายการเร่งด่วนเพิ่มเติม",
      description: "ติดตามผลรายเดือนและสถานะอนุมัติรอบถัดไป",
      tone: "success",
      count: 0,
    });
  }

  return insights.slice(0, 3);
}

export function buildDashboardAnalytics({
  kpis,
  reports,
  selectedMonth,
  selectedYear,
}: DashboardAnalyticsInput): DashboardAnalytics {
  const visibleKpiIds = new Set(kpis.map((kpi) => kpi.id));
  const visibleReports = reports.filter((report) =>
    visibleKpiIds.has(report.kpiId),
  );
  const selectedMonthReports = visibleReports.filter(
    (report) =>
      report.month === selectedMonth && report.year === selectedYear,
  );

  const trend = monthWindow(selectedMonth, selectedYear).map((point) => {
    const reportsForMonth = visibleReports.filter(
      (report) => report.month === point.month && report.year === point.year,
    );

    return {
      ...point,
      score: scoreFromReports(reportsForMonth),
      reportCount: reportsForMonth.filter((report) => report.actual !== null)
        .length,
    };
  });

  const currentScore = scoreFromReports(selectedMonthReports);
  const previousScore = trend.at(-2)?.score ?? null;
  const scoreDelta =
    previousScore === null || previousScore === 0
      ? null
      : currentScore - previousScore;
  const totalKpis = kpis.length;
  const approvedKpis = kpis.filter((kpi) => kpi.status === "approved").length;
  const pendingKpis = kpis.filter((kpi) => isPendingStatus(kpi.status)).length;
  const returnedKpis = kpis.filter(
    (kpi) => kpi.status === "revision_requested",
  ).length;
  const draftKpis = kpis.filter((kpi) => kpi.status === "draft").length;
  const lowScoreReports = selectedMonthReports.filter(
    (report) =>
      report.actual !== null && report.scoreLevel > 0 && report.scoreLevel < 4,
  ).length;
  const attentionCount = pendingKpis + returnedKpis + lowScoreReports;
  const approvedPct =
    totalKpis > 0 ? Math.round((approvedKpis / totalKpis) * 100) : 0;
  const divisions = divisionList(kpis);
  const divisionTrends = buildDivisionTrends({
    divisions,
    trendWindow: trend,
    reports: visibleReports,
  });
  const statusSlices: DashboardStatusSlice[] = [
    {
      key: "approved",
      label: "อนุมัติแล้ว",
      count: approvedKpis,
      color: "#16A34A",
    },
    {
      key: "pending",
      label: "รออนุมัติ",
      count: pendingKpis,
      color: "#D97706",
    },
    {
      key: "returned",
      label: "ส่งกลับ",
      count: returnedKpis,
      color: "#DC2626",
    },
    {
      key: "draft",
      label: "ฉบับร่าง",
      count: draftKpis,
      color: "#8B5CF6",
    },
  ];

  return {
    currentScore,
    previousScore,
    scoreDelta,
    totalKpis,
    approvedKpis,
    pendingKpis,
    returnedKpis,
    draftKpis,
    lowScoreReports,
    attentionCount,
    trend,
    divisionTrends,
    statusSlices,
    divisionRows: buildDivisionRows({
      divisions,
      kpis,
      reports: visibleReports,
      divisionTrends,
      selectedMonth,
      selectedYear,
    }),
    stats: [
      {
        label: "KPI ทั้งหมด",
        value: String(totalKpis),
        sub: `ฉบับร่าง ${draftKpis} รายการ`,
        tone: "info",
      },
      {
        label: "อนุมัติแล้ว",
        value: String(approvedKpis),
        sub: `${approvedPct}% ของทั้งหมด`,
        tone: "success",
      },
      {
        label: "รออนุมัติ",
        value: String(pendingKpis),
        sub: "ต้องการการดำเนินการ",
        tone: pendingKpis > 0 ? "warning" : "success",
      },
      {
        label: "ส่งกลับแก้ไข",
        value: String(returnedKpis),
        sub: "รอการแก้ไข",
        tone: returnedKpis > 0 ? "danger" : "success",
      },
    ],
    insights: buildInsights({
      pendingKpis,
      returnedKpis,
      draftKpis,
      lowScoreReports,
      selectedMonthReports,
      kpis,
    }),
  };
}
