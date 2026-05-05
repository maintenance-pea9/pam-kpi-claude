// ApprovalScreen.jsx — Approval queue for PAM KPI System

function ApprovalScreen({ kpis, setKpis, reports, setReports, role, user, onNavigate, setDetailKPI, setDetailReport }) {
  const roleInfo = ROLES[role];
  const [selected, setSelected] = React.useState(null); // { type: 'kpi'|'report', id }
  const [tab, setTab] = React.useState('pending'); // 'pending' | 'done'
  const [rejectModal, setRejectModal] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');

  // Build queue items
  const kpiItems = kpis.filter(k => {
    if (!canViewDiv(role, k.div)) return false;
    if (tab === 'pending') return canApproveKPI(role, k.status, k.div);
    else return k.status === 'approved' || k.status === 'returned';
  }).map(k => ({ type: 'kpi', id: k.id, item: k }));

  const reportItems = reports.filter(r => {
    const kpi = kpis.find(k => k.id === r.kpiId);
    if (!kpi || !canViewDiv(role, kpi.div)) return false;
    if (tab === 'pending') return canApproveKPI(role, r.status, kpi.div);
    else return r.status === 'approved' || r.status === 'returned';
  }).map(r => {
    const kpi = kpis.find(k => k.id === r.kpiId);
    return { type: 'report', id: r.id, item: r, kpi };
  });

  const queue = [...kpiItems, ...reportItems];

  const selItem = selected ? queue.find(q => q.id === selected.id && q.type === selected.type) : null;

  function handleApprove() {
    if (!selItem) return;
    const date = 'พ.ค. 2568';
    if (selItem.type === 'kpi') {
      const next = nextStatus(selItem.item.status);
      setKpis(prev => prev.map(k => k.id === selItem.id ? { ...k, status: next, logs: [...(k.logs||[]), { action: 'approved', actor: user.name, role: roleInfo.short, date, comment: 'อนุมัติ' }] } : k));
    } else {
      const next = nextStatus(selItem.item.status);
      setReports(prev => prev.map(r => r.id === selItem.id ? { ...r, status: next, logs: [...(r.logs||[]), { action: 'approved', actor: user.name, role: roleInfo.short, date, comment: 'อนุมัติ' }] } : r));
    }
    setSelected(null);
  }

  function handleReject() {
    const date = 'พ.ค. 2568';
    if (selItem.type === 'kpi') {
      setKpis(prev => prev.map(k => k.id === selItem.id ? { ...k, status: 'returned', logs: [...(k.logs||[]), { action: 'returned', actor: user.name, role: roleInfo.short, date, comment: rejectReason }] } : k));
    } else {
      setReports(prev => prev.map(r => r.id === selItem.id ? { ...r, status: 'returned', logs: [...(r.logs||[]), { action: 'returned', actor: user.name, role: roleInfo.short, date, comment: rejectReason }] } : r));
    }
    setRejectModal(false); setRejectReason(''); setSelected(null);
  }

  function canApproveSelected() {
    if (!selItem) return false;
    if (selItem.type === 'kpi') return canApproveKPI(role, selItem.item.status, selItem.item.div);
    return canApproveKPI(role, selItem.item.status, selItem.kpi?.div);
  }

  // Detail panel content
  function renderDetail() {
    if (!selItem) return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: '#94A3B8' }}>
        <Icon name="approval" size={40} color="#E2E8F0" />
        <span style={{ fontSize: 13 }}>เลือกรายการเพื่อดูรายละเอียด</span>
      </div>
    );

    const isKpi = selItem.type === 'kpi';
    const item = selItem.item;
    const kpi = isKpi ? item : selItem.kpi;
    const logs = item.logs || [];
    const canApprove = canApproveSelected();

    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, background: isKpi ? '#F5F3FF' : '#EFF6FF', color: isKpi ? '#6D28D9' : '#1D4ED8', padding: '2px 8px', borderRadius: 9999, fontWeight: 600 }}>
                {isKpi ? 'KPI Master' : 'รายงานผล'}
              </span>
              <DivBadge div={kpi?.div || ''} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>{kpi?.name}</div>
            {!isKpi && (
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                {MONTHS_TH[item.month - 1]} {item.year}
              </div>
            )}
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Info grid */}
        {isKpi ? (
          <Card padding="16px 20px" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, marginBottom: 12 }}>{kpi.definition}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[['หน่วยวัด', kpi.unit], ['น้ำหนัก', `${kpi.weight}%`], ['หมวดหมู่', kpi.category], ['ผู้รับผิดชอบ', kpi.owner]].map(([l, v]) => (
                <div key={l} style={{ background: '#F8F7FC', borderRadius: 6, padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>เป้าหมาย</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[5,4,3,2,1].map(lvl => (
                  <div key={lvl} style={{ flex: 1, background: '#F5F3FF', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 2 }}>ระดับ {lvl}</div>
                    <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: '#6D28D9' }}>{kpi.targets[lvl]}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <Card padding="16px 20px" style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: '#F5F3FF', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4 }}>ผลการดำเนินงานจริง</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 22, fontWeight: 700, color: '#6D28D9' }}>{item.actual || '—'} <span style={{ fontSize: 12, fontWeight: 400 }}>{kpi?.unit}</span></div>
              </div>
              <div style={{ background: '#F0FDF4', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4 }}>ระดับผลงาน</div>
                <LevelBadge level={computeLevel(item.actual, kpi?.targets || {}, kpi?.unit || '')} />
              </div>
            </div>
            {item.detail && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>ผลการดำเนินงาน</div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{item.detail}</div>
              </div>
            )}
            {item.problem && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>ปัญหา / อุปสรรค</div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{item.problem}</div>
              </div>
            )}
          </Card>
        )}

        {/* Timeline */}
        <Card padding="16px 20px" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 12 }}>ประวัติการดำเนินการ</div>
          {logs.length > 0 ? <ApprovalTimeline logs={logs} /> : <div style={{ fontSize: 12, color: '#CBD5E1', textAlign: 'center', padding: '8px 0' }}>ยังไม่มีประวัติ</div>}
        </Card>

        {/* Action buttons */}
        {canApprove && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="danger" icon="x" onClick={() => setRejectModal(true)} style={{ flex: 1 }}>ส่งกลับแก้ไข</Btn>
            <Btn variant="primary" icon="check" onClick={handleApprove} style={{ flex: 1 }}>อนุมัติ</Btn>
          </div>
        )}

        {/* Go to detail */}
        <button onClick={() => {
          if (isKpi) { setDetailKPI(kpi); onNavigate('kpi_form'); }
          else { setDetailReport({ kpi, report: item }); onNavigate('report_detail'); }
        }} style={{ marginTop: 10, width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #EDE9FE', background: '#F8F7FC', cursor: 'pointer', fontSize: 12, color: '#6D28D9', fontFamily: "'Sarabun',sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5" }}>
          ดูรายละเอียดเต็ม <Icon name="chevron-right" size={12} color="#6D28D9" />
        </button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#F8F7FC' }}>
      {/* Left panel — queue */}
      <div style={{ width: 340, borderRight: '1px solid #EDE9FE', background: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Tabs */}
        <div style={{ padding: '16px 16px 0', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>คิวอนุมัติ</div>
          <div style={{ display: 'flex', gap: 0 }}>
            {[{ key: 'pending', label: 'รอดำเนินการ' }, { key: 'done', label: 'ดำเนินการแล้ว' }].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setSelected(null); }} style={{
                flex: 1, padding: '8px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 12, fontWeight: tab === t.key ? 600 : 400,
                color: tab === t.key ? '#6D28D9' : '#94A3B8',
                borderBottom: `2px solid ${tab === t.key ? '#6D28D9' : 'transparent'}`,
                fontFamily: "'Sarabun',sans-serif", transition: 'all 150ms',
              }}>{t.label} {t.key === 'pending' && queue.filter(() => tab === 'pending').length > 0 && <span style={{ background: '#D97706', color: '#fff', borderRadius: 9999, fontSize: 9, fontWeight: 700, padding: '1px 5px', marginLeft: 4 }}>{kpiItems.length + reportItems.length}</span>}</button>
            ))}
          </div>
        </div>

        {/* Queue list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {queue.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
              <Icon name="approval" size={32} color="#E2E8F0" />
              <div style={{ fontSize: 13, marginTop: 10 }}>{tab === 'pending' ? 'ไม่มีรายการรออนุมัติ' : 'ไม่มีประวัติ'}</div>
            </div>
          )}
          {queue.map(q => {
            const isKpi = q.type === 'kpi';
            const kpi = isKpi ? q.item : q.kpi;
            const item = q.item;
            const isSel = selected?.id === q.id && selected?.type === q.type;
            return (
              <div key={`${q.type}-${q.id}`} onClick={() => setSelected({ id: q.id, type: q.type })} style={{
                padding: '14px 16px', borderBottom: '1px solid #F8F7FC', cursor: 'pointer',
                background: isSel ? '#F5F3FF' : '#fff',
                borderLeft: `3px solid ${isSel ? '#6D28D9' : 'transparent'}`,
                transition: 'background 100ms',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <div style={{ display: 'flex', align: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, background: isKpi ? '#F5F3FF' : '#EFF6FF', color: isKpi ? '#6D28D9' : '#1D4ED8', padding: '1px 6px', borderRadius: 9999, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {isKpi ? 'KPI' : 'รายงาน'}
                    </span>
                    <DivBadge div={kpi?.div || ''} />
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", color: '#7C3AED', marginBottom: 3 }}>{kpi?.id}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', lineHeight: 1.4, marginBottom: 4 }}>
                  {kpi?.name}
                </div>
                {!isKpi && (
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{MONTHS_TH[item.month - 1]} {item.year}</div>
                )}
                {/* Last log */}
                {item.logs?.length > 0 && (
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="clock" size={11} color="#CBD5E1" />
                    {item.logs[item.logs.length - 1].date} · {item.logs[item.logs.length - 1].actor}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right detail panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {renderDetail()}
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', width: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1E293B', marginBottom: 6 }}>ส่งกลับเพื่อแก้ไข</div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>กรุณาระบุเหตุผลในการส่งกลับ</div>
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

Object.assign(window, { ApprovalScreen });
