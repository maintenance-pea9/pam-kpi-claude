// data.jsx — Mock data & state management for PAM KPI System

/* ═══ ROLES ═══ */
const ROLES = {
  director:    { id: 'director',    label: 'ผู้อำนวยการฝ่าย ฝบร.',           short: 'ผอ.ฝ่าย',    div: null,   level: 5 },
  consolidator:{ id: 'consolidator',label: 'ผู้รวบรวมส่งผู้บริหาร / เลขาฝ่าย', short: 'ผู้รวบรวมฯ', div: null,   level: 4 },
  divhead_gbp: { id: 'divhead_gbp', label: 'ผู้อำนวยการกอง กบผ.',             short: 'ผอ.กอง',     div: 'กบผ.', level: 3 },
  divhead_gbr: { id: 'divhead_gbr', label: 'ผู้อำนวยการกอง กบร.',             short: 'ผอ.กอง',     div: 'กบร.', level: 3 },
  divhead_gbc: { id: 'divhead_gbc', label: 'ผู้อำนวยการกอง กบค.',             short: 'ผอ.กอง',     div: 'กบค.', level: 3 },
  assignee_gbp:{ id: 'assignee_gbp',label: 'ผู้จัดทำข้อมูล (Assignee) กบผ.',  short: 'ผู้จัดทำ',   div: 'กบผ.', level: 2 },
  assignee_gbr:{ id: 'assignee_gbr',label: 'ผู้จัดทำข้อมูล (Assignee) กบร.',  short: 'ผู้จัดทำ',   div: 'กบร.', level: 2 },
  assignee_gbc:{ id: 'assignee_gbc',label: 'ผู้จัดทำข้อมูล (Assignee) กบค.',  short: 'ผู้จัดทำ',   div: 'กบค.', level: 2 },
  staff_gbr:   { id: 'staff_gbr',   label: 'พนักงานทั่วไป กบร.',              short: 'พนักงาน',    div: 'กบร.', level: 1 },
};

const DEMO_USERS = {
  director:     { name: 'นายวิชัย สุวรรณภูมิ',   initial: 'ว', role: 'director' },
  consolidator: { name: 'นางสาวพรทิพย์ มงคล',    initial: 'พ', role: 'consolidator' },
  divhead_gbp:  { name: 'นายธนากร อินทรชิต',      initial: 'ธ', role: 'divhead_gbp' },
  divhead_gbr:  { name: 'นายสุรชัย วงศ์สุวรรณ',  initial: 'ส', role: 'divhead_gbr' },
  divhead_gbc:  { name: 'นางสาวอรุณี เพชรพลาย',  initial: 'อ', role: 'divhead_gbc' },
  assignee_gbp: { name: 'นายกิตติ รักษาวงศ์',     initial: 'ก', role: 'assignee_gbp' },
  assignee_gbr: { name: 'นายสมชาย ใจดี',          initial: 'ส', role: 'assignee_gbr' },
  assignee_gbc: { name: 'นางวิภา ทองดี',           initial: 'ว', role: 'assignee_gbc' },
  staff_gbr:    { name: 'นายประยุทธ์ แสงแก้ว',    initial: 'ป', role: 'staff_gbr' },
};

