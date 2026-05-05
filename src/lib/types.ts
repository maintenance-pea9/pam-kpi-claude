export type Role =
  | "department_director"
  | "consolidator"
  | "division_director"
  | "assignee"
  | "division_staff";

export type DivisionCode = "กบผ." | "กบร." | "กบค.";

export type ApprovalStatus =
  | "draft"
  | "pending_l1"
  | "pending_l2"
  | "pending_l3"
  | "approved"
  | "revision_requested";

export type ApprovalAction = "submit" | "approve" | "revise";

export type UserProfile = {
  id: string;
  employeeId: string;
  name: string;
  initial: string;
  role: Role;
  division: DivisionCode | null;
  title: string;
};

export type ApprovalLog = {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: ApprovalAction;
  fromStatus: ApprovalStatus;
  toStatus: ApprovalStatus;
  reason?: string;
  createdAt: string;
};

export type KpiTargets = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type KpiItem = {
  id: string;
  code: string;
  division: DivisionCode;
  criterion: string;
  definition: string;
  unit: string;
  weight: number;
  category: string;
  targets: KpiTargets;
  primaryOwner: string;
  coOwners: string[];
  initiative: string;
  status: ApprovalStatus;
  updatedAt: string;
  approvalLogs: ApprovalLog[];
};

export type MonthlyReport = {
  id: string;
  kpiId: string;
  month: number;
  year: number;
  division: DivisionCode;
  actual: number | null;
  scoreLevel: 0 | 1 | 2 | 3 | 4 | 5;
  status: ApprovalStatus;
  performanceSummary: string;
  level4Action: string;
  obstacles: string;
  correctivePlan: string;
  approvalLogs: ApprovalLog[];
  updatedAt: string;
};
