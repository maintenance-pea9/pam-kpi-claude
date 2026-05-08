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
  key: "level5" | "level4" | "belowTarget" | "noScore";
  label: string;
  count: number;
  color: string;
};

export type DashboardDivisionKpiRow = {
  id: string;
  reportId: string;
  code: string;
  title: string;
  weight: number;
  unit: string;
  status: ApprovalStatus;
  actual: number | null;
  scoreLevel: 0 | 1 | 2 | 3 | 4 | 5;
  reportMonth: number;
  reportYear: number;
};

export type DashboardDivisionRow = {
  division: DivisionCode;
  name: string;
  total: number;
  level45: number;
  lowScore: number;
  noScore: number;
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
  unit?: string;
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

function hasScoredResult(report: MonthlyReport): boolean {
  return report.actual !== null && report.scoreLevel > 0;
}

function scoreFromReports(reports: MonthlyReport[]): number {
  const scoredReports = reports.filter(hasScoredResult);

  if (scoredReports.length === 0) {
    return 0;
  }

  const averageLevel =
    scoredReports.reduce((sum, report) => sum + report.scoreLevel, 0) /
    scoredReports.length;

  return Math.round(averageLevel * 20);
}

function countLevel45(reports: MonthlyReport[]): number {
  return reports.filter(
    (report) => hasScoredResult(report) && report.scoreLevel >= 4,
  ).length;
}

function countLowScore(reports: MonthlyReport[]): number {
  return reports.filter(
    (report) =>
      hasScoredResult(report) && report.scoreLevel > 0 && report.scoreLevel < 4,
  ).length;
}

function countNoScore(reports: MonthlyReport[]): number {
  return reports.filter((report) => !hasScoredResult(report)).length;
}

function monthMatches(report: MonthlyReport, month: number, year: number) {
  return report.month === month && report.year === year;
}

function divisionListFromReports(reports: MonthlyReport[]): DivisionCode[] {
  const divisions = new Set(reports.map((report) => report.division));
  return DIVISION_ORDER.filter((division) => divisions.has(division));
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
        reportCount: divisionReports.filter(hasScoredResult).length,
      };
    }),
  }));
}