/* ═══ KPI MASTER DATA ═══ */
const INITIAL_KPIS = [
  {
    id: 'กบผ.-001',
    name: 'อัตราการตอบสนองต่อเหตุขัดข้องระบบผลิต',
    definition: 'วัดเวลาตอบสนองเฉลี่ยต่อเหตุขัดข้องในระบบผลิตไฟฟ้า ภายใน 2 ชั่วโมงหลังจากได้รับแจ้ง',
    unit: '%', weight: 20, div: 'กบผ.', category: 'ความปลอดภัย',
    owner: 'นายกิตติ รักษาวงศ์', coOwner: '', initiative: 'แผนการบำรุงรักษาเชิงป้องกัน 2568',
    targets: { 1: 70, 2: 80, 3: 90, 4: 95, 5: 98 },
    status: 'approved',
    logs: [
      { action: 'saved', actor: 'นายกิตติ รักษาวงศ์', role: 'ผู้จัดทำ', date: '1 ก.พ. 2568', comment: '' },
      { action: 'submitted', actor: 'นายกิตติ รักษาวงศ์', role: 'ผู้จัดทำ', date: '2 ก.พ. 2568', comment: 'ส่งขออนุมัติหัวข้อ KPI ประจำปี 2568' },
      { action: 'approved', actor: 'นายธนากร อินทรชิต', role: 'ผอ.กอง กบผ.', date: '3 ก.พ. 2568', comment: 'อนุมัติ เป้าหมายเหมาะสม' },
      { action: 'approved', actor: 'นางสาวพรทิพย์ มงคล', role: 'ผู้รวบรวมฯ', date: '4 ก.พ. 2568', comment: 'ผ่านการตรวจสอบ' },
      { action: 'approved', actor: 'นายวิชัย สุวรรณภูมิ', role: 'ผอ.ฝ่าย ฝบร.', date: '5 ก.พ. 2568', comment: 'อนุมัติ' },
    ]
  },
  {
    id: 'กบผ.-002',
    name: 'จำนวนงานบำรุงรักษาตามแผนที่แล้วเสร็จ',
    definition: 'วัดสัดส่วนงานบำรุงรักษาที่ดำเนินการแล้วเสร็จตามแผนประจำปีที่กำหนดไว้ล่วงหน้า',
    unit: '%', weight: 15, div: 'กบผ.', category: 'การบำรุงรักษา',
    owner: 'นายกิตติ รักษาวงศ์', coOwner: '', initiative: 'โครงการ PM ครบ 100%',
    targets: { 1: 60, 2: 70, 3: 80, 4: 90, 5: 95 },
    status: 'approved',
    logs: [
      { action: 'submitted', actor: 'นายกิตติ รักษาวงศ์', role: 'ผู้จัดทำ', date: '2 ก.พ. 2568', comment: '' },
      { action: 'approved', actor: 'นายธนากร อินทรชิต', role: 'ผอ.กอง กบผ.', date: '3 ก.พ. 2568', comment: '' },
      { action: 'approved', actor: 'นางสาวพรทิพย์ มงคล', role: 'ผู้รวบรวมฯ', date: '4 ก.พ. 2568', comment: '' },
      { action: 'approved', actor: 'นายวิชัย สุวรรณภูมิ', role: 'ผอ.ฝ่าย', date: '5 ก.พ. 2568', comment: '' },
    ]
  },
  {
    id: 'กบร.-001',
    name: 'ความพร้อมใช้งานของระบบจำหน่ายไฟฟ้า',
    definition: 'วัดสัดส่วนเวลาที่ระบบจำหน่ายไฟฟ้าพร้อมใช้งานได้อย่างปกติต่อเวลาทั้งหมดในเดือนนั้น',
    unit: '%', weight: 25, div: 'กบร.', category: 'ประสิทธิภาพ',
    owner: 'นายสมชาย ใจดี', coOwner: 'นายประยุทธ์ แสงแก้ว', initiative: 'โครงการยกระดับความเชื่อถือได้ระบบไฟฟ้า',
    targets: { 1: 90, 2: 93, 3: 95, 4: 97, 5: 99 },
    status: 'approved',
    logs: [
      { action: 'submitted', actor: 'นายสมชาย ใจดี', role: 'ผู้จัดทำ', date: '2 ก.พ. 2568', comment: '' },
      { action: 'approved', actor: 'นายสุรชัย วงศ์สุวรรณ', role: 'ผอ.กอง กบร.', date: '3 ก.พ. 2568', comment: '' },
      { action: 'approved', actor: 'นางสาวพรทิพย์ มงคล', role: 'ผู้รวบรวมฯ', date: '4 ก.พ. 2568', comment: '' },
      { action: 'approved', actor: 'นายวิชัย สุวรรณภูมิ', role: 'ผอ.ฝ่าย', date: '5 ก.พ. 2568', comment: '' },
    ]
  },
  {
    id: 'กบร.-002',
    name: 'อัตราการลดการสูญเสียพลังงานในระบบจำหน่าย',
    definition: 'วัดอัตราลดลงของพลังงานสูญเสียในระบบจำหน่ายเปรียบเทียบกับช่วงเดียวกันของปีก่อน',
    unit: '%', weight: 20, div: 'กบร.', category: 'ประสิทธิภาพ',
    owner: 'นายสมชาย ใจดี', coOwner: '', initiative: 'โครงการลดพลังงานสูญเสีย 2568',
    targets: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 7 },
    status: 'pending1',
    logs: [
      { action: 'saved', actor: 'นายสมชาย ใจดี', role: 'ผู้จัดทำ', date: '28 เม.ย. 2568', comment: 'บันทึกฉบับร่าง' },
      { action: 'submitted', actor: 'นายสมชาย ใจดี', role: 'ผู้จัดทำ', date: '2 พ.ค. 2568', comment: 'ส่งขออนุมัติหัวข้อ KPI ใหม่' },
    ]
  },
  {
    id: 'กบร.-003',
    name: 'จำนวนสินทรัพย์ระบบไฟฟ้าที่ได้รับการตรวจสอบ',
    definition: 'นับจำนวนสินทรัพย์ระบบไฟฟ้าที่ได้รับการตรวจสอบสภาพตามแผนประจำปี',
    unit: 'ชิ้น', weight: 10, div: 'กบร.', category: 'การบำรุงรักษา',
    owner: 'นายสมชาย ใจดี', coOwner: '', initiative: 'แผนตรวจสอบสินทรัพย์ประจำปี',
    targets: { 1: 50, 2: 80, 3: 120, 4: 160, 5: 200 },
    status: 'returned',
    logs: [
      { action: 'submitted', actor: 'นายสมชาย ใจดี', role: 'ผู้จัดทำ', date: '20 เม.ย. 2568', comment: '' },
      { action: 'returned', actor: 'นายสุรชัย วงศ์สุวรรณ', role: 'ผอ.กอง กบร.', date: '22 เม.ย. 2568', comment: 'กรุณาปรับเป้าหมายระดับ 5 ให้สอดคล้องกับกำลังของบุคลากร และเพิ่มแผนปฏิบัติการให้ชัดเจน' },
    ]
  },
  {
    id: 'กบค.-001',
    name: 'ความพร้อมใช้งานของเครื่องจักรกลหลักในระบบ',
    definition: 'วัดสัดส่วนเวลาที่เครื่องจักรกลหลักพร้อมใช้งานได้ต่อเวลาทั้งหมด',
    unit: '%', weight: 25, div: 'กบค.', category: 'ประสิทธิภาพ',
    owner: 'นางวิภา ทองดี', coOwner: '', initiative: 'โครงการเพิ่มประสิทธิภาพเครื่องจักร',
    targets: { 1: 85, 2: 88, 3: 91, 4: 94, 5: 97 },
    status: 'pending2',
    logs: [
      { action: 'submitted', actor: 'นางวิภา ทองดี', role: 'ผู้จัดทำ', date: '1 พ.ค. 2568', comment: '' },
      { action: 'approved', actor: 'นางสาวอรุณี เพชรพลาย', role: 'ผอ.กอง กบค.', date: '2 พ.ค. 2568', comment: 'อนุมัติ ข้อมูลครบถ้วน' },
    ]
  },
  {
    id: 'กบค.-002',
    name: 'จำนวนเหตุขัดข้องเครื่องกลที่ป้องกันได้',
    definition: 'นับจำนวนเหตุขัดข้องของเครื่องจักรกลที่เกิดขึ้นและสามารถป้องกันได้ด้วยการบำรุงรักษาเชิงป้องกัน (ต้องการให้น้อยลง)',
    unit: 'ครั้ง', weight: 15, div: 'กบค.', category: 'ความปลอดภัย',
    owner: 'นางวิภา ทองดี', coOwner: '', initiative: 'โครงการ Zero Breakdown',
    targets: { 1: 10, 2: 8, 3: 5, 4: 3, 5: 0 },
    status: 'draft',
    logs: [
      { action: 'saved', actor: 'นางวิภา ทองดี', role: 'ผู้จัดทำ', date: '3 พ.ค. 2568', comment: 'บันทึกฉบับร่าง' },
    ]
  },
];

