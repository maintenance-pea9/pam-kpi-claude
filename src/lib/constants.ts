type NavIcon = "LayoutDashboard" | "ListChecks" | "BarChart3" | "CheckSquare";

type NavItem = {
  id: string;
  icon: NavIcon;
  label: string;
  href: string;
  showBadge: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: "LayoutDashboard", label: "ภาพรวม KPI", href: "/dashboard", showBadge: false },
  { id: "kpi", icon: "ListChecks", label: "รายการตัวชี้วัด", href: "/kpi", showBadge: false },
  { id: "reports", icon: "BarChart3", label: "รายงานผลรายเดือน", href: "/reports", showBadge: false },
  { id: "approvals", icon: "CheckSquare", label: "คิวอนุมัติ", href: "/approvals", showBadge: true },
] as const;

export const PAGE_TITLES: Record<string, { title: string; crumbs: string[] }> = {
  dashboard: { title: "ภาพรวม KPI", crumbs: ["ภาพรวม KPI"] },
  kpi: { title: "รายการตัวชี้วัด", crumbs: ["รายการตัวชี้วัด (KPI Master Data)"] },
  "kpi-detail": { title: "หัวข้อตัวชี้วัด", crumbs: ["รายการตัวชี้วัด", "รายละเอียด KPI"] },
  reports: { title: "รายงานผลรายเดือน", crumbs: ["รายงานผลรายเดือน"] },
  "report-detail": { title: "รายงานผล", crumbs: ["รายงานผลรายเดือน", "รายละเอียด"] },
  approvals: { title: "คิวอนุมัติ", crumbs: ["คิวอนุมัติ"] },
};

export const KPI_CATEGORIES = [
  "ความปลอดภัย",
  "ประสิทธิภาพ",
  "การบำรุงรักษา",
  "งบประมาณ",
  "การบริการ",
  "นวัตกรรม",
];

export const KPI_UNITS = ["%", "ครั้ง", "ชิ้น", "หน่วย", "บาท", "ชั่วโมง", "วัน", "คน"];

export const DEMO_ROLES = [
  { key: "director", label: "ผอ.ฝ่าย" },
  { key: "consolidator", label: "ผู้รวบรวมฯ" },
  { key: "divhead_gbr", label: "ผอ.กอง กบร." },
  { key: "assignee_gbr", label: "ผู้จัดทำ กบร." },
  { key: "staff_gbr", label: "พนักงาน กบร." },
];
