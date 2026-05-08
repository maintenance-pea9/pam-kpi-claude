import assert from "node:assert/strict";
import test from "node:test";

import {
  buildApprovalQueueAnalytics,
  selectApprovalQueueItems,
} from "./approval-queue-analytics.ts";
import type {
  ApprovalLog,
  ApprovalStatus,
  KpiItem,
  MonthlyReport,
  UserProfile,
} from "./types.ts";

const DIVISION = "DIV-A" as KpiItem["division"];
const HIDDEN_DIVISION = "DIV-B" as KpiItem["division"];

const currentUser: UserProfile = {
  id: "approver",
  employeeId: "approver",
  name: "Approver",
  initial: "A",
  role: "consolidator",
  division: null,
  title: "Approver",
};

const baseKpi = {
  definition: "Definition",
  unit: "%",
  weight: 10,
  category: "Operations",
  targets: { 1: 60, 2: 70, 3: 80, 4: 90, 5: 95 },
  primaryOwner: "Owner",
  coOwners: [],
  initiative: "",
} satisfies Omit<
  KpiItem,
  | "id"
  | "code"
  | "division"
  | "criterion"
  | "status"
  | "updatedAt"
  | "approvalLogs"
>;

function log(action: ApprovalLog["action"], actorId = currentUser.id): ApprovalLog {
  return {
    id: `log-${action}-${actorId}`,
    actorId,
    actorName: actorId,
    actorRole: "consolidator",
    action,
    fromStatus: "pending_l2",
    toStatus: action === "revise" ? "revision_requested" : "pending_l3",
    createdAt: "2569-05-07",
  };
}

function kpi(
  id: string,
  status: ApprovalStatus,
  updatedAt: string,
  approvalLogs: ApprovalLog[] = [],
  division = DIVISION,
): KpiItem {
  return {
    ...baseKpi,
    id,
    code: `KPI-${id}`,
    division,
    criterion: `KPI title ${id}`,
    status,
    updatedAt,
    approvalLogs,
  };
}

function report(
  id: string,
  kpiId: string,
  status: ApprovalStatus,
  updatedAt: string,
  approvalLogs: ApprovalLog[] = [],
  division = DIVISION,
): MonthlyReport {
  return {
    id,
    kpiId,
    month: 5,
    year: 2569,
    division,
    actual: 88,
    scoreLevel: 4,
    status,
    performanceSummary: `Report summary ${id}`,
    level4Action: "",
    obstacles: "",
    correctivePlan: "",
    approvalLogs,
    updatedAt,
  };
}

const canView = (_user: UserProfile, item: { division: KpiItem["division"] }) =>
  item.division === DIVISION;

const canApprove = (
  _user: UserProfile,
  item: { status: ApprovalStatus },
) => item.status === "pending_l2";

test("buildApprovalQueueAnalytics creates role-aware pending and done queues", () => {
  const analytics = buildApprovalQueueAnalytics({
    currentUser,
    kpis: [
      kpi("pending-old", "pending_l2", "2569-05-01"),
      kpi("done", "approved", "2569-05-05", [log("approve")]),
      kpi("hidden", "pending_l2", "2569-05-09", [], HIDDEN_DIVISION),
    ],
    reports: [
      report("rpt-pending-new", "pending-old", "pending_l2", "2569-05-08"),
      report("rpt-done", "done", "approved", "2569-05-06", [log("revise")]),
      report("rpt-not-mine", "done", "approved", "2569-05-07", [
        log("approve", "someone-else"),
      ]),
    ],
    canView,
    canApprove,
    now: "2569-05-10",
  });

  assert.equal(analytics.summary.pendingCount, 2);
  assert.equal(analytics.summary.kpiPendingCount, 1);
  assert.equal(analytics.summary.reportPendingCount, 1);
  assert.equal(analytics.summary.doneCount, 2);
  assert.deepEqual(
    analytics.pending.map((item) => item.key),
    ["report:rpt-pending-new", "kpi:pending-old"],
  );
  assert.equal(analytics.pending[1].ageDays, 9);
  assert.equal(analytics.pending[1].priorityTone, "danger");
});

test("selectApprovalQueueItems filters by kind, tab, and search text", () => {
  const analytics = buildApprovalQueueAnalytics({
    currentUser,
    kpis: [kpi("pending-old", "pending_l2", "2569-05-01")],
    reports: [
      report("rpt-pending-new", "pending-old", "pending_l2", "2569-05-08"),
      report("rpt-done", "pending-old", "approved", "2569-05-06", [
        log("approve"),
      ]),
    ],
    canView,
    canApprove,
    now: "2569-05-10",
  });

  const pendingReports = selectApprovalQueueItems(analytics, {
    kind: "report",
    tab: "pending",
    query: "report summary rpt-pending",
  });
  assert.deepEqual(
    pendingReports.map((item) => item.key),
    ["report:rpt-pending-new"],
  );

  const pendingKpis = selectApprovalQueueItems(analytics, {
    kind: "kpi",
    tab: "pending",
    query: "KPI-pending-old",
  });
  assert.deepEqual(
    pendingKpis.map((item) => item.key),
    ["kpi:pending-old"],
  );

  const doneItems = selectApprovalQueueItems(analytics, {
    kind: "all",
    tab: "done",
    query: "",
  });
  assert.deepEqual(
    doneItems.map((item) => item.key),
    ["report:rpt-done"],
  );
});
