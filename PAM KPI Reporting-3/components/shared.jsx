// shared.jsx — Shared icons, badges, and UI atoms for PAM KPI System

/* ═══ ICONS ═══ */
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 2 }) {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', display: 'block', flexShrink: 0 };
  const icons = {
    'dashboard': <svg {...s} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
    'kpi': <svg {...s} viewBox="0 0 24 24"><path d="M10 6h11M10 12h11M10 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>,
    'plus': <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    'approval': <svg {...s} viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    'report': <svg {...s} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    'settings': <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    'bell': <svg {...s} viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    'search': <svg {...s} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    'chevron-right': <svg {...s} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
    'chevron-left': <svg {...s} viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
    'chevron-down': <svg {...s} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
    'check': <svg {...s} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    'x': <svg {...s} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    'clock': <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    'edit': <svg {...s} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    'eye': <svg {...s} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    'send': <svg {...s} viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    'save': <svg {...s} viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    'logout': <svg {...s} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    'alert': <svg {...s} viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    'calendar': <svg {...s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    'menu': <svg {...s} viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    'filter': <svg {...s} viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    'info': <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    'trending-up': <svg {...s} viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    'trending-down': <svg {...s} viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
    'user': <svg {...s} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    'users': <svg {...s} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    'layers': <svg {...s} viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    'target': <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    'undo': <svg {...s} viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>,
    'file-text': <svg {...s} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    'history': <svg {...s} viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/><polyline points="12 7 12 12 15 13"/></svg>,
    'pin': <svg {...s} viewBox="0 0 24 24"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17z"/></svg>,
    'grid': <svg {...s} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    'lock': <svg {...s} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  };
  return icons[name] || null;
}

/* ═══ STATUS BADGE ═══ */
const STATUS_CONFIG = {
  draft:     { label: 'ฉบับร่าง',               bg: '#F5F3FF', color: '#6D28D9', dot: '#8B5CF6', border: '#DDD6FE' },
  pending1:  { label: 'รอ ผอ.กอง อนุมัติ',      bg: '#FEF3C7', color: '#92400E', dot: '#D97706', border: '#FDE68A' },
  pending2:  { label: 'รอผู้รวบรวมฯ ตรวจสอบ',   bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B', border: '#FDE68A' },
  pending3:  { label: 'รอ ผอ.ฝ่าย อนุมัติ',     bg: '#FFF7ED', color: '#9A3412', dot: '#EA580C', border: '#FDBA74' },
  approved:  { label: 'อนุมัติแล้ว',             bg: '#F0FDF4', color: '#15803D', dot: '#16A34A', border: '#BBF7D0' },
  returned:  { label: 'ส่งกลับแก้ไข',           bg: '#FFF1F2', color: '#BE123C', dot: '#E11D48', border: '#FECDD3' },
};

function StatusBadge({ status, size = 'md' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const fs = size === 'sm' ? '11px' : '12px';
  const py = size === 'sm' ? '2px' : '4px';
  const px = size === 'sm' ? '8px' : '10px';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: `${py} ${px}`, borderRadius: 9999,
      fontSize: fs, fontWeight: 500, lineHeight: 1.4,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
      fontFamily: "'Sarabun', sans-serif", whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }}></span>
      {cfg.label}
    </span>
  );
}

/* ═══ DIVISION BADGE ═══ */
const DIV_CONFIG = {
  'กบผ.': { bg: '#FDF8EC', color: '#92660A', border: '#E0CC94' },
  'กบร.': { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  'กบค.': { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  'ฝบร.': { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
};

function DivBadge({ div }) {
  const cfg = DIV_CONFIG[div] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 9999,
      fontSize: 11, fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'nowrap',
    }}>{div}</span>
  );
}

/* ═══ PROGRESS BAR ═══ */
function ProgressBar({ value, max = 100, height = 6, showLabel = false }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const color = pct >= 100 ? '#16A34A' : pct >= 80 ? '#6D28D9' : pct >= 60 ? '#D97706' : '#DC2626';
  const grad = pct >= 100
    ? 'linear-gradient(90deg,#16A34A,#22C55E)'
    : pct >= 80 ? 'linear-gradient(90deg,#6D28D9,#8B5CF6)'
    : pct >= 60 ? 'linear-gradient(90deg,#D97706,#F59E0B)'
    : 'linear-gradient(90deg,#DC2626,#EF4444)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height, background: '#EDE9FE', borderRadius: 9999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: grad, borderRadius: 9999, transition: 'width 400ms ease' }}></div>
      </div>
      {showLabel && (
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color, minWidth: 36, textAlign: 'right' }}>{pct}%</span>
      )}
    </div>
  );
}

