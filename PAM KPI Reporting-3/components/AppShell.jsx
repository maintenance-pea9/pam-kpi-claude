// AppShell.jsx — Sidebar, Header, and App layout for PAM KPI System

/* ═══ NAV ITEMS (role-filtered at render time) ═══ */
const ALL_NAV = [
  { id: 'dashboard', icon: 'dashboard', label: 'ภาพรวม KPI',       badge: null },
  { id: 'kpi',       icon: 'kpi',       label: 'รายการตัวชี้วัด',   badge: null },
  { id: 'report',    icon: 'report',    label: 'รายงานผลรายเดือน',  badge: null },
  { id: 'approval',  icon: 'approval',  label: 'คิวอนุมัติ',        badge: 'approval' },
];

const PAGE_META = {
  dashboard: { title: 'ภาพรวม KPI',         crumbs: ['ภาพรวม KPI'] },
  kpi:       { title: 'รายการตัวชี้วัด',     crumbs: ['รายการตัวชี้วัด (KPI Master Data)'] },
  kpi_form:  { title: 'หัวข้อตัวชี้วัด',     crumbs: ['รายการตัวชี้วัด', 'รายละเอียด KPI'] },
  report:    { title: 'รายงานผลรายเดือน',    crumbs: ['รายงานผลรายเดือน'] },
  report_detail: { title: 'รายงานผล',        crumbs: ['รายงานผลรายเดือน', 'รายละเอียด'] },
  approval:  { title: 'คิวอนุมัติ',          crumbs: ['คิวอนุมัติ'] },
};

/* ═══ SIDEBAR ═══ */
function Sidebar({ screen, onNavigate, user, role, pendingCount, collapsed, onToggle }) {
  const [hovered, setHovered] = React.useState(null);
  const roleInfo = ROLES[role];
  const w = collapsed ? 68 : 240;

  return (
    <div style={{
      width: w, minHeight: '100vh', background: '#3B0764',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      transition: 'width 250ms ease', overflow: 'hidden',
      position: 'relative', zIndex: 10,
    }}>
      {/* Logo row */}
      <div style={{ padding: collapsed ? '18px 16px 14px' : '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(201,168,76,0.4)', boxShadow: '0 0 0 3px rgba(109,40,217,0.2)' }}>
          <img src="assets/LOGO_PEA-2.jpg" alt="PEA" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#EDE9FE', lineHeight: 1.2, whiteSpace: 'nowrap' }}>PEA · PAM</div>
            <div style={{ fontSize: 10, color: '#A78BFA', marginTop: 1, whiteSpace: 'nowrap' }}>ระบบบริหารจัดการ KPI</div>
          </div>
        )}
      </div>

      {/* Section label */}
      {!collapsed && (
        <div style={{ padding: '14px 20px 6px' }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#6D28D9', letterSpacing: '0.12em', textTransform: 'uppercase' }}>เมนูหลัก</span>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: collapsed ? '8px 10px' : '4px 10px' }}>
        {ALL_NAV.map(item => {
          const active = screen === item.id || (item.id === 'kpi' && screen === 'kpi_form') || (item.id === 'report' && screen === 'report_detail');
          const badgeCount = item.badge === 'approval' ? pendingCount : 0;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              title={collapsed ? item.label : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '10px 0' : '9px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2,
                textAlign: 'left', fontFamily: "'Sarabun', sans-serif", fontSize: 13,
                fontWeight: active ? 600 : 400,
                background: active ? 'rgba(139,92,246,0.25)' : hovered === item.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: active ? '#EDE9FE' : '#A78BFA',
                transition: 'background 150ms ease, color 150ms ease',
                position: 'relative',
              }}>
              <span style={{ color: active ? '#C4B5FD' : '#7C3AED', flexShrink: 0, display: 'flex' }}>
                <Icon name={item.icon} size={18} />
              </span>
              {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>}
              {badgeCount > 0 && !collapsed && (
                <span style={{ background: '#D97706', color: '#fff', borderRadius: 9999, fontSize: 10, fontWeight: 700, padding: '1px 6px', flexShrink: 0 }}>{badgeCount}</span>
              )}
              {badgeCount > 0 && collapsed && (
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#D97706', borderRadius: '50%' }}></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button onClick={onToggle} style={{
        margin: '0 10px', padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
        background: 'rgba(255,255,255,0.04)', color: '#7C3AED', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 6, fontSize: 11, fontFamily: "'Sarabun',sans-serif",
        transition: 'background 150ms',
      }}>
        <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={14} />
        {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>ย่อเมนู</span>}
      </button>

      {/* User info */}
      <div style={{ padding: collapsed ? '12px 0 16px' : '12px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8 }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6D28D9,#C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {user?.initial || '?'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#EDE9FE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || ''}</div>
              <div style={{ fontSize: 10, color: '#A78BFA', marginTop: 1 }}>
                {roleInfo?.short || ''}
                {roleInfo?.div && <span style={{ color: '#C9A84C', fontFamily: "'IBM Plex Mono',monospace", marginLeft: 4 }}>· {roleInfo.div}</span>}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6D28D9,#C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {user?.initial || '?'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ HEADER ═══ */
function Header({ screen, user, role, onLogout, onNavigate }) {
  const meta = PAGE_META[screen] || PAGE_META.dashboard;
  const roleInfo = ROLES[role];
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <div style={{
      height: 60, background: '#fff',
      borderBottom: '1px solid #EDE9FE',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', flexShrink: 0, position: 'relative', zIndex: 5,
    }}>
      {/* Breadcrumb + title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 1 }}>
          <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: "'IBM Plex Mono',monospace" }}>PAM</span>
          {meta.crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <span style={{ fontSize: 11, color: '#CBD5E1' }}>/</span>
              <span style={{ fontSize: 11, color: i === meta.crumbs.length - 1 ? '#7C3AED' : '#94A3B8', fontWeight: i === meta.crumbs.length - 1 ? 500 : 400 }}>{c}</span>
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{meta.title}</div>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Month chip */}
        <div style={{ background: '#F5F3FF', border: '1px solid #EDE9FE', borderRadius: 8, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <Icon name="calendar" size={13} color="#7C3AED" />
          <span style={{ fontSize: 12, fontWeight: 500, color: '#6D28D9', fontFamily: "'IBM Plex Mono',monospace" }}>พ.ค. 2568</span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#E2E8F0' }}></div>

        {/* User avatar + menu */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowUserMenu(v => !v)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px 5px 6px',
            borderRadius: 10, border: '1px solid #EDE9FE', background: '#FAFAFA', cursor: 'pointer',
            transition: 'background 150ms',
          }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6D28D9,#C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {user?.initial || '?'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>{roleInfo?.short}{roleInfo?.div ? ` · ${roleInfo.div}` : ''}</div>
            </div>
            <Icon name="chevron-down" size={12} color="#94A3B8" />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 200,
              background: '#fff', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              border: '1px solid #EDE9FE', padding: '6px', zIndex: 100,
            }}>
              <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{roleInfo?.label}</div>
              </div>
              <button onClick={() => { setShowUserMenu(false); onLogout(); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 13, color: '#DC2626', fontFamily: "'Sarabun',sans-serif",
              }}>
                <Icon name="logout" size={14} color="#DC2626" />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close user menu */}
      {showUserMenu && <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 4 }}></div>}
    </div>
  );
}

Object.assign(window, { Sidebar, Header });
