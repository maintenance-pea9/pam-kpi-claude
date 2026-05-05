import type {
  ApprovalAction,
  ApprovalStatus,
  DivisionCode,
  KpiItem,
  KpiTargets,
  MonthlyReport,
  UserProfile,
} from "./types";

export const DIVISIONS: DivisionCode[] = ["กบผ.", "กบร.", "กบค."];

const editableStatuses: ApprovalStatus[] = ["draft", "revision_requested"];

type Approvable = Pick<KpiItem | MonthlyReport, "division" | "status">;

export function getVisibleDivisionCodes(user: UserProfile): DivisionCode[] {
  if (user.role === "department_director" || user.role === "consolidator") {
    return DIVISIONS;
  }
  return user.division ? [user.division] : [];
}

export function canView(user: UserProfile, item: Approvable): boolean {
  return getVisibleDivisionCodes(user).includes(item.division);
}

export function canEdit(user: UserProfile, item: Approvable): boolean {
  return (
    user.role === "assignee" &&
    user.division === item.division &&
    editableStatuses.includes(item.status)
  );
}

export function canSubmit(user: UserProfile, item: Approvable): boolean {
  return canEdit(user, item);
}

export function canApprove(user: UserProfile, item: Approvable): boolean {
  if (!canView(user, item)) return false;

  if (user.role === "division_director") {
    return user.division === item.division && item.status === "pending_l1";
  }
  if (user.role === "consolidator") {
    return item.status === "pending_l2";
  }
  if (user.role === "department_director") {
    return item.status === "pending_l3";
  }
  return false;
}

export function canRevise(user: UserProfile, item: Approvable): boolean {
  return canApprove(user, item);
}

export function advanceApprovalStatus(
  status: ApprovalStatus,
  action: ApprovalAction,
): ApprovalStatus {
  if (action === "revise") return "revision_requested";

  if (action === "submit") {
    return status === "draft" || status === "revision_requested"
      ? "pending_l1"
      : status;
  }

  if (status === "pending_l1") return "pending_l2";
  if (status === "pending_l2") return "pending_l3";
  if (status === "pending_l3") return "approved";

  return status;
}

export function computeLevel(
  actual: number | null | undefined,
  targets: KpiTargets,
  unit: string,
): 0 | 1 | 2 | 3 | 4 | 5 {
  if (actual === null || actual === undefined) return 0;
  const v = Number(actual);
  if (isNaN(v)) return 0;

  const lowerIsBetter = unit === "ครั้ง";
  if (lowerIsBetter) {
    if (v <= targets[5]) return 5;
    if (v <= targets[4]) return 4;
    if (v <= targets[3]) return 3;
    if (v <= targets[2]) return 2;
    if (v <= targets[1]) return 1;
    return 0;
  } else {
    if (v >= targets[5]) return 5;
    if (v >= targets[4]) return 4;
    if (v >= targets[3]) return 3;
    if (v >= targets[2]) return 2;
    if (v >= targets[1]) return 1;
    return 0;
  }
}

const thaiMonths = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

export const MONTHS_TH = thaiMonths;

export const MONTHS_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.",
  "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.",
  "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

export function formatThaiMonthYear(month: number, year: number): string {
  return `${thaiMonths[month - 1]} ${year}`;
}
