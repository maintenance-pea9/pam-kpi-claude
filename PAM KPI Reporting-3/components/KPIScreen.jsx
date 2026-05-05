// KPIScreen.jsx — KPI Master Data list + form for PAM KPI System

/* ═══ KPI LIST ═══ */
function KPIScreen({ kpis, setKpis, role, onNavigate, setDetailKPI }) {
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [divFilter, setDivFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const roleInfo = ROLES[role];
  const isAssignee = role && role.startsWith('assignee');

  const visible = kpis.filter(k => {
    if (!canViewDiv(role, k.div)) return false;
    if (statusFilter !== 'all' && k.status !== statusFilter) return false;
    if (divFilter !== 'all' && k.div !== divFilter) return false;
    if (search && !k.name.toLowerCase().includes(search.toLowerCase()) && !k.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusFilters = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'draft', label: 'ฉบับร่าง' },
    { key: 'pending1', label: 'รอ ผอ.กอง' },
    { key: 'pending2', label: 'รอผู้รวบรวมฯ' },
    { key: 'pending3', label: 'รอ ผอ.ฝ่าย' },
    { key: 'approved', label: 'อนุมัติแล้ว' },
    { key: 'returned', label: 'ส่งกลับ' },
  ];

  const divFilters = [
    { key: 'all', label: 'ทุกกอง' },
    { key: 'กบผ.', label: 'กบผ.' },
    { key: 'กบร.', label: 'กบร.' },
    { key: 'กบค.', label: 'กบค.' },
  ].filter(d => d.key === 'all' || canViewDiv(role, d.key));

  const thStyle = {
    padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B',
    letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'left',
    background: '#FAFAFA', borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap',
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: '#F8F7FC' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
            <Icon name="search" size={14} color="#475569" />
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหา KPI..." style={{ ...inputStyle, paddingLeft: 32, background: '#fff' }} />
        </div>

        {/* Div filter pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {divFilters.map(f => (
            <button key={f.key} onClick={() => setDivFilter(f.key)} style={{
              padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'IBM Plex Mono',monospace",
              background: divFilter === f.key ? '#6D28D9' : '#fff',
              color: divFilter === f.key ? '#fff' : '#64748B',
              border: divFilter === f.key ? '1px solid #6D28D9' : '1px solid #E2E8F0',
              transition: 'all 150ms',
            }}>{f.label}</button>
          ))}
        </div>

        {isAssignee && (
          <Btn variant="primary" icon="plus" onClick={() => { setDetailKPI(null); onNavigate('kpi_form'); }}>สร้าง KPI ใหม่</Btn>
        )}
      </div>

      {/* Status filter chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {statusFilters.map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
            padding: '5px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Sarabun',sans-serif",
            background: statusFilter === f.key ? '#6D28D9' : '#fff',
            color: statusFilter === f.key ? '#fff' : '#64748B',
            border: statusFilter === f.key ? '1px solid #6D28D9' : '1px solid #E2E8F0',
            transition: 'all 150ms',
          }}>{f.label}</button>
        ))}
        <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 4, lineHeight: '30px' }}>{visible.length} รายการ</span>
      </div>

      {/* Table */}
      <Card padding="0">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>รหัส KPI</th>
              <th style={{ ...thStyle, width: '32%' }}>ชื่อตัวชี้วัด</th>
              <th style={thStyle}>กอง</th>
              <th style={thStyle}>หมวดหมู่</th>
              <th style={thStyle}>น้ำหนัก</th>
              <th style={thStyle}>สถานะ</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>ไม่พบรายการที่ตรงกับเงื่อนไข</td></tr>
            )}
            {visible.map((kpi, i) => (
              <tr key={kpi.id} style={{ background: i % 2 === 0 ? '#fff' : '#FAF9FF', cursor: 'pointer', transition: 'background 100ms' }}
                onClick={() => { setDetailKPI(kpi); onNavigate('kpi_form'); }}
                onMouseEnter={e => e.currentTarget.style.background = '#F5F3FF'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAF9FF'}>
                <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", color: '#7C3AED', whiteSpace: 'nowrap' }}>{kpi.id}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', lineHeight: 1.4 }}>{kpi.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 340 }}>{kpi.definition}</div>
                </td>
                <td style={{ padding: '12px 16px' }}><DivBadge div={kpi.div} /></td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 11, background: '#F5F3FF', color: '#6D28D9', padding: '2px 8px', borderRadius: 9999, fontWeight: 500 }}>{kpi.category}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: "'IBM Plex Mono',monospace", color: '#475569' }}>{kpi.weight}%</td>
                <td style={{ padding: '12px 16px' }}><StatusBadge status={kpi.status} size="sm" /></td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setDetailKPI(kpi); onNavigate('kpi_form'); }} style={{ background: '#F5F3FF', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11, color: '#7C3AED', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name={canEdit(role, kpi.div) ? 'edit' : 'eye'} size={12} />
                      {canEdit(role, kpi.div) ? 'แก้ไข' : 'ดู'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ═══ KPI FORM (Create / Edit / View) ═══ */
function KPIFormScreen({ kpi: initialKPI, kpis, setKpis, role, user, onNavigate }) {
  const isNew = !initialKPI;
  const roleInfo = ROLES[role];
  const editable = isNew || canEdit(role, initialKPI?.div);

  const blank = { name: '', definition: '', unit: '%', weight: 10, div: roleInfo?.div || 'กบร.', category: 'ประสิทธิภาพ', owner: user?.name || '', coOwner: '', initiative: '', targets: { 1: '', 2: '', 3: '', 4: '', 5: '' }, status: 'draft', logs: [] };
  const [form, setForm] = React.useState(isNew ? blank : { ...initialKPI, targets: { ...initialKPI.targets } });
  const [rejectModal, setRejectModal] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  const canApprove = !isNew && canApproveKPI(role, form.status, form.div);
  const canSend = editable && (form.status === 'draft' || form.status === 'returned');

  function setField(k, v) { setForm(p => ({ ...p, [k]: v })); }
  function setTarget(lvl, v) { setForm(p => ({ ...p, targets: { ...p.targets, [lvl]: v } })); }

  function handleSaveDraft() {
    const updated = { ...form, status: 'draft', logs: [...(form.logs || []), { action: 'saved', actor: user.name, role: roleInfo.short, date: 'พ.ค. 2568', comment: 'บันทึกฉบับร่าง' }] };
    persist(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSubmit() {
    const updated = { ...form, status: 'pending1', logs: [...(form.logs || []), { action: 'submitted', actor: user.name, role: roleInfo.short, date: 'พ.ค. 2568', comment: 'ส่งขออนุมัติหัวข้อตัวชี้วัด' }] };
    persist(updated);
    onNavigate('kpi');
  }

  function handleApprove() {
    const next = nextStatus(form.status);
    const updated = { ...form, status: next, logs: [...(form.logs || []), { action: 'approved', actor: user.name, role: roleInfo.short, date: 'พ.ค. 2568', comment: 'อนุมัติ' }] };
    persist(updated);
    onNavigate('kpi');
  }

  function handleReject() {
    const updated = { ...form, status: 'returned', logs: [...(form.logs || []), { action: 'returned', actor: user.name, role: roleInfo.short, date: 'พ.ค. 2568', comment: rejectReason }] };
    persist(updated);
    setRejectModal(false);
    onNavigate('kpi');
  }

  function persist(updated) {
    setKpis(prev => {
      const idx = prev.findIndex(k => k.id === updated.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = updated; return n; }
      const newId = `${updated.div}-${String(prev.filter(k => k.div === updated.div).length + 1).padStart(3, '0')}`;
      return [...prev, { ...updated, id: newId }];
    });
  }

  const categories = ['ความปลอดภัย', 'ประสิทธิภาพ', 'การบำรุงรักษา', 'งบประมาณ', 'การบริการ', 'นวัตกรรม'];
  const units = ['%', 'ครั้ง', 'ชิ้น', 'หน่วย', 'บาท', 'ชั่วโมง', 'วัน', 'คน'];
  const levelColors = ['', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981'];
  const levelLabels = ['', 'ระดับ 1 — ต้องปรับปรุง', 'ระดับ 2 — ต่ำกว่าเกณฑ์', 'ระดับ 3 — ผ่านเกณฑ์', 'ระดับ 4 — ดีมาก', 'ระดับ 5 — ดีเยี่ยม'];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: '#F8F7FC' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => onNavigate('kpi')} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B', fontFamily: "'Sarabun',sans-serif" }}>
              <Icon name="chevron-left" size={14} /> กลับ
            </button>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{isNew ? 'สร้าง KPI ใหม่' : form.name}</div>
              {!isNew && <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1, fontFamily: "'IBM Plex Mono',monospace" }}>{form.id}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!isNew && <StatusBadge status={form.status} />}
            {canApprove && (
              <>
                <Btn variant="danger" icon="x" onClick={() => setRejectModal(true)}>ส่งกลับแก้ไข</Btn>
                <Btn variant="success" icon="check" onClick={handleApprove}>อนุมัติ</Btn>
              </>
            )}
            {editable && (
              <>
                {saved && <span style={{ fontSize: 12, color: '#16A34A' }}>✓ บันทึกแล้ว</span>}
                <Btn variant="secondary" icon="save" onClick={handleSaveDraft}>บันทึกร่าง</Btn>
                {canSend && <Btn variant="primary" icon="send" onClick={handleSubmit}>ส่งขออนุมัติ</Btn>}
              </>
            )}
          </div>
        </div>

        {/* Returned warning */}
        {form.status === 'returned' && form.logs?.length > 0 && (() => {
          const lastReturn = [...form.logs].reverse().find(l => l.action === 'returned');
          return lastReturn ? (
            <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10 }}>
              <Icon name="alert" size={16} color="#E11D48" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#BE123C' }}>ส่งกลับเพื่อแก้ไข — {lastReturn.actor}</div>
                <div style={{ fontSize: 12, color: '#E11D48', marginTop: 3 }}>{lastReturn.comment}</div>
              </div>
            </div>
          ) : null;
        })()}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Main info card */}
            <Card padding="24px">
              <div style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 18 }}>ข้อมูลตัวชี้วัด</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="ชื่อตัวชี้วัด / เกณฑ์ชี้วัด" required>
                    <input style={{ ...inputStyle, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="กรอกชื่อตัวชี้วัด..." />
                  </Field>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="คำนิยาม / วิธีการวัด" required>
                    <textarea style={{ ...textareaStyle, minHeight: 72, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.definition} onChange={e => setField('definition', e.target.value)} placeholder="อธิบายความหมาย วิธีการวัด และแหล่งข้อมูล..." />
                  </Field>
                </div>
                <Field label="กอง (สังกัด)" required>
                  <select style={{ ...selectStyle, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} disabled={!editable || !isNew} value={form.div} onChange={e => setField('div', e.target.value)}>
                    <option value="กบผ.">กบผ. — กองจัดการงานบำรุงรักษาระบบผลิต</option>
                    <option value="กบร.">กบร. — กองบริหารจัดการระบบไฟฟ้า</option>
                    <option value="กบค.">กบค. — กองบริหารจัดการงานเครื่องกล</option>
                  </select>
                </Field>
                <Field label="หมวดหมู่">
                  <select style={{ ...selectStyle, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} disabled={!editable} value={form.category} onChange={e => setField('category', e.target.value)}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="หน่วยวัด" required>
                  <select style={{ ...selectStyle, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} disabled={!editable} value={form.unit} onChange={e => setField('unit', e.target.value)}>
                    {units.map(u => <option key={u}>{u}</option>)}
                  </select>
                </Field>
                <Field label="น้ำหนัก (%)" hint="รวมทุก KPI ต้องไม่เกิน 100%">
                  <input type="number" style={{ ...inputStyle, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} min="1" max="100" value={form.weight} onChange={e => setField('weight', e.target.value)} />
                </Field>
                <Field label="ผู้รับผิดชอบหลัก">
                  <input style={{ ...inputStyle, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.owner} onChange={e => setField('owner', e.target.value)} />
                </Field>
                <Field label="ผู้รับผิดชอบร่วม">
                  <input style={{ ...inputStyle, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.coOwner} onChange={e => setField('coOwner', e.target.value)} placeholder="(ถ้ามี)" />
                </Field>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="แผนปฏิบัติการ (Initiative)">
                    <input style={{ ...inputStyle, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC' }} readOnly={!editable} value={form.initiative} onChange={e => setField('initiative', e.target.value)} placeholder="ระบุแผนหรือโครงการที่รองรับ KPI นี้..." />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Target levels card */}
            <Card padding="24px">
              <div style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>เป้าหมายระดับ 1–5</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 18 }}>กำหนดเป้าหมายแยกตามระดับผลงาน (หน่วย: {form.unit})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[5, 4, 3, 2, 1].map(lvl => (
                  <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 140, fontSize: 12, fontWeight: 500, color: levelColors[lvl], display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: levelColors[lvl], flexShrink: 0 }}></div>
                      {levelLabels[lvl]}
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input type="number" style={{ ...inputStyle, opacity: editable ? 1 : 0.7, background: editable ? '#fff' : '#F8F7FC', paddingRight: 40 }} readOnly={!editable} value={form.targets[lvl]} onChange={e => setTarget(lvl, e.target.value)} placeholder={`ค่าเป้าหมาย`} />
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94A3B8' }}>{form.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Approval Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card padding="20px">
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>ขั้นตอนการอนุมัติ</div>
              {/* Step indicators */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, left: '16.5%', right: '16.5%', height: 2, background: '#E2E8F0', zIndex: 0 }}></div>
                {[
                  { label: 'ผู้จัดทำ', sub: 'Assignee', statuses: ['draft','pending1','pending2','pending3','approved','returned'] },
                  { label: 'ผอ.กอง', sub: 'Lv.1',     statuses: ['pending2','pending3','approved'] },
                  { label: 'ผู้รวบรวมฯ', sub: 'Lv.2',  statuses: ['pending3','approved'] },
                  { label: 'ผอ.ฝ่าย', sub: 'Lv.3',     statuses: ['approved'] },
                ].map((step, i) => {
                  const done = step.statuses.includes(form.status);
                  const active = (i === 1 && form.status === 'pending1') || (i === 2 && form.status === 'pending2') || (i === 3 && form.status === 'pending3');
                  const ret = form.status === 'returned' && i === 0;
                  const color = ret ? '#E11D48' : done ? '#16A34A' : active ? '#D97706' : '#CBD5E1';
                  const bg = ret ? '#FFF1F2' : done ? '#F0FDF4' : active ? '#FFFBEB' : '#F8F7FC';
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                        {done && !active && <Icon name="check" size={13} color={color} />}
                        {active && <Icon name="clock" size={13} color={color} />}
                        {ret && <Icon name="x" size={13} color={color} />}
                        {!done && !active && !ret && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }}></div>}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: done || active ? '#334155' : '#94A3B8', textAlign: 'center' }}>{step.label}</div>
                      <div style={{ fontSize: 9, color: '#94A3B8', textAlign: 'center' }}>{step.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* Logs */}
              {form.logs?.length > 0 ? (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>ประวัติการดำเนินการ</div>
                  <ApprovalTimeline logs={form.logs} />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#CBD5E1', fontSize: 12 }}>ยังไม่มีประวัติ</div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', width: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1E293B', marginBottom: 6 }}>ส่งกลับเพื่อแก้ไข</div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>กรุณาระบุเหตุผลในการส่งกลับเพื่อให้ผู้จัดทำดำเนินการแก้ไข</div>
            <Field label="เหตุผลในการส่งกลับ" required>
              <textarea style={{ ...textareaStyle, minHeight: 100 }} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="กรอกเหตุผล..." />
            </Field>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <Btn variant="outline" onClick={() => setRejectModal(false)}>ยกเลิก</Btn>
              <Btn variant="danger" icon="x" disabled={!rejectReason.trim()} onClick={handleReject}>ยืนยันการส่งกลับ</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { KPIScreen, KPIFormScreen });