/* ═══ CARD ═══ */
function Card({ children, style = {}, padding = '20px 24px' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding,
      boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(107,33,168,0.05)',
      border: '1px solid #EDE9FE', ...style
    }}>
      {children}
    </div>
  );
}

/* ═══ BUTTON ═══ */
function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, icon, type = 'button' }) {
  const base = { display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Sarabun',sans-serif", fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', border: 'none', borderRadius: 8, transition: 'all 150ms ease', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap' };
  const sizes = { sm: { padding: '6px 12px', fontSize: 12 }, md: { padding: '9px 18px', fontSize: 13 }, lg: { padding: '11px 24px', fontSize: 14 } };
  const variants = {
    primary:   { background: '#6D28D9', color: '#fff' },
    secondary: { background: '#EDE9FE', color: '#6D28D9' },
    danger:    { background: '#FEE2E2', color: '#DC2626' },
    ghost:     { background: 'transparent', color: '#64748B' },
    outline:   { background: '#fff', color: '#475569', border: '1px solid #CBD5E1' },
    success:   { background: '#DCFCE7', color: '#15803D' },
    gold:      { background: 'linear-gradient(135deg,#C9A84C,#D4B96A)', color: '#fff' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 13 : 14} />}
      {children}
    </button>
  );
}

/* ═══ FORM FIELD ═══ */
function Field({ label, required, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>
        {label}
        {required && <span style={{ color: '#DC2626', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{hint}</span>}
    </div>
  );
}

const inputStyle = {
  fontSize: 13, color: '#1E293B', background: '#fff',
  border: '1px solid #CBD5E1', borderRadius: 8, padding: '9px 12px',
  outline: 'none', width: '100%', fontFamily: "'Sarabun',sans-serif",
  transition: 'border-color 150ms',
};
const selectStyle = { ...inputStyle, cursor: 'pointer' };
const textareaStyle = { ...inputStyle, resize: 'vertical', lineHeight: 1.6 };

/* ═══ APPROVAL TIMELINE ═══ */
function ApprovalTimeline({ logs = [] }) {
  if (!logs.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {logs.map((log, i) => {
        const isLast = i === logs.length - 1;
        const color = log.action === 'approved' ? '#16A34A' : log.action === 'returned' ? '#DC2626' : log.action === 'submitted' ? '#6D28D9' : '#D97706';
        const bg = log.action === 'approved' ? '#F0FDF4' : log.action === 'returned' ? '#FFF1F2' : log.action === 'submitted' ? '#F5F3FF' : '#FFFBEB';
        const icons = { approved: 'check', returned: 'x', submitted: 'send', saved: 'save', pending: 'clock' };
        return (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={icons[log.action] || 'clock'} size={13} color={color} />
              </div>
              {!isLast && <div style={{ width: 2, flex: 1, background: '#E2E8F0', margin: '4px 0', minHeight: 16 }}></div>}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : 16, paddingTop: 4, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{log.actor}</span>
                  <span style={{ fontSize: 12, color: '#64748B', marginLeft: 6 }}>{log.role}</span>
                </div>
                <span style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' }}>{log.date}</span>
              </div>
              {log.comment && (
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4, background: '#F8F7FC', borderRadius: '0 8px 8px 8px', padding: '6px 10px', lineHeight: 1.5 }}>{log.comment}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ SCORE LEVEL BADGE ═══ */
function LevelBadge({ level }) {
  const cfg = {
    5: { bg: '#F0FDF4', color: '#15803D', label: 'ระดับ 5 — ดีเยี่ยม' },
    4: { bg: '#DCFCE7', color: '#16A34A', label: 'ระดับ 4 — ดีมาก' },
    3: { bg: '#FEF9C3', color: '#854D0E', label: 'ระดับ 3 — ผ่านเกณฑ์' },
    2: { bg: '#FFEDD5', color: '#9A3412', label: 'ระดับ 2 — ต่ำกว่าเกณฑ์' },
    1: { bg: '#FEE2E2', color: '#991B1B', label: 'ระดับ 1 — ต้องปรับปรุง' },
    0: { bg: '#F1F5F9', color: '#64748B', label: 'ยังไม่มีข้อมูล' },
  };
  const c = cfg[level] || cfg[0];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

Object.assign(window, {
  Icon, StatusBadge, DivBadge, ProgressBar, Card, Btn, Field,
  inputStyle, selectStyle, textareaStyle,
  ApprovalTimeline, LevelBadge, STATUS_CONFIG, DIV_CONFIG
});
