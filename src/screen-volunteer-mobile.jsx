// Volunteer Mobile — simplified 3-screen view
// 1) Task assigned 2) On the way 3) Done

function ScreenVolunteerMobile({ onClose }) {
  const [step, setStep] = React.useState(1);

  const task = {
    id: 'C-204',
    priority: 'P1',
    title: 'Levar 6 caixas de água à Ala B',
    location: 'Abrigo Várzea · Ala B',
    distance: '180 m a pé',
    note: 'Há um idoso com hipertensão sem medicação. Avisar a enfermeira ao chegar.',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(8,10,14,0.75)',
      display: 'grid', placeItems: 'center',
      padding: 20,
    }}>
      {/* Phone frame */}
      <div style={{
        width: 320, height: 640, maxHeight: '90vh',
        background: '#000', borderRadius: 38, padding: 8,
        position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: -40, right: 0,
          background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff', padding: '6px 12px', borderRadius: 6,
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>Fechar demo</button>

        <div style={{
          width: '100%', height: '100%', background: 'var(--bg)',
          borderRadius: 30, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* status bar */}
          <div style={{
            height: 32, background: '#000', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', fontSize: 12, fontWeight: 600,
          }}>
            <span>21:42</span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Icon.Wifi size={11} color="#fff" />
              <span style={{ width: 16, height: 8, border: '1px solid #fff', borderRadius: 2,
                background: 'linear-gradient(to right, #fff 70%, transparent 70%)' }} />
            </span>
          </div>

          {/* App bar */}
          <div style={{
            padding: '10px 16px',
            background: 'var(--ink)', color: '#fff',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--p1)' }}
                  className="crit-pulse" />
            <div>
              <div style={{ fontSize: 10, opacity: 0.6, fontWeight: 500, letterSpacing: 0.5 }}>
                SOS COORD · VOLUNTÁRIO
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Ana Ribeiro</div>
            </div>
          </div>

          {/* Step content */}
          <div style={{ flex: 1, padding: 16, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 12 }}>
            {step === 1 && <Step1 task={task} onStart={() => setStep(2)} />}
            {step === 2 && <Step2 task={task} onDone={() => setStep(3)} />}
            {step === 3 && <Step3 onReset={onClose} />}
          </div>

          {/* Step dots */}
          <div style={{ padding: 12, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[1,2,3].map(n => (
              <span key={n} style={{
                width: n === step ? 18 : 6, height: 6, borderRadius: 3,
                background: n === step ? 'var(--ink)' : 'var(--line)',
                transition: 'width 200ms',
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step1({ task, onStart }) {
  return (
    <>
      <div style={{
        background: 'var(--p1-bg)', border: '1px solid #f5c2c5',
        borderLeft: '4px solid var(--p1)', borderRadius: 8,
        padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <window.UI.PriorityBadge p="P1" size="sm" />
        <span style={{ fontSize: 11, color: 'var(--p1)', fontWeight: 700,
          letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Nova tarefa atribuída
        </span>
      </div>

      <div>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600,
          letterSpacing: 0.5, textTransform: 'uppercase' }}>Tarefa</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.25 }}>
          {task.title}
        </div>
      </div>

      {/* mini map */}
      <div style={{
        background: '#eef1f4', borderRadius: 8, height: 140, position: 'relative',
        border: '1px solid var(--line)',
      }}>
        <svg viewBox="0 0 280 140" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <pattern id="g2" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#d2d7dd" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="280" height="140" fill="url(#g2)" />
          <path d="M 30 110 Q 120 80 180 60 L 220 50" stroke="var(--p5)"
                strokeWidth="3" strokeDasharray="4 4" fill="none" />
          <circle cx="30" cy="110" r="6" fill="#fff" stroke="var(--p5)" strokeWidth="2.5" />
        </svg>
        <div style={{
          position: 'absolute', right: '20%', top: 30,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <span className="crit-pulse" style={{
            width: 20, height: 20, borderRadius: '50% 50% 50% 0',
            background: 'var(--p1)', transform: 'rotate(-45deg)',
            border: '2px solid #fff',
          }} />
        </div>
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: '#fff', borderRadius: 6, padding: '4px 8px',
          fontSize: 11, fontWeight: 600, color: 'var(--ink)',
          border: '1px solid var(--line)',
        }}>
          {task.distance}
        </div>
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 8, padding: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700 }}>
          <Icon.Pin size={14} color="var(--p1)" /> {task.location}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-2)',
          background: 'var(--surface-2)', borderRadius: 6, padding: 8,
          borderLeft: '2px solid var(--p2)' }}>
          {task.note}
        </div>
      </div>

      <button onClick={onStart} style={{
        marginTop: 'auto', width: '100%', minHeight: 56,
        background: 'var(--p4)', color: '#fff',
        border: 'none', borderRadius: 12,
        fontSize: 18, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer', boxShadow: '0 4px 12px rgba(47,138,67,0.3)',
      }}>
        <Icon.Play size={18} /> Iniciar
      </button>
    </>
  );
}

function Step2({ task, onDone }) {
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <>
      <div style={{
        background: 'var(--p5-bg)', border: '1px solid #b8cdef',
        borderLeft: '4px solid var(--p5)', borderRadius: 8,
        padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span className="crit-pulse" style={{
          width: 8, height: 8, borderRadius: 4, background: 'var(--p5)',
        }} />
        <span style={{ fontSize: 11, color: 'var(--p5)', fontWeight: 700,
          letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Em andamento
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--p5)',
          fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {mm}:{ss}
        </span>
      </div>

      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.25 }}>
        {task.title}
      </div>

      <div style={{ fontSize: 13, color: 'var(--muted)',
        display: 'flex', alignItems: 'center', gap: 4 }}>
        <Icon.Pin size={13} /> {task.location}
      </div>

      <div style={{
        flex: 1, display: 'grid', placeItems: 'center',
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 12, padding: 20, textAlign: 'center',
      }}>
        <div>
          <div style={{
            width: 80, height: 80, borderRadius: 40, margin: '0 auto 12px',
            background: 'var(--p5-bg)', display: 'grid', placeItems: 'center',
          }}>
            <Icon.Truck size={36} color="var(--p5)" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-2)' }}>
            A caminho da Ala B
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            Carregamento: 6 caixas de água potável
          </div>
        </div>
      </div>

      <button onClick={onDone} style={{
        width: '100%', minHeight: 56,
        background: 'var(--ink)', color: '#fff',
        border: 'none', borderRadius: 12,
        fontSize: 18, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer',
      }}>
        <Icon.Check size={18} strokeWidth={2.6} /> Concluído
      </button>
    </>
  );
}

function Step3({ onReset }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: 20,
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: 48,
        background: 'var(--p4)', display: 'grid', placeItems: 'center',
        marginBottom: 16,
      }}>
        <Icon.Check size={48} color="#fff" strokeWidth={3} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)' }}>
        Tarefa concluída
      </div>
      <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
        Coordenação avisada.<br/>Aguardando próxima atribuição.
      </div>
      <button onClick={onReset} style={{
        marginTop: 32, padding: '12px 20px', minHeight: 44,
        background: 'transparent', color: 'var(--ink-2)',
        border: '1px solid var(--line)', borderRadius: 8,
        fontWeight: 600, fontSize: 14, cursor: 'pointer',
      }}>
        Encerrar demo
      </button>
    </div>
  );
}

window.ScreenVolunteerMobile = ScreenVolunteerMobile;
