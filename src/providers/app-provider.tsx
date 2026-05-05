"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

import {
  countPendingTasks,
  seedKpis,
  seedReports,
  seedUsers,
} from "@/lib/mock-data";
import type {
  ApprovalAction,
  ApprovalLog,
  KpiItem,
  MonthlyReport,
  UserProfile,
} from "@/lib/types";
import {
  advanceApprovalStatus,
  canApprove,
  canEdit,
  canRevise,
  canSubmit,
  canView,
  getVisibleDivisionCodes,
} from "@/lib/workflow";

type RecordKind = "kpi" | "report";

type AppContextValue = {
  users: UserProfile[];
  currentUser: UserProfile | null;
  selectedMonth: number;
  selectedYear: number;
  kpis: KpiItem[];
  reports: MonthlyReport[];
  visibleKpis: KpiItem[];
  visibleReports: MonthlyReport[];
  pendingTasks: number;
  login: (employeeId: string) => boolean;
  logout: () => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  submitRecord: (kind: RecordKind, id: string, note?: string) => void;
  approveRecord: (kind: RecordKind, id: string, note?: string) => void;
  reviseRecord: (kind: RecordKind, id: string, reason: string) => void;
  updateKpi: (id: string, updates: Partial<KpiItem>) => void;
  createKpi: (
    kpi: Omit<KpiItem, "id" | "code" | "status" | "updatedAt" | "approvalLogs">,
  ) => string;
  updateReport: (id: string, updates: Partial<MonthlyReport>) => void;
  createReport: (kpiId: string, month: number, year: number) => string;
  resetData: () => void;
  canView: typeof canView;
  canEdit: typeof canEdit;
  canSubmit: typeof canSubmit;
  canApprove: typeof canApprove;
  canRevise: typeof canRevise;
};

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "pam-kpi-claude-state-v2569";

type StoredState = {
  currentUserId: string | null;
  selectedMonth: number;
  selectedYear: number;
  kpis: KpiItem[];
  reports: MonthlyReport[];
};

type StoredStateUpdate =
  | StoredState
  | ((currentState: StoredState) => StoredState);

const defaultState: StoredState = {
  currentUserId: null,
  selectedMonth: 5,
  selectedYear: 2569,
  kpis: seedKpis,
  reports: seedReports,
};

function readStoredState(): StoredState {
  if (typeof window === "undefined") {
    return defaultState;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultState;
  }
  try {
    return JSON.parse(stored) as StoredState;
  } catch {
    return defaultState;
  }
}

const storeListeners = new Set<() => void>();
let cachedState: StoredState = defaultState;
let hasLoadedStoredState = false;

function getClientStateSnapshot(): StoredState {
  if (typeof window === "undefined") {
    return defaultState;
  }

  if (!hasLoadedStoredState) {
    cachedState = readStoredState();
    hasLoadedStoredState = true;
  }

  return cachedState;
}

function getServerStateSnapshot(): StoredState {
  return defaultState;
}

