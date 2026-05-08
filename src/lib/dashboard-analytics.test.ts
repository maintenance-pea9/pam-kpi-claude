import assert from "node:assert/strict";
import test from "node:test";

import { buildDashboardAnalytics } from "./dashboard-analytics.ts";
import type { KpiItem, MonthlyReport } from "./types.ts";

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

function report(
  kpiId: string,
  month: number,
  scoreLevel: MonthlyReport["scoreLevel"],
  actual = 90,
  year = 2569,
  division: MonthlyReport["division"] = "กบผ.",
): MonthlyReport {
  return {
    id: `rpt-${kpiId}-${month}`,
    kpiId,
    month,
    year,
    division,
    actual,
    scoreLevel,
    status: "approved",
    performanceSummary: "",
    level4Action: "",
    obstacles: "",
    correctivePlan: "",
    approvalLogs: [],
    updatedAt: "2569-05-01",
  };
}

test("buildDashboardAnalytics calculates current score and eight-month trend from visible reports", () => {
  const analytics = buildDashboardAnalytics({
    kpis: [kpi("kpi-1", "กบผ.", "approved"), kpi("kpi-2", "กบผ.", "pending_l1")],
    reports: [
      report("kpi-1", 10, 3, 90, 2568),
      report("kpi-1", 11, 4, 90, 2568),
      report("kpi-1", 12, 5, 90, 2568),
      report("kpi-1", 1, 4),
      report("kpi-1", 2, 4),
      report("kpi-1", 3, 5),
      report("kpi-1", 4, 4),
      report("kpi-1", 5, 5),
      report("kpi-2", 5, 3),
      report("hidden-kpi", 5, 1),
    ],
    selectedMonth: 5,
    selectedYear: 2569,
  });

  assert.equal(analytics.currentScore, 80);
  assert.deepEqual(
    analytics.trend.map((point) => point.monthLabel),
    ["ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."],
  );
  assert.equal(analytics.trend.at(-1)?.score, 80);
  assert.equal(analytics.trend.at(-1)?.reportCount, 2);
});

test("buildDashboardAnalytics summarizes approval status and creates concise action insights", () => {
  const analytics = buildDashboardAnalytics({
    kpis: [
      kpi("approved", "กบผ.", "approved"),
      kpi("pending", "กบผ.", "pending_l1"),
      kpi("returned", "กบผ.", "revision_requested"),
      kpi("draft", "กบผ.", "draft"),
    ],
    reports: [
      report("approved", 5, 5),
      report("pending", 5, 2),
      report("returned", 5, 3),
    ],
    selectedMonth: 5,
    selectedYear: 2569,
  });

  assert.equal(analytics.totalKpis, 4);
  assert.equal(analytics.approvedKpis, 1);
  assert.equal(analytics.attentionCount, 4);
  assert.equal(analytics.insights.length, 3);
  assert.equal(analytics.insights[0].tone, "danger");
  assert.match(analytics.insights[0].title, /ส่งกลับแก้ไข/);
  assert.equal(analytics.insights[2].tone, "warning");
});

test("buildDashboardAnalytics creates division trend, status slices, and expandable rows", () => {
  const analytics = buildDashboardAnalytics({
    kpis: [
      kpi("gbp-1", "กบผ.", "approved"),
      kpi("gbp-2", "กบผ.", "pending_l1"),
      kpi("gbr-1", "กบร.", "revision_requested"),
    ],
    reports: [
      report("gbp-1", 4, 4, 90),
      report("gbp-1", 5, 5, 98),
      report("gbp-2", 5, 3, 76),
      report("gbr-1", 5, 2, 64, 2569, "กบร."),
    ],
    selectedMonth: 5,
    selectedYear: 2569,
  });

  assert.deepEqual(
    analytics.divisionTrends.map((trend) => trend.division),
    ["กบผ.", "กบร."],
  );
  assert.equal(analytics.divisionTrends[0].points.at(-1)?.score, 80);
  assert.equal(
    analytics.statusSlices.find((slice) => slice.key === "approved")?.count,
    1,
  );
  assert.equal(
    analytics.statusSlices.find((slice) => slice.key === "returned")?.count,
    1,
  );
  assert.equal(analytics.divisionRows[0].avg, 80);
  assert.equal(analytics.divisionRows[0].delta, 0);
  assert.equal(analytics.divisionRows[0].kpis[0].latestLevel?.level, 5);
});