/* ═══ MONTHLY REPORTS ═══ */
const MONTHS_TH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

const INITIAL_REPORTS = [
  // กบร.-001 reports
  { id: 'RPT-กบร.-001-2568-04', kpiId: 'กบร.-001', month: 4, year: 2568, actual: 96.5, level: 4,
    detail: 'ระบบจำหน่ายไฟฟ้าทำงานได้ปกติตลอดเดือน มีการซ่อมบำรุงตามแผนครบถ้วน ส่งผลให้ความพร้อมใช้งานสูงถึง 96.5%',
    planIfLevel4: 'เร่งโครงการเปลี่ยนอุปกรณ์เก่าในสาย 3 เส้นหลัก เพื่อลดโอกาสเกิดเหตุขัดข้องในช่วงฤดูร้อน',
    problem: '', solution: '',
    status: 'approved',
    logs: [
      { action: 'submitted', actor: 'นายสมชาย ใจดี', role: 'ผู้จัดทำ', date: '5 พ.ค. 2568', comment: 'ส่งรายงานเดือน เม.ย.' },
      { action: 'approved', actor: 'นายสุรชัย วงศ์สุวรรณ', role: 'ผอ.กอง กบร.', date: '6 พ.ค. 2568', comment: 'ผลดี อนุมัติ' },
      { action: 'approved', actor: 'นางสาวพรทิพย์ มงคล', role: 'ผู้รวบรวมฯ', date: '7 พ.ค. 2568', comment: '' },
      { action: 'approved', actor: 'นายวิชัย สุวรรณภูมิ', role: 'ผอ.ฝ่าย', date: '8 พ.ค. 2568', comment: 'ผลงานดีเยี่ยม' },
    ]
  },
  { id: 'RPT-กบร.-001-2568-05', kpiId: 'กบร.-001', month: 5, year: 2568, actual: 97.2, level: 4,
    detail: '', planIfLevel4: '', problem: '', solution: '',
    status: 'draft', logs: []
  },
  { id: 'RPT-กบผ.-001-2568-04', kpiId: 'กบผ.-001', month: 4, year: 2568, actual: 97, level: 4,
    detail: 'ทีมงานตอบสนองต่อเหตุขัดข้องทั้งหมด 12 ครั้งในเดือนเมษายน ภายในเวลาเฉลี่ย 47 นาที',
    planIfLevel4: 'จัดทำแผนเสริมกำลังทีมฉุกเฉินในช่วงเวลา 00:00-06:00 น.', problem: '', solution: '',
    status: 'approved',
    logs: [
      { action: 'submitted', actor: 'นายกิตติ รักษาวงศ์', role: 'ผู้จัดทำ', date: '5 พ.ค. 2568', comment: '' },
      { action: 'approved', actor: 'นายธนากร อินทรชิต', role: 'ผอ.กอง กบผ.', date: '6 พ.ค. 2568', comment: '' },
      { action: 'approved', actor: 'นางสาวพรทิพย์ มงคล', role: 'ผู้รวบรวมฯ', date: '7 พ.ค. 2568', comment: '' },
      { action: 'approved', actor: 'นายวิชัย สุวรรณภูมิ', role: 'ผอ.ฝ่าย', date: '8 พ.ค. 2568', comment: '' },
    ]
  },
  { id: 'RPT-กบค.-001-2568-04', kpiId: 'กบค.-001', month: 4, year: 2568, actual: 93.8, level: 3,
    detail: 'เครื่องจักรกลหลักมีความพร้อมใช้งาน 93.8% มีการหยุดซ่อม 2 ครั้ง รวม 16 ชั่วโมง',
    planIfLevel4: '', problem: 'เครื่องสูบน้ำหลักหน่วยที่ 3 มีการรั่วซึมของซีลกันน้ำ ต้องหยุดซ่อม 8 ชั่วโมง',
    solution: 'สั่งซื้อชิ้นส่วนอะไหล่สำรองไว้ล่วงหน้า และจัดทำแผนตรวจสอบซีลทุก 3 เดือน',
    status: 'pending1',
    logs: [
      { action: 'submitted', actor: 'นางวิภา ทองดี', role: 'ผู้จัดทำ', date: '4 พ.ค. 2568', comment: 'ส่งรายงานเดือน เม.ย.' },
    ]
  },
];

