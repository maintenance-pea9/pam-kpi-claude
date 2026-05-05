// LoginPage.jsx — Sleek glassmorphism login for PAM KPI System

function LoginPage({ onLogin }) {
  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);

  // Demo credentials: userId = role key, password = 'pea2568'
  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS[userId];
      if (!user) { setError('ไม่พบรหัสพนักงานในระบบ'); setLoading(false); return; }
      if (password !== 'pea2568') { setError('รหัสผ่านไม่ถูกต้อง'); setLoading(false); return; }
      setLoading(false);
      onLogin(userId);
    }, 700);
  }

  const demoRoles = [
    { key: 'director', label: 'ผอ.ฝ่าย' },
    { key: 'consolidator', label: 'ผู้รวบรวมฯ' },
    { key: 'divhead_gbr', label: 'ผอ.กอง กบร.' },
    { key: 'assignee_gbr', label: 'ผู้จัดทำ กบร.' },
    { key: 'staff_gbr', label: 'พนักงาน กบร.' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a0533 0%, #2d0a5e 35%, #3B0764 60%, #4a1580 100%)',
      fontFamily: "'Sarabun', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%)', top: '-150px', left: '-100px' }}></div>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', bottom: '-100px', right: '-50px' }}></div>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', top: '40%', right: '10%' }}></div>
        {/* Grid pattern */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 420, padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Logo + Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, gap: 16 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
            border: '3px solid rgba(201,168,76,0.6)',
            boxShadow: '0 0 0 6px rgba(109,40,217,0.2), 0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <img src="assets/LOGO_PEA-2.jpg" alt="PEA" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#EDE9FE', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              ระบบบริหารจัดการ KPI
            </div>
            <div style={{ fontSize: 13, color: '#A78BFA', marginTop: 4 }}>
              ฝ่ายบริหารจัดการสินทรัพย์ระบบไฟฟ้า (ฝบร.)
            </div>
            <div style={{ fontSize: 11, color: 'rgba(167,139,250,0.6)', marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>
              PAM · KPI Reporting System
            </div>
          </div>
        </div>

        {/* Glass card */}
        <div style={{
          width: '100%', borderRadius: 20,
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          padding: '32px 32px 28px',
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#EDE9FE', marginBottom: 6 }}>เข้าสู่ระบบ</div>
          <div style={{ fontSize: 12, color: 'rgba(167,139,250,0.8)', marginBottom: 24 }}>กรุณากรอกรหัสพนักงานและรหัสผ่าน</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Employee ID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(196,181,253,0.9)', letterSpacing: '0.03em' }}>รหัสพนักงาน</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  <Icon name="user" size={15} color="#C4B5FD" />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={e => { setUserId(e.target.value); setError(''); }}
                  placeholder="กรอกรหัสพนักงาน..."
                  style={{
                    width: '100%', padding: '11px 12px 11px 38px',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 10, fontSize: 13, color: '#EDE9FE',
                    outline: 'none', fontFamily: "'Sarabun',sans-serif",
                    transition: 'border-color 150ms',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(196,181,253,0.9)', letterSpacing: '0.03em' }}>รหัสผ่าน</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  <Icon name="lock" size={15} color="#C4B5FD" />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="รหัสผ่าน"
                  style={{
                    width: '100%', padding: '11px 40px 11px 38px',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 10, fontSize: 13, color: '#EDE9FE',
                    outline: 'none', fontFamily: "'Sarabun',sans-serif",
                    transition: 'border-color 150ms',
                  }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: 2 }}>
                  <Icon name="eye" size={15} color="#C4B5FD" />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8 }}>
                <Icon name="alert" size={13} color="#F87171" />
                <span style={{ fontSize: 12, color: '#FCA5A5' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading || !userId || !password} style={{
              marginTop: 4, padding: '12px', borderRadius: 10, border: 'none', cursor: loading || !userId || !password ? 'not-allowed' : 'pointer',
              background: loading || !userId || !password ? 'rgba(109,40,217,0.4)' : 'linear-gradient(135deg,#6D28D9,#8B5CF6)',
              color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "'Sarabun',sans-serif",
              boxShadow: loading || !userId || !password ? 'none' : '0 4px 14px rgba(109,40,217,0.4)',
              transition: 'all 200ms', opacity: loading || !userId || !password ? 0.7 : 1,
            }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  กำลังตรวจสอบ...
                </span>
              ) : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>

        {/* Demo quick login */}
        <div style={{ marginTop: 20, width: '100%' }}>
          <div style={{ fontSize: 11, color: 'rgba(167,139,250,0.5)', textAlign: 'center', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Demo — เข้าสู่ระบบด้วย Role
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {demoRoles.map(r => (
              <button key={r.key} onClick={() => { setUserId(r.key); setPassword('pea2568'); setError(''); }} style={{
                padding: '5px 12px', borderRadius: 9999, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                background: userId === r.key ? 'rgba(109,40,217,0.5)' : 'rgba(255,255,255,0.07)',
                color: userId === r.key ? '#EDE9FE' : 'rgba(196,181,253,0.7)',
                border: `1px solid ${userId === r.key ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                fontFamily: "'Sarabun',sans-serif", transition: 'all 150ms',
              }}>{r.label}</button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'rgba(167,139,250,0.4)' }}>
            รหัสผ่าน: <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'rgba(196,181,253,0.5)' }}>pea2568</span>
          </div>
        </div>

        <div style={{ marginTop: 32, fontSize: 11, color: 'rgba(167,139,250,0.3)', textAlign: 'center' }}>
          การไฟฟ้าส่วนภูมิภาค · Provincial Electricity Authority
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

Object.assign(window, { LoginPage });
