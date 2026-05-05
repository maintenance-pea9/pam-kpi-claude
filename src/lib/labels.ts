import type { ApprovalStatus, DivisionCode, Role } from "./types";

export const roleLabels: Record<Role, string> = {
  department_director: "ผู้อำนวยการฝ่าย ฝบร.",
  consolidator: "ผู้รวบรวมส่งผู้บริหาร / เลขาฝ่าย",
  division_director: "ผู้อำนวยการกอง",
  assignee: "ผู้จัดทำข้อมูล (Assignee)",
  division_staff: "พนักงานทั่วไปของกอง",
};

export const shortRoleLabels: Record<Role, string> = {
  department_director: "ผอ.ฝ่าย",
  consolidator: "ผู้รวบรวมฯ",
  division_director: "ผอ.กอง",
  assignee: "ผู้จัดทำ",
  division_staff: "พนักงาน",
};

export const divisionLabels: Record<DivisionCode, string> = {
  "กบผ.": "กองจัดการงานบำรุงรักษาระบบผลิต",
  "กบร.": "กองบริหารจัดการระบบไฟฟ้า",
  "กบค.": "กองบริหารจัดการงานเครื่องกล",
};

export const statusLabels: Record<ApprovalStatus, string> = {
  draft: "ฉบับร่าง",
  pending_l1: "รอ ผอ.กอง อนุมัติ",
  pending_l2: "รอผู้รวบรวมฯ ตรวจสอบ",
  pending_l3: "รอ ผอ.ฝ่าย อนุมัติ",
  approved: "อนุมัติแล้ว",
  revision_requested: "ส่งกลับแก้ไข",
};
