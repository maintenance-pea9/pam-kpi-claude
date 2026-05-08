import assert from "node:assert/strict";
import test from "node:test";

import { buildDashboardAnalytics } from "./dashboard-analytics.ts";
import type { ApprovalStatus, KpiItem, MonthlyReport } from "./types.ts";

const baseKpi = {
  definition: "",
  unit: "%",
  weight: 10,
  category: "ประสิทธิภาพ",
  targets: { 1: 60, 2: 70, 3: 80, 4: 90, 5: 95 },
  primaryOwner: "เจ้าของข้อมูล",
  coOwners: [],
  initiative: "",
  updatedAt: "2569-05-01",
  approvalLogs: [],
} satisfies Omit<KpiItem, "id" | "code" | "division" | "criterion" | "status">;

function kpi(
  id: string,
  division: KpiItem["division"],
  status: KpiItem["status"],
): KpiItem {
  return {
    ...baseKpi,
    id,
    code: `${division}-${id}`,
    division,
    criterion: `ตัวชี้วัด ${id}`,
    status,
  };
}

function report({
  kpiId,
  month,
  scoreLevel,
  actual = 90,
  year = 2569,
  division = "กบผ.",
  status = "approved",
}: {
  kpiId: string;
  month: number;
  scoreLevel: MonthlyReport["scoreLevel"];
  actual?: number | null;
  year?: number;
  division?: MonthlyReport["division"];
  status?: ApprovalStatus;
}): MonthlyReport {
  return {
    id: `rpt-${kpiId}-${year}-${String(month).padStart(2, "0")}-${status}`,
    kpiId,
    month,
    year,
    division,
    actual,
    scoreLevel,
    status,
    performanceSummary: "",
    level4Action: "",
    obstacles: "",
    correctivePlan: "",
    approvalLogs: [],
    updatedAt: "2569-05-01",
  };
}

test("buildDashboardAnalytics counts only approved monthly reports in the selected month", () => {
  const analytics = buildDashboardAnalytics({
    kpis: [
      kpi("approved-kpi", "กบผ.", "approved"),
      kpi("pending-kpi-with-approved-report", "กบผ.", "pending_l1"),
      kpi("approved-kpi-with-pending-report", "กบผ.", "approved"),
      kpi("draft-kpi-without-report", "กบผ.", "draft"),
    ],
    reports: [
      report({ kpiId: "approved-kpi", month: 5, scoreLevel: 5, actual: 98 }),
      report({
        kpiId: "pending-kpi-with-approved-report",
        month: 5,
        scoreLevel: 3,
        actual: 76,
      }),
      report({
        kpiId: "approved-kpi-with-pending-report",
        month: 5,
        scoreLevel: 5,
        actual: 99,
        status: "pending_l1",
      }),
      report({
        kpiId: "hidden-kpi",
        month: 5,
        scoreLevel: 1,
        actual: 55,
      }),
    ],
    selectedMonth: 5,
    selectedYear: 2569,
  });

  assert.equal(analytics.totalKpis, 2);
  assert.equal(analytics.approvedKpis, 2);
  assert.equal(analytics.pendingKpis, 0);
  assert.equal(analytics.returnedKpis, 0);
  assert.equal(analytics.draftKpis, 0);
  assert.equal(analytics.currentScore, 80);
  assert.equal(analytics.lowScoreReports, 1);
  assert.deepEqual(
    analytics.divisionRows[0].kpis.map((item) => item.id),
    ["approved-kpi", "pending-kpi-with-approved-report"],
  );
});

test("buildDashboardAnalytics trend ignores pending and returned monthly reports", () => {
  const analytics = buildDashboardAnalytics({
    kpis: [
      kpi("kpi-1", "กบผ.", "approved"),
      kpi("kpi-2", "กบผ.", "revision_requested"),
    ],
    reports: [
      report({ kpiId: "kpi-1", month: 4, scoreLevel: 4, actual: 90 }),
      report({
        kpiId: "kpi-2",
        month: 4,
        scoreLevel: 1,
        actual: 50,
        status: "revision_requested",
      }),
      report({ kpiId: "kpi-1", month: 5, scoreLevel: 5, actual: 99 }),
      report({ kpiId: "kpi-2", month: 5, scoreLevel: 3, actual: 77 }),
    ],
    selectedMonth: 5,
    selectedYear: 2569,
  });

  const april = analytics.trend.find(
    (point) => point.month === 4 && point.year === 2569,
  );
  const may = analytics.trend.find(
    (point) => point.month === 5 && point.year === 2569,
  );

  assert.equal(april?.score, 80);
  assert.equal(april?.reportCount, 1);
  assert.equal(may?.score, 80);
  assert.equal(may?.reportCount, 2);
});

test("buildDashboardAnalytics creates score distribution slices from approved reports", () => {
  const analytics = buildDashboardAnalytics({
    kpis: [
      kpi("level-5", "กบผ.", "draft"),
      kpi("level-4", "กบผ.", "pending_l1"),
      kpi("below-target", "กบผ.", "revision_requested"),
      kpi("no-score", "กบผ.", "approved"),
    ],
    reports: [
      report({ kpiId: "level-5", month: 5, scoreLevel: 5, actual: 99 }),
      report({ kpiId: "level-4", month: 5, scoreLevel: 4, actual: 91 }),
      report({ kpiId: "below-target", month: 5, scoreLevel: 2, actual: 70 }),
      report({ kpiId: "no-score", month: 5, scoreLevel: 0, actual: null }),
    ],
    selectedMonth: 5,
    selectedYear: 2569,
  });

  assert.equal(
    analytics.statusSlices.find((slice) => slice.key === "level5")?.count,
    1,
  );
  assert.equal(
    analytics.statusSlices.find((slice) => slice.key === "level4")?.count,
    1,
  );
  assert.equal(
    analytics.statusSlices.find((slice) => slice.key === "belowTarget")?.count,
    1,
  );
  assert.equal(
    analytics.statusSlices.find((slice) => slice.key === "noScore")?.count,
    1,
  );
  assert.equal(analytics.attentionCount, 2);
});

test("buildDashboardAnalytics division summary uses the selected month approved report", () => {
  const analytics = buildDashboardAnalytics({
    kpis: [kpi("kpi-1", "กบผ.", "pending_l1")],
    reports: [
      report({ kpiId: "kpi-1", month: 4, scoreLevel: 5, actual: 99 }),
      report({ kpiId: "kpi-1", month: 5, scoreLevel: 2, actual: 65 }),
      report({ kpiId: "kpi-1", month: 6, scoreLevel: 5, actual: 98 }),
    ],
    selectedMonth: 5,
    selectedYear: 2569,
  });

  assert.equal(analytics.divisionRows.length, 1);
  assert.equal(analytics.divisionRows[0].total, 1);
  assert.equal(analytics.divisionRows[0].lowScore, 1);
  assert.equal(analytics.divisionRows[0].avg, 40);
  assert.equal(analytics.divisionRows[0].delta, -60);
  assert.equal(analytics.divisionRows[0].kpis[0].reportMonth, 5);
  assert.equal(
    analytics.divisionRows[0].kpis[0].reportId,
    "rpt-kpi-1-2569-05-approved",
  );
  assert.equal(analytics.divisionRows[0].kpis[0].scoreLevel, 2);
  assert.equal(analytics.divisionRows[0].kpis[0].actual, 65);
});