function buildDivisionRows({
  divisions,
  kpis,
  reports,
  selectedMonthReports,
  divisionTrends,
  selectedMonth,
  selectedYear,
}: {
  divisions: DivisionCode[];
  kpis: KpiItem[];
  reports: MonthlyReport[];
  selectedMonthReports: MonthlyReport[];
  divisionTrends: DashboardDivisionTrend[];
  selectedMonth: number;
  selectedYear: number;
}): DashboardDivisionRow[] {
  const previous = previousMonth(selectedMonth, selectedYear);
  const kpiById = new Map(kpis.map((kpi) => [kpi.id, kpi]));

  return divisions.map((division) => {
    const divisionReports = reportsForDivisionMonth(
      selectedMonthReports,
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
    const avg = scoreFromReports(divisionReports);
    const previousAvg = scoreFromReports(previousReports);

    return {
      division,
      name: DIVISION_NAMES[division],
      total: divisionReports.length,
      level45: countLevel45(divisionReports),
      lowScore: countLowScore(divisionReports),
      noScore: countNoScore(divisionReports),
      avg,
      previousAvg,
      delta: avg - previousAvg,
      trend:
        divisionTrends.find((trend) => trend.division === division)?.points ??
        [],
      kpis: divisionReports
        .flatMap((report) => {
          const kpi = kpiById.get(report.kpiId);
          if (!kpi) return [];

          return [
            {
              id: kpi.id,
              reportId: report.id,
              code: kpi.code,
              title: kpi.criterion,
              weight: kpi.weight,
              unit: kpi.unit,
              status: report.status,
              actual: report.actual,
              scoreLevel: report.scoreLevel,
              reportMonth: report.month,
              reportYear: report.year,
            },
          ];
        })
        .sort((a, b) => a.code.localeCompare(b.code, "th")),
    };
  });
}

function buildStatusSlices(reports: MonthlyReport[]): DashboardStatusSlice[] {
  return [
    {
      key: "level5",
      label: "ระดับ 5",
      count: reports.filter((report) => report.scoreLevel === 5).length,
      color: "#16A34A",
    },
    {
      key: "level4",
      label: "ระดับ 4",
      count: reports.filter((report) => report.scoreLevel === 4).length,
      color: "#6D28D9",
    },
    {
      key: "belowTarget",
      label: "ต่ำกว่าระดับ 4",
      count: countLowScore(reports),
      color: "#DC2626",
    },
    {
      key: "noScore",
      label: "ยังไม่มีคะแนน",
      count: countNoScore(reports),
      color: "#94A3B8",
    },
  ];
}

function buildInsights({
  selectedMonthReports,
  lowScoreReports,
  noScoreReports,
  level45Reports,
  currentScore,
}: {
  selectedMonthReports: MonthlyReport[];
  lowScoreReports: number;
  noScoreReports: number;
  level45Reports: number;
  currentScore: number;
}): DashboardInsight[] {
  const insights: DashboardInsight[] = [];

  if (lowScoreReports > 0) {
    insights.push({
      title: `ต่ำกว่าระดับ 4 จำนวน ${lowScoreReports} รายการ`,
      description: "ตรวจแผนแก้ไขและอุปสรรคของรายงานที่ผลยังต่ำกว่าเป้า",
      tone: "warning",
      count: lowScoreReports,
    });
  }

  if (noScoreReports > 0) {
    insights.push({
      title: `ยังไม่มีคะแนน ${noScoreReports} รายการ`,
      description: "รายงานได้รับอนุมัติแล้ว แต่ยังไม่มีผลจริงหรือระดับคะแนน",
      tone: "info",
      count: noScoreReports,
    });
  }

  if (level45Reports > 0) {
    insights.push({
      title: `ระดับ 4-5 จำนวน ${level45Reports} รายการ`,
      description: "ผลรายเดือนที่อนุมัติแล้วอยู่ในระดับเป้าหมายหรือสูงกว่า",
      tone: "success",
      count: level45Reports,
    });
  }

  if (insights.length < 3 && selectedMonthReports.length > 0) {
    insights.push({
      title: `คะแนนเฉลี่ย ${currentScore}%`,
      description: "คำนวณจากรายงานประจำเดือนที่อนุมัติแล้วเท่านั้น",
      tone: currentScore >= 80 ? "success" : currentScore >= 60 ? "warning" : "danger",
      count: selectedMonthReports.length,
    });
  }

  while (insights.length < 3) {
    insights.push({
      title: "ยังไม่มีผลรายเดือนที่อนุมัติ",
      description: "เมื่อรายงานประจำเดือนผ่านอนุมัติแล้ว ระบบจะแสดงผลใน Dashboard",
      tone: "info",
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
  const visibleApprovedReports = reports.filter(
    (report) =>
      visibleKpiIds.has(report.kpiId) && report.status === "approved",
  );
  const selectedMonthReports = visibleApprovedReports.filter((report) =>
    monthMatches(report, selectedMonth, selectedYear),
  );

  const trend = monthWindow(selectedMonth, selectedYear).map((point) => {
    const reportsForMonth = visibleApprovedReports.filter((report) =>
      monthMatches(report, point.month, point.year),
    );

    return {
      ...point,
      score: scoreFromReports(reportsForMonth),
      reportCount: reportsForMonth.filter(hasScoredResult).length,
    };
  });

  const currentScore = scoreFromReports(selectedMonthReports);
  const previousScore = trend.at(-2)?.score ?? null;
  const scoreDelta =
    previousScore === null || previousScore === 0
      ? null
      : currentScore - previousScore;
  const totalKpis = selectedMonthReports.length;
  const approvedKpis = totalKpis;
  const pendingKpis = 0;
  const returnedKpis = 0;
  const draftKpis = 0;
  const level45Reports = countLevel45(selectedMonthReports);
  const lowScoreReports = countLowScore(selectedMonthReports);
  const noScoreReports = countNoScore(selectedMonthReports);
  const attentionCount = lowScoreReports + noScoreReports;
  const level45Pct =
    totalKpis > 0 ? Math.round((level45Reports / totalKpis) * 100) : 0;
  const trendDivisions = divisionListFromReports(visibleApprovedReports);
  const rowDivisions = divisionListFromReports(selectedMonthReports);
  const divisionTrends = buildDivisionTrends({
    divisions: trendDivisions,
    trendWindow: trend,
    reports: visibleApprovedReports,
  });

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
    statusSlices: buildStatusSlices(selectedMonthReports),
    divisionRows: buildDivisionRows({
      divisions: rowDivisions,
      kpis,
      reports: visibleApprovedReports,
      selectedMonthReports,
      divisionTrends,
      selectedMonth,
      selectedYear,
    }),
    stats: [
      {
        label: "รายงานอนุมัติแล้ว",
        value: String(totalKpis),
        sub: "เฉพาะผลรายเดือนที่ผ่านอนุมัติ",
        tone: "info",
      },
      {
        label: "คะแนนเฉลี่ย",
        value: String(currentScore),
        unit: "%",
        sub:
          scoreDelta === null
            ? "ไม่มีข้อมูลเดือนก่อน"
            : `${scoreDelta >= 0 ? "+" : ""}${scoreDelta}% จากเดือนก่อน`,
        tone: currentScore >= 80 ? "success" : currentScore >= 60 ? "warning" : "danger",
      },
      {
        label: "ระดับ 4-5",
        value: String(level45Reports),
        sub: `${level45Pct}% ของรายงานอนุมัติ`,
        tone: "success",
      },
      {
        label: "ต้องติดตาม",
        value: String(lowScoreReports),
        sub: "ต่ำกว่าระดับ 4",
        tone: lowScoreReports > 0 ? "warning" : "success",
      },
    ],
    insights: buildInsights({
      selectedMonthReports,
      lowScoreReports,
      noScoreReports,
      level45Reports,
      currentScore,
    }),
  };
}