/* ═══ HELPER: compute level from actual vs targets ═══ */
function computeLevel(actual, targets, unit) {
  if (actual === null || actual === undefined || actual === '') return 0;
  const v = parseFloat(actual);
  if (isNaN(v)) return 0;
  // Higher is better for most KPIs, except 'ครั้ง' where lower is better
  const lowerIsBetter = unit === 'ครั้ง';
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

/* ═══ PERMISSION HELPER ═══ */
function canEdit(role, kpiDivision) {
  if (!role) return false;
  const r = ROLES[role];
  if (!r) return false;
  if (r.id === 'assignee_gbp') return kpiDivision === 'กบผ.';
  if (r.id === 'assignee_gbr') return kpiDivision === 'กบร.';
  if (r.id === 'assignee_gbc') return kpiDivision === 'กบค.';
  return false;
}

function canApproveKPI(role, kpiStatus, kpiDivision) {
  if (!role) return false;
  const r = ROLES[role];
  if (!r) return false;
  if (r.id === 'divhead_gbp' && kpiStatus === 'pending1') return kpiDivision === 'กบผ.';
  if (r.id === 'divhead_gbr' && kpiStatus === 'pending1') return kpiDivision === 'กบร.';
  if (r.id === 'divhead_gbc' && kpiStatus === 'pending1') return kpiDivision === 'กบค.';
  if (r.id === 'consolidator' && kpiStatus === 'pending2') return true;
  if (r.id === 'director' && kpiStatus === 'pending3') return true;
  return false;
}

function nextStatus(current) {
  const flow = { pending1: 'pending2', pending2: 'pending3', pending3: 'approved' };
  return flow[current] || current;
}

function statusLabel(status) {
  return { draft: 'ฉบับร่าง', pending1: 'รอ ผอ.กอง', pending2: 'รอผู้รวบรวมฯ', pending3: 'รอ ผอ.ฝ่าย', approved: 'อนุมัติแล้ว', returned: 'ส่งกลับ' }[status] || status;
}

function canViewDiv(role, div) {
  if (!role) return false;
  const r = ROLES[role];
  if (!r) return false;
  if (r.id === 'director' || r.id === 'consolidator') return true;
  return r.div === div;
}

Object.assign(window, {
  ROLES, DEMO_USERS, INITIAL_KPIS, INITIAL_REPORTS,
  MONTHS_TH, MONTHS_SHORT,
  computeLevel, canEdit, canApproveKPI, nextStatus, statusLabel, canViewDiv
});