function subscribeToStoredState(listener: () => void): () => void {
  storeListeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    hasLoadedStoredState = false;
    listener();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    storeListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function writeStoredState(update: StoredStateUpdate): void {
  const currentState = getClientStateSnapshot();
  const nextState =
    typeof update === "function" ? update(currentState) : update;

  cachedState = nextState;
  hasLoadedStoredState = true;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  storeListeners.forEach((listener) => listener());
}

function createLog(
  user: UserProfile,
  fromStatus: ApprovalLog["fromStatus"],
  action: ApprovalAction,
  toStatus: ApprovalLog["toStatus"],
  reason?: string,
): ApprovalLog {
  return {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action,
    fromStatus,
    toStatus,
    reason: reason || undefined,
    createdAt: new Date().toISOString(),
  };
}

function updateRecordStatus<T extends KpiItem | MonthlyReport>(
  items: T[],
  id: string,
  user: UserProfile,
  action: ApprovalAction,
  reason?: string,
): T[] {
  return items.map((item) => {
    if (item.id !== id) return item;
    const toStatus = advanceApprovalStatus(item.status, action);
    if (toStatus === item.status && action !== "revise") return item;
    return {
      ...item,
      status: toStatus,
      updatedAt: new Date().toISOString().slice(0, 10),
      approvalLogs: [
        ...item.approvalLogs,
        createLog(user, item.status, action, toStatus, reason),
      ],
    };
  });
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(
    subscribeToStoredState,
    getClientStateSnapshot,
    getServerStateSnapshot,
  );
  const setState = useCallback((update: StoredStateUpdate) => {
    writeStoredState(update);
  }, []);

  const currentUser = useMemo<UserProfile | null>(
    () =>
      state.currentUserId
        ? (seedUsers.find((u) => u.id === state.currentUserId) ?? null)
        : null,
    [state.currentUserId],
  );

  const visibleDivisions = useMemo(
    () => (currentUser ? getVisibleDivisionCodes(currentUser) : []),
    [currentUser],
  );

  const visibleKpis = useMemo(
    () =>
      state.kpis.filter((item) => visibleDivisions.includes(item.division)),
    [state.kpis, visibleDivisions],
  );

  const visibleReports = useMemo(
    () =>
      state.reports.filter(
        (item) =>
          visibleDivisions.includes(item.division) &&
          item.month === state.selectedMonth &&
          item.year === state.selectedYear,
      ),
    [state.reports, visibleDivisions, state.selectedMonth, state.selectedYear],
  );

  const pendingTasks = useMemo(
    () =>
      currentUser
        ? countPendingTasks(currentUser, state.kpis, state.reports)
        : 0,
    [currentUser, state.kpis, state.reports],
  );

  // Stable ref for callbacks that need currentUser without invalidating identity
  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const login = useCallback((employeeId: string): boolean => {
    const user = seedUsers.find((u) => u.employeeId === employeeId);
    if (!user) return false;
    setState((c) => ({ ...c, currentUserId: user.id }));
    return true;
  }, [setState]);

  const logout = useCallback(() => {
    setState((c) => ({ ...c, currentUserId: null }));
  }, [setState]);

  const setSelectedMonth = useCallback((month: number) => {
    setState((c) => ({ ...c, selectedMonth: month }));
  }, [setState]);

  const setSelectedYear = useCallback((year: number) => {
    setState((c) => ({ ...c, selectedYear: year }));
  }, [setState]);

  const submitRecord = useCallback((kind: RecordKind, id: string, note?: string) => {
    const user = currentUserRef.current;
    if (!user) return;
    setState((c) => ({
      ...c,
      kpis:
        kind === "kpi"
          ? updateRecordStatus(c.kpis, id, user, "submit", note)
          : c.kpis,
      reports:
        kind === "report"
          ? updateRecordStatus(c.reports, id, user, "submit", note)
          : c.reports,
    }));
  }, [setState]);

  const approveRecord = useCallback((kind: RecordKind, id: string, note?: string) => {
    const user = currentUserRef.current;
    if (!user) return;
    setState((c) => ({
      ...c,
      kpis:
        kind === "kpi"
          ? updateRecordStatus(c.kpis, id, user, "approve", note)
          : c.kpis,
      reports:
        kind === "report"
          ? updateRecordStatus(c.reports, id, user, "approve", note)
          : c.reports,
    }));
  }, [setState]);

  const reviseRecord = useCallback(
    (kind: RecordKind, id: string, reason: string) => {
      const user = currentUserRef.current;
      if (!user) return;
      setState((c) => ({
        ...c,
        kpis:
          kind === "kpi"
            ? updateRecordStatus(c.kpis, id, user, "revise", reason)
            : c.kpis,
        reports:
          kind === "report"
            ? updateRecordStatus(c.reports, id, user, "revise", reason)
            : c.reports,
      }));
    },
    [setState],
  );

  const updateKpi = useCallback((id: string, updates: Partial<KpiItem>) => {
    setState((c) => ({
      ...c,
      kpis: c.kpis.map((k) =>
        k.id === id
          ? {
              ...k,
              ...updates,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : k,
      ),
    }));
  }, [setState]);

  const createKpi = useCallback(
    (
      kpi: Omit<
        KpiItem,
        "id" | "code" | "status" | "updatedAt" | "approvalLogs"
      >,
    ): string => {
      const id = `kpi-${Date.now()}`;
      let code = "";
      setState((c) => {
        const divCount =
          c.kpis.filter((k) => k.division === kpi.division).length + 1;
        code = `${kpi.division}-${String(divCount).padStart(3, "0")}`;
        const newKpi: KpiItem = {
          ...kpi,
          id,
          code,
          status: "draft",
          updatedAt: new Date().toISOString().slice(0, 10),
          approvalLogs: [],
        };
        return { ...c, kpis: [...c.kpis, newKpi] };
      });
      return id;
    },
    [setState],
  );

  const updateReport = useCallback(
    (id: string, updates: Partial<MonthlyReport>) => {
      setState((c) => ({
        ...c,
        reports: c.reports.map((r) =>
          r.id === id
            ? {
                ...r,
                ...updates,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : r,
        ),
      }));
    },
    [setState],
  );

  const createReport = useCallback(
    (kpiId: string, month: number, year: number): string => {
      const id = `rpt-${kpiId}-${year}-${String(month).padStart(2, "0")}`;
      setState((c) => {
        const existing = c.reports.find((r) => r.id === id);
        if (existing) return c;
        const kpi = c.kpis.find((k) => k.id === kpiId);
        const newReport: MonthlyReport = {
          id,
          kpiId,
          month,
          year,
          division: kpi?.division ?? "กบร.",
          actual: null,
          scoreLevel: 0,
          status: "draft",
          performanceSummary: "",
          level4Action: "",
          obstacles: "",
          correctivePlan: "",
          approvalLogs: [],
          updatedAt: new Date().toISOString().slice(0, 10),
        };
        return { ...c, reports: [...c.reports, newReport] };
      });
      return id;
    },
    [setState],
  );

  const resetData = useCallback(() => {
    setState(defaultState);
  }, [setState]);

  const value = useMemo<AppContextValue>(
    () => ({
      users: seedUsers,
      currentUser,
      selectedMonth: state.selectedMonth,
      selectedYear: state.selectedYear,
      kpis: state.kpis,
      reports: state.reports,
      visibleKpis,
      visibleReports,
      pendingTasks,
      login,
      logout,
      setSelectedMonth,
      setSelectedYear,
      submitRecord,
      approveRecord,
      reviseRecord,
      updateKpi,
      createKpi,
      updateReport,
      createReport,
      resetData,
      canView,
      canEdit,
      canSubmit,
      canApprove,
      canRevise,
    }),
    [
      currentUser,
      state.selectedMonth,
      state.selectedYear,
      state.kpis,
      state.reports,
      visibleKpis,
      visibleReports,
      pendingTasks,
      login,
      logout,
      setSelectedMonth,
      setSelectedYear,
      submitRecord,
      approveRecord,
      reviseRecord,
      updateKpi,
      createKpi,
      updateReport,
      createReport,
      resetData,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}
