// DashboardScreen.jsx — Overview dashboard for PAM KPI System

function DashboardScreen({ kpis, reports, role, onNavigate }) {
  const roleInfo = ROLES[role];

  // Filter visible KPIs
  const visibleKPIs = kpis.filter(k => canViewDiv(role, k.div));

  // Stats
  const total = visibleKPIs.length;
  const approved = visibleKPIs.filter(k => k.status === 'approved').length;
  const pending = visibleKPIs.filter(k => ['pending1','pending2','pending3'].includes(k.status)).length;
  const returned = visibleKPIs.filter(k => k.status === 'returned').length;
  const draft = visibleKPIs.filter(k => k.status === 'draft').length;

  // Monthly performance (mock chart data)
  const monthlyData = [
    { m: 'ต.ค.', v: 72 }, { m: 'พ.ย.', v: 78 }, { m: 'ธ.ค.', v: 81 },
    { m: 'ม.ค.', v: 76 }, { m: 'ก.พ.', v: 84 }, { m: 'มี.ค.', v: 79 },
    { m: 'เม.ย.', v: 88 }, { m: 'พ.ค.', v: 87 },
  ];
  const maxV = Math.max(...monthlyData.map(d => d.v));

  // Division summary
  const divSummary = [
    { div: 'กบผ.', name: 'กองจัดการงานบำรุงรักษาระบบผลิต', total: 2, approved: 2, avg: 94 },
    { div: 'กบร.', name: 'กองบริหารจัดการระบบไฟฟ้า',        total: 3, approved: 1, avg: 73 },
    { div: 'กบค.', name: 'กองบริหารจัดการงานเครื่องกล',      total: 2, approved: 0, avg: 85 },
  ].filter(d => canViewDiv(role, d.div));

  // Donut chart
  const donutR = 42, donutCirc = 2 * Math.PI * donutR;
  const slices = [
    { label: 'อนุมัติแล้ว', count: approved, color: '#16A34A' },
    { label: 'รออนุมัติ',   count: pending,  color: '#D97706' },
    { label: 'ส่งกลับ',     count: returned, color: '#DC2626' },
    { label: 'ฉบับร่าง',   count: draft,    color: '#8B5CF6' },
  ].filter(s => s.count > 0);
  let donutOffset = donutCirc * 0.25;
  const pctApproved = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: '#F8F7FC' }}>

      {/* Welcome strip */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1E293B' }}>
            สวัสดี, <span style={{ color: '#6D28D9' }}>{roleInfo?.short || ''}</span>
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 3 }}>
            ภาพรวม KPI ฝ่ายบริหารจัดการสินทรัพย์ระบบไฟฟ้า (ฝบร.) · พฤษภาคม 2568
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" icon="kpi" size="sm" onClick={() => onNavigate('kpi')}>รายการตัวชี้วัด</Btn>
          <Btn variant="primary" icon="report" size="sm" onClick={() => onNavigate('report')}>รายงานผล</Btn>
        </div>
      </div>

      {/* Stat cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'KPI ทั้งหมด', value: total, unit: 'รายการ', sub: `ฉบับร่าง ${draft} รายการ`, color: '#6D28D9', bg: '#F5F3FF' },
          { label: 'อนุมัติแล้ว', value: approved, unit: 'รายการ', sub: `${pctApproved}% ของทั้งหมด`, color: '#16A34A', bg: '#F0FDF4' },
          { label: 'รออนุมัติ', value: pending, unit: 'รายการ', sub: 'ต้องการการดำเนินการ', color: '#D97706', bg: '#FFFBEB' },
          { label: 'ส่งกลับแก้ไข', value: returned, unit: 'รายการ', sub: 'รอการแก้ไข', color: '#DC2626', bg: '#FFF1F2' },
        ].map(card => (
          <Card key={card.label} style={{ border: `1px solid ${card.bg === '#F5F3FF' ? '#EDE9FE' : card.bg}` }} padding="16px 20px">
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>{card.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 8 }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 32, fontWeight: 700, color: card.color, lineHeight: 1 }}>{card.value}</span>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>{card.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{card.sub}</div>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 20 }}>

        {/* Bar chart */}
        <Card padding="20px 24px">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>แนวโน้มผลการดำเนินงาน KPI</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>ต.ค. 2567 – พ.ค. 2568 · เฉลี่ยทุกกอง</div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#6D28D9', fontFamily: "'IBM Plex Mono',monospace" }}>87%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {monthlyData.map((d, i) => {
              const isLast = i === monthlyData.length - 1;
              const color = d.v >= 80 ? (isLast ? '#6D28D9' : '#A78BFA') : d.v >= 60 ? '#F59E0B' : '#EF4444';
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, color: isLast ? '#6D28D9' : '#94A3B8' }}>{d.v}%</span>
                  <div style={{ width: '100%', height: `${(d.v / maxV) * 100}%`, background: color, borderRadius: '4px 4px 0 0', transition: 'height 400ms ease' }}></div>
                  <span style={{ fontSize: 10, color: isLast ? '#6D28D9' : '#94A3B8', fontWeight: isLast ? 600 : 400 }}>{d.m}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Donut chart */}
        <Card padding="20px 24px">
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>สัดส่วนสถานะ KPI</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>พฤษภาคม 2568 · รวมทุกกอง</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={donutR} fill="none" stroke="#F3F0FF" strokeWidth="16"/>
              {slices.map((s, i) => {
                const pct = total > 0 ? s.count / total : 0;
                const dash = pct * donutCirc;
                const gap = donutCirc - dash;
                const el = (
                  <circle key={i} cx="50" cy="50" r={donutR} fill="none" stroke={s.color} strokeWidth="16"
                    strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-donutOffset + donutCirc * 0.25} />
                );
                donutOffset += dash;
                return el;
              })}
              <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1A1A2E" fontFamily="IBM Plex Mono">{pctApproved}%</text>
              <text x="50" y="59" textAnchor="middle" fontSize="8" fill="#94A3B8" fontFamily="Sarabun">อนุมัติ</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {slices.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }}></div>
                  <span style={{ fontSize: 12, color: '#475569' }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", color: '#94A3B8', marginLeft: 'auto', paddingLeft: 8 }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Division summary table */}
      <Card padding="0">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>สรุปผลการดำเนินงานรายกอง</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>ฝ่ายบริหารจัดการสินทรัพย์ระบบไฟฟ้า (ฝบร.) · พฤษภาคม 2568</div>
          </div>
          <Btn variant="ghost" size="sm" icon="chevron-right" onClick={() => onNavigate('report')}>ดูรายงาน</Btn>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['กอง','ชื่อกอง','KPI ทั้งหมด','อนุมัติแล้ว','ค่าเฉลี่ย (%)','ความคืบหน้า'].map(h => (
                <th key={h} style={{ padding: '10px 20px', fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #F1F5F9' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {divSummary.map((row, i) => (
              <tr key={row.div} style={{ background: i % 2 === 0 ? '#fff' : '#FAF9FF' }}>
                <td style={{ padding: '14px 20px' }}><DivBadge div={row.div} /></td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#334155', fontWeight: 500 }}>{row.name}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontFamily: "'IBM Plex Mono',monospace", color: '#64748B' }}>{row.total}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontFamily: "'IBM Plex Mono',monospace", color: '#16A34A' }}>{row.approved}/{row.total}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 15, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: row.avg >= 80 ? '#16A34A' : row.avg >= 60 ? '#D97706' : '#DC2626' }}>{row.avg}%</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <ProgressBar value={row.avg} max={100} height={8} showLabel={false} />
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr style={{ background: '#F5F3FF', borderTop: '2px solid #EDE9FE' }}>
              <td style={{ padding: '14px 20px' }}><DivBadge div="ฝบร." /></td>
              <td style={{ padding: '14px 20px', fontSize: 13, color: '#4C1D95', fontWeight: 600 }}>รวมทั้งฝ่าย</td>
              <td style={{ padding: '14px 20px', fontSize: 13, fontFamily: "'IBM Plex Mono',monospace", color: '#6D28D9', fontWeight: 700 }}>{total}</td>
              <td style={{ padding: '14px 20px', fontSize: 13, fontFamily: "'IBM Plex Mono',monospace", color: '#16A34A', fontWeight: 700 }}>{approved}/{total}</td>
              <td style={{ padding: '14px 20px' }}>
                <span style={{ fontSize: 15, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: '#6D28D9' }}>84%</span>
              </td>
              <td style={{ padding: '14px 20px' }}><ProgressBar value={84} max={100} height={8} /></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

Object.assign(window, { DashboardScreen });
