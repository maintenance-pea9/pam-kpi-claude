import type {
  ApprovalLog,
  ApprovalStatus,
  DivisionCode,
  KpiItem,
  KpiTargets,
  MonthlyReport,
  UserProfile,
} from "./types";

const MONTHS_TH = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export type QueueKind = "all" | "kpi" | "report";
export type QueueTabState = "pending" | "done";
export type PriorityTone = "neutral" | "warning" | "danger";

type Approvable = Pick<KpiItem | MonthlyReport, "division" | "status">;

export type ApprovalQueueItem = {
  key: string;
  id: string;
  kind: "kpi" | "report";
  kindLabel: string;
  code: string;
  title: string;
  description: string;
  division: DivisionCode;
  status: ApprovalStatus;
  updatedAt: string;
  href: string;
  logs: ApprovalLog[];
  canAct: boolean;
  ageDays: number;
  ageLabel: string;
  priorityTone: PriorityTone;
  searchText: string;
  lastLog?: ApprovalLog;
  kpiInfo?: {
    weight: number;
    unit: string;
    category: string;
    owner: string;
    targets: KpiTargets;
  };
  reportInfo?: {
    month: number;
    year: number;
    actual: number | null;
    scoreLevel: 0 | 1 | 2 | 3 | 4 | 5;
    performanceSummary: string;
    obstacles: string;
    unit: string;
  };
};

export type ApprovalQueueSummary = {
  pendingCount: number;
  kpiPendingCount: number;
  reportPendingCount: number;
  doneCount: number;
  visibleCount: number;
};

export type ApprovalQueueAnalytics = {
  items: ApprovalQueueItem[];
  pending: ApprovalQueueItem[];
  done: ApprovalQueueItem[];
  summary: ApprovalQueueSummary;
};

type BuildApprovalQueueAnalyticsInput = {
  currentUser: UserProfile | null;
  kpis: KpiItem[];
  reports: MonthlyReport[];
  canView: (user: UserProfile, item: Approvable) => boolean;
  canApprove: (user: UserProfile, item: Approvable) => boolean;
  now?: string | Date;
};

export function buildApprovalQueueAnalytics({
  currentUser,
  kpis,
  reports,
  canView,
  canApprove,
  now = new Date(),
}: BuildApprovalQueueAnalyticsInput): ApprovalQueueAnalytics {
  if (!currentUser) {
    return {
      items: [],
      pending: [],
      done: [],
      summary: {
        pendingCount: 0,
        kpiPendingCount: 0,
        reportPendingCount: 0,
        doneCount: 0,
        visibleCount: 0,
      },
    };
  }

  const kpiInfoById = new Map(
    kpis.map((kpi) => [
      kpi.id,
      {
        code: kpi.code,
        name: kpi.criterion,
        definition: kpi.definition,
        unit: kpi.unit,
        category: kpi.category,
        owner: kpi.primaryOwner,
        weight: kpi.weight,
        targets: kpi.targets,
      },
    ]),
  );

  const kpiItems = kpis
    .filter((kpi) => canView(currentUser, kpi))
    .map<ApprovalQueueItem>((kpi) => {
      const canAct = canApprove(currentUser, kpi);
      const ageDays = getAgeDays(kpi.updatedAt, now);
      const item: ApprovalQueueItem = {
        key: `kpi:${kpi.id}`,
        id: kpi.id,
        kind: "kpi",
        kindLabel: "KPI Master",
        code: kpi.code,
        title: kpi.criterion,
        description: kpi.definition,
        division: kpi.division,
        status: kpi.status,
        updatedAt: kpi.updatedAt,
        href: `/kpi/${kpi.id}`,
        logs: kpi.approvalLogs,
        canAct,
        ageDays,
        ageLabel: formatAgeLabel(ageDays),
        priorityTone: getPriorityTone(ageDays, canAct),
        searchText: "",
        lastLog: kpi.approvalLogs.at(-1),
        kpiInfo: {
          weight: kpi.weight,
          unit: kpi.unit,
          category: kpi.category,
          owner: kpi.primaryOwner,
          targets: kpi.targets,
        },
      };

      return { ...item, searchText: buildSearchText(item) };
    });

  const reportItems = reports
    .filter((report) => canView(currentUser, report))
    .map<ApprovalQueueItem>((report) => {
      const kpi = kpiInfoById.get(report.kpiId);
      const canAct = canApprove(currentUser, report);
      const ageDays = getAgeDays(report.updatedAt, now);
      const monthLabel = MONTHS_TH[report.month - 1] ?? "";
      const item: ApprovalQueueItem = {
        key: `report:${report.id}`,
        id: report.id,
        kind: "report",
        kindLabel: "รายงาน",
        code: kpi?.code ?? report.id,
        title: kpi?.name ?? report.id,
        description: report.performanceSummary || "ไม่มีรายละเอียดประกอบผล",
        division: report.division,
        status: report.status,
        updatedAt: report.updatedAt,
        href: `/reports/${report.id}`,
        logs: report.approvalLogs,
        canAct,
        ageDays,
        ageLabel: formatAgeLabel(ageDays),
        priorityTone: getPriorityTone(ageDays, canAct),
        searchText: "",
        lastLog: report.approvalLogs.at(-1),
        reportInfo: {
          month: report.month,
          year: report.year,
          actual: report.actual,
          scoreLevel: report.scoreLevel,
          performanceSummary: report.performanceSummary,
          obstacles: report.obstacles,
          unit: kpi?.unit ?? "",
        },
      };

      return {
        ...item,
        searchText: buildSearchText(item, [monthLabel, String(report.year)]),
      };
    });

  const items = [...kpiItems, ...reportItems];
  const pending = sortQueueItems(items.filter((item) => item.canAct));
  const done = sortQueueItems(filterDoneItems(items, currentUser));

  return {
    items,
    pending,
    done,
    summary: {
      pendingCount: pending.length,
      kpiPendingCount: pending.filter((item) => item.kind === "kpi").length,
      reportPendingCount: pending.filter((item) => item.kind === "report").length,
      doneCount: done.length,
      visibleCount: items.length,
    },
  };
}

