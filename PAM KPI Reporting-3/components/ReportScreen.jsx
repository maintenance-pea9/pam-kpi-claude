// ReportScreen.jsx — Monthly Report list + detail for PAM KPI System

/* ═══ REPORT LIST ═══ */
function ReportScreen({ kpis, reports, setReports, role, user, onNavigate, setDetailReport }) {
  const [selMonth, setSelMonth] = React.useState(5);
  const [selYear, setSelYear]   = React.useState(2568);
  const [divFilter, setDivFilter] = React.useState('all');

  const visibleKPIs = kpis.filter(k => k.status === 'approved' && canViewDiv(role, k.div));
  const isAssignee  = role && role.startsWith('assignee');
  const roleInfo    = ROLES[role];

  const divFilters = [
    { key: 'all', label: 'ทุกกอง' },
    { key: 'กบผ.', label: 'กบผ.' },
    { key: 'กบร.', label: 'กบร.' },
    { key: 'กบค.', label: 'กบค.' },
  ].filter(d => d.key === 'all' || canViewDiv(role, d.key));

  // Get or create a report entry for a KPI + month
  function getReport(kpiId) {
    return reports.find(r => r.kpiId === kpiId && r.month === selMonth && r.year === selYear);
  }

  function createReport(kpi) {
    const id = `RPT-${kpi.id}-${selYear}-${String(selMonth).padStart(2,'0')}`;
    const rpt = { id, kpiId: kpi.id, month: selMonth, year: selYear, actual: '', level: 0, detail: '', planIfLevel4: '', problem: '', solution: '', status: 'draft', logs: [] };
    setReports(prev => [...prev, rpt]);
    setDetailReport({ report: rpt, kpi });
    onNavigate('report_detail');
  }

  function openReport(kpi) {
    const rpt = getReport(kpi.id);
    if (!rpt) { createReport(kpi); return; }
    setDetailReport({ report: rpt, kpi });
    onNavigate('report_detail');
  }

  const filteredKPIs = visibleKPIs.filter(k => divFilter === 'all' || k.div === divFilter);
  const years = [2566, 2567, 2568, 2569];

  const thStyle = { padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', background: '#FAFAFA', borderBottom: '1px solid #F1F5F9', textAlign: 'left', whiteSpace: 'nowrap' };

  // Summary stats
  const totalRpts  = filteredKPIs.length;
  const rptData    = filteredKPIs.map(k => getReport(k.id));
  const filled     = rptData.filter(Boolean).length;
  const appRpts    = rptData.filter(r => r?.status === 'approved').length;
  const pendRpts   = rptData.filter(r => r && ['pending1','pending2','pending3'].includes(r.status)).length;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: '#F8F7FC' }}>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Month selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #EDE9FE', borderRadius: 10, padding: '6px 12px' }}>
          <Icon name="calendar" size={14} color="#7C3AED" />
          <select style={{ fontSize: 13, color: '#1E293B', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Sarabun',sans-serif", fontWeight: 500, cursor: 'pointer' }} value={selMonth} onChange={e => setSelMonth(+e.target.value)}>
            {MONTHS_TH.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
          <select style={{ fontSize: 13, color: '#1E293B', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, cursor: 'pointer', color: '#6D28D9' }} value={selYear} onChange={e => setSelYear(+e.target.value)}>
            {years.map(y => <option key={y} value={y}>พ.ศ. {y}</option>)}
          </select>
        </div>

        {/* Div pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {divFilters.map(f => (
            <button key={f.key} onClick={() => setDivFilter(f.key)} style={{
              padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'IBM Plex Mono',monospace",
              background: divFilter === f.key ? '#6D28D9' : '#fff',
              color: divFilter === f.key ? '#fff' : '#64748B',
              border: divFilter === f.key ? '1px solid #6D28D9' : '1px solid #E2E8F0', transition: 'all 150ms',
            }}>{f.label}</button>
          ))}
        </div>

        <span style={{ fontSize: 13, color: '#94A3B8', marginLeft: 'auto' }}>
          บันทึกแล้ว {filled}/{totalRpts} · อนุมัติ {appRpts} · รออนุมัติ {pendRpts}
        </span>
      </div>

      {/* Mini summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'รายงานทั้งหมด', v: totalRpts, unit: 'รายการ', color: '#6D28D9' },
          { label: 'บันทึกแล้ว', v: filled, unit: `/ ${totalRpts}`, color: '#2563EB' },
          { label: 'อนุมัติแล้ว', v: appRpts, unit: 'รายการ', color: '#16A34A' },
        ].map(c => (
          <Card key={c.label} padding="14px 18px">
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, fontWeight: 500 }}>{c.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 24, fontWeight: 700, color: c.color }}>{c.v}</span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>{c.unit}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card padding="0">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
            รายงานผลการดำเนินงาน — {MONTHS_TH[selMonth-1]} {selYear}
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>รหัส KPI</th>
              <th style={{ ...thStyle, width: '30%' }}>ชื่อตัวชี้วัด</th>
              <th style={thStyle}>กอง</th>
              <th style={thStyle}>หน่วย</th>
              <th style={thStyle}>ผลจริง</th>
              <th style={thStyle}>ระดับ</th>
              <th style={thStyle}>สถานะรายงาน</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredKPIs.length === 0 && (
              <tr><td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>ไม่มีตัวชี้วัดที่อนุมัติแล้วในขอบเขตนี้</td></tr>
            )}
            {filteredKPIs.map((kpi, i) => {
              const rpt = getReport(kpi.id);
              const level = rpt ? computeLevel(rpt.actual, kpi.targets, kpi.unit) : 0;
              const hasData = rpt && rpt.actual !== '' && rpt.actual !== null;
              return (
                <tr key={kpi.id}
                  style={{ background: i % 2 === 0 ? '#fff' : '#FAF9FF', cursor: 'pointer', transition: 'background 100ms' }}
                  onClick={() => openReport(kpi)}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F3FF'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAF9FF'}>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", color: '#7C3AED', whiteSpace: 'nowrap' }}>{kpi.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{kpi.name}</td>
                  <td style={{ padding: '12px 16px' }}><DivBadge div={kpi.div} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', fontFamily: "'IBM Plex Mono',monospace" }}>{kpi.unit}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: hasData ? '#1E293B' : '#CBD5E1' }}>
                    {hasData ? rpt.actual : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {hasData ? <LevelBadge level={level} /> : <span style={{ fontSize: 11, color: '#CBD5E1' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {rpt ? <StatusBadge status={rpt.status} size="sm" /> : (
                      <span style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#E2E8F0' }}></div>
                        ยังไม่บันทึก
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => openReport(kpi)} style={{ background: '#F5F3FF', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11, color: '#7C3AED', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto' }}>
                      <Icon name={isAssignee && canViewDiv(role, kpi.div) ? 'edit' : 'eye'} size={12} />
                      {isAssignee && canViewDiv(role, kpi.div) ? 'บันทึกผล' : 'ดูรายละเอียด'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ═══ REPORT DETAIL ═══ */
function ReportDetailScreen({ reportData, kpis, reports, setReports, role, user, onNavigate }) {
  const { kpi, report: initialReport } = reportData;
  const roleInfo = ROLES[role];
  const isAssignee = role && role.startsWith('assignee') && canViewDiv(role, kpi.div);
  const editable = isAssignee && (initialReport.status === 'draft' || initialReport.status === 'returned');

  const [form, setForm] = React.useState({ ...initialReport });
  const [rejectModal, setRejectModal] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  const canApprove = canApproveKPI(role, form.status, kpi.div);
  const canSend = editable;

  const liveLevel = computeLevel(form.actual, kpi.targets, kpi.unit);

  function setField(k, v) { setForm(p => ({ ...p, [k]: v })); }

  function persist(updated) {
    setReports(prev => {
      const idx = prev.findIndex(r => r.id === updated.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = updated; return n; }
      return [...prev, updated];
    });
  }

  function handleSave() {
    const updated = { ...form, status: 'draft', logs: [...(form.logs||[]), { action: 'saved', actor: user.name, role: roleInfo.short, date: `${MONTHS_SHORT[form.month-1]} ${form.year}`, comment: '' }] };
    setForm(updated); persist(updated); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function handleSubmit() {
    const updated = { ...form, status: 'pending1', logs: [...(form.logs||[]), { action: 'submitted', actor: user.name, role: roleInfo.short, date: `${MONTHS_SHORT[form.month-1]} ${form.year}`, comment: `ส่งรายงานผล ${MONTHS_TH[form.month-1]} ${form.year}` }] };
    setForm(updated); persist(updated); onNavigate('report');
  }

  function handleApprove() {
    const next = nextStatus(form.status);
    const updated = { ...form, status: next, logs: [...(form.logs||[]), { action: 'approved', actor: user.name, role: roleInfo.short, date: `${MONTHS_SHORT[form.month-1]} ${form.year}`, comment: 'อนุมัติ' }] };
    setForm(updated); persist(updated); onNavigate('report');
  }

  function handleReject() {
    const updated = { ...form, status: 'returned', logs: [...(form.logs||[]), { action: 'returned', actor: user.name, role: roleInfo.short, date: `${MONTHS_SHORT[form.month-1]} ${form.year}`, comment: rejectReason }] };
    setForm(updated); persist(updated); setRejectModal(false); onNavigate('report');
  }

  const levelColors = ['#94A3B8','#EF4444','#F97316','#EAB308','#22C55E','#10B981'];
  const perfPct = kpi.targets[3] > 0 ? Math.min(100, Math.round((parseFloat(form.actual) / kpi.targets[5]) * 100)) : 0;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: '#F8F7FC' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => onNavigate('report')} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B', fontFamily: "'Sarabun',sans-serif" }}>
              <Icon name="chevron-left" size={14} /> กลับ
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DivBadge div={kpi.div} />
                <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", color: '#7C3AED' }}>{kpi.id}</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>·</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{MONTHS_TH[form.month-1]} {form.year}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1E293B', marginTop: 4 }}>{kpi.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge status={form.status} />
            {canApprove && (
              <>
                <Btn variant="danger" icon="x" size="sm" onClick={() => setRejectModal(true)}>ส่งกลับ</Btn>
                <Btn variant="success" icon="check" size="sm" onClick={handleApprove}>อนุมัติ</Btn>
              </>
            )}
            {editable && (
              <>
                {saved && <span style={{ fontSize: 12, color: '#16A34A' }}>✓ บันทึกแล้ว</span>}
                <Btn variant="secondary" icon="save" size="sm" onClick={handleSave}>บันทึก</Btn>
                {canSend && form.actual !== '' && <Btn variant="primary" icon="send" size="sm" onClick={handleSubmit}>ส่งขออนุมัติ</Btn>}
              </>
            )}
          </div>
        </div>

        {/* Returned notice */}
        {form.status === 'returned' && (() => {
          const last = [...(form.logs||[])].reverse().find(l => l.action === 'returned');
          return last ? (
            <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10 }}>
              <Icon name="alert" size={16} color="#E11D48" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#BE123C' }}>ส่งกลับเพื่อแก้ไข — {last.actor}</div>
                <div style={{ fontSize: 12, color: '#E11D48', marginTop: 3 }}>{last.comment}</div>
              </div>
            </div>
          ) : null;
        })()}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* KPI Definition card */}
            <Card padding="20px 24px">
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>ข้อมูลตัวชี้วัด</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 8, lineHeight: 1.4 }}>{kpi.name}</div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 12 }}>{kpi.definition}</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[['น้ำหนัก', `${kpi.weight}%`], ['หน่วยวัด', kpi.unit], ['หมวดหมู่', kpi.category], ['ผู้รับผิดชอบ', kpi.owner]].map(([l, v]) => (
                  <div key={l} style={{ background: '#F8F7FC', borderRadius: 8, padding: '6px 12px' }}>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance table */}
            <Card padding="20px 24px">
              <div style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 16 }}>ผลการดำเนินงาน</div>

              {/* Actual input */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <Field label="ผลการดำเนินงานจริง" required>
                    <div style={{ position: 'relative' }}>
                      <input type="number" style={{ ...inputStyle, fontSize: 20, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", paddingRight: 50, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.actual} onChange={e => setField('actual', e.target.value)} placeholder="0" />
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>{kpi.unit}</span>
                    </div>
                  </Field>
                </div>
                <div style={{ padding: '0 4px 10px', textAlign: 'center' }}>
                  {liveLevel > 0 ? <LevelBadge level={liveLevel} /> : <span style={{ fontSize: 12, color: '#CBD5E1' }}>—</span>}
                </div>
              </div>

              {/* Targets comparison table */}
              <div style={{ border: '1px solid #EDE9FE', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8F7FC' }}>
                      {['ระดับ','เป้าหมาย','ผลจริง','สถานะ'].map(h => (
                        <th key={h} style={{ padding: '8px 14px', fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: h === 'สถานะ' ? 'center' : 'left', borderBottom: '1px solid #EDE9FE' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[5,4,3,2,1].map(lvl => {
                      const isCurrentLevel = liveLevel === lvl;
                      const passed = liveLevel >= lvl;
                      return (
                        <tr key={lvl} style={{ background: isCurrentLevel ? '#F5F3FF' : 'transparent', borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px 14px', fontSize: 12, fontWeight: isCurrentLevel ? 700 : 500, color: levelColors[lvl] }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: levelColors[lvl] }}></div>
                              ระดับ {lvl}
                            </div>
                          </td>
                          <td style={{ padding: '8px 14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, color: '#334155' }}>
                            {kpi.targets[lvl]} {kpi.unit}
                          </td>
                          <td style={{ padding: '8px 14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: isCurrentLevel ? 700 : 400, color: isCurrentLevel ? levelColors[lvl] : '#94A3B8' }}>
                            {isCurrentLevel && form.actual !== '' ? `${form.actual} ${kpi.unit}` : '—'}
                          </td>
                          <td style={{ padding: '8px 14px', textAlign: 'center' }}>
                            {form.actual !== '' ? (
                              passed
                                ? <span style={{ fontSize: 11, background: '#F0FDF4', color: '#15803D', padding: '2px 8px', borderRadius: 9999, border: '1px solid #BBF7D0' }}>✓ ผ่าน</span>
                                : <span style={{ fontSize: 11, background: '#FFF1F2', color: '#BE123C', padding: '2px 8px', borderRadius: 9999, border: '1px solid #FECDD3' }}>✗ ไม่ผ่าน</span>
                            ) : <span style={{ fontSize: 11, color: '#CBD5E1' }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Text detail inputs */}
            <Card padding="20px 24px">
              <div style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 18 }}>รายละเอียดการดำเนินงาน</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Field label="1. รายละเอียดผลการดำเนินงาน ประจำเดือน">
                  <textarea style={{ ...textareaStyle, minHeight: 88, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.detail} onChange={e => setField('detail', e.target.value)} placeholder="สรุปผลการดำเนินงานในเดือนนี้..." />
                </Field>
                <Field label="2. แนวทางการดำเนินงาน (กรณีผลงานบรรลุระดับ 4)">
                  <textarea style={{ ...textareaStyle, minHeight: 72, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.planIfLevel4} onChange={e => setField('planIfLevel4', e.target.value)} placeholder="ระบุแนวทางในการยกระดับจาก 4 ไป 5..." />
                </Field>
                <Field label="3. ปัญหา อุปสรรค หรือสาเหตุที่ทำให้ผลงานต่ำกว่าเป้าหมาย">
                  <textarea style={{ ...textareaStyle, minHeight: 72, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.problem} onChange={e => setField('problem', e.target.value)} placeholder="ระบุปัญหาหรืออุปสรรคที่พบ..." />
                </Field>
                <Field label="4. แนวทางแก้ไขเพื่อให้ผลงานบรรลุเป้าหมายระดับ 5">
                  <textarea style={{ ...textareaStyle, minHeight: 72, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.solution} onChange={e => setField('solution', e.target.value)} placeholder="ระบุแนวทางการแก้ไขและพัฒนา..." />
                </Field>
              </div>
            </Card>
          </div>

          {/* Right: approval timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card padding="20px">
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>ขั้นตอนการอนุมัติ</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, left: '16.5%', right: '16.5%', height: 2, background: '#E2E8F0', zIndex: 0 }}></div>
                {[
                  { label: 'ผู้จัดทำ', sub: 'Assignee', statuses: ['draft','pending1','pending2','pending3','approved','returned'] },
                  { label: 'ผอ.กอง', sub: 'Lv.1', statuses: ['pending2','pending3','approved'] },
                  { label: 'ผู้รวบรวมฯ', sub: 'Lv.2', statuses: ['pending3','approved'] },
                  { label: 'ผอ.ฝ่าย', sub: 'Lv.3', statuses: ['approved'] },
                ].map((step, i) => {
                  const done = step.statuses.includes(form.status);
                  const active = (i===1 && form.status==='pending1') || (i===2 && form.status==='pending2') || (i===3 && form.status==='pending3');
                  const ret = form.status === 'returned' && i === 0;
                  const color = ret ? '#E11D48' : done ? '#16A34A' : active ? '#D97706' : '#CBD5E1';
                  const bg = ret ? '#FFF1F2' : done ? '#F0FDF4' : active ? '#FFFBEB' : '#F8F7FC';
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                        {done && !active ? <Icon name="check" size={13} color={color} /> : active ? <Icon name="clock" size={13} color={color} /> : ret ? <Icon name="x" size={13} color={color} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }}></div>}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: done||active ? '#334155' : '#94A3B8', textAlign: 'center' }}>{step.label}</div>
                      <div style={{ fontSize: 9, color: '#94A3B8', textAlign: 'center' }}>{step.sub}</div>
                    </div>
                  );
                })}
              </div>
              {form.logs?.length > 0 ? (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>ประวัติการดำเนินการ</div>
                  <ApprovalTimeline logs={form.logs} />
                </div>
              ) : <div style={{ textAlign: 'center', padding: '16px 0', color: '#CBD5E1', fontSize: 12 }}>ยังไม่มีประวัติ</div>}
            </Card>
          </div>
        </div>
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', width: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1E293B', marginBottom: 6 }}>ส่งกลับเพื่อแก้ไข</div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>กรุณาระบุเหตุผลให้ชัดเจน</div>
            <Field label="เหตุผล" required>
              <textarea style={{ ...textareaStyle, minHeight: 100 }} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="กรอกเหตุผล..." />
            </Field>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <Btn variant="outline" onClick={() => setRejectModal(false)}>ยกเลิก</Btn>
              <Btn variant="danger" icon="x" disabled={!rejectReason.trim()} onClick={handleReject}>ยืนยัน</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ReportScreen, ReportDetailScreen });