export function selectApprovalQueueItems(
  analytics: ApprovalQueueAnalytics,
  {
    kind,
    tab,
    query,
  }: {
    kind: QueueKind;
    tab: QueueTabState;
    query: string;
  },
): ApprovalQueueItem[] {
  const normalizedQuery = normalizeSearch(query);
  const source = tab === "pending" ? analytics.pending : analytics.done;

  return source.filter((item) => {
    const matchesKind = kind === "all" || item.kind === kind;
    const matchesQuery =
      !normalizedQuery || item.searchText.includes(normalizedQuery);
    return matchesKind && matchesQuery;
  });
}

function filterDoneItems(
  items: ApprovalQueueItem[],
  currentUser: UserProfile,
): ApprovalQueueItem[] {
  return items.filter(
    (item) =>
      !item.canAct &&
      item.logs.some(
        (log) =>
          log.actorId === currentUser.id &&
          (log.action === "approve" || log.action === "revise"),
      ),
  );
}

function sortQueueItems(items: ApprovalQueueItem[]): ApprovalQueueItem[] {
  return [...items].sort((a, b) => {
    const actionOrder = Number(b.canAct) - Number(a.canAct);
    if (actionOrder !== 0) return actionOrder;

    const dateOrder = b.updatedAt.localeCompare(a.updatedAt);
    if (dateOrder !== 0) return dateOrder;

    return a.title.localeCompare(b.title);
  });
}

function getAgeDays(updatedAt: string, now: string | Date): number {
  const updatedAtMs = new Date(`${updatedAt}T00:00:00`).getTime();
  const nowDate = typeof now === "string" ? new Date(`${now}T00:00:00`) : now;
  const nowMs = nowDate.getTime();

  if (!Number.isFinite(updatedAtMs) || !Number.isFinite(nowMs)) return 0;

  return Math.max(0, Math.floor((nowMs - updatedAtMs) / 86_400_000));
}

function formatAgeLabel(ageDays: number): string {
  if (ageDays <= 0) return "วันนี้";
  if (ageDays === 1) return "1 วัน";
  return `${ageDays} วัน`;
}

function getPriorityTone(ageDays: number, canAct: boolean): PriorityTone {
  if (!canAct) return "neutral";
  if (ageDays >= 7) return "danger";
  if (ageDays >= 3) return "warning";
  return "neutral";
}

function buildSearchText(item: ApprovalQueueItem, extra: string[] = []): string {
  return normalizeSearch(
    [
      item.code,
      item.title,
      item.description,
      item.division,
      item.kindLabel,
      item.kpiInfo?.category,
      item.kpiInfo?.owner,
      item.reportInfo?.performanceSummary,
      item.reportInfo?.obstacles,
      ...extra,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase("th-TH");
}
