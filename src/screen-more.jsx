// "Mais" — Shelters, Risk Areas, Donation Points, ISO 13407 process

function ScreenMore({ sub, actions }) {
  const subs = [
    { id: 'abrigos',  label: 'Abrigos',          icon: <Icon.House size={18} />,    desc: '4 unidades · 1 alerta crítico' },
    { id: 'riscos',   label: 'Áreas de risco',    icon: <Icon.Alert size={18} />,    desc: '4 áreas monitoradas' },
    { id: 'doacoes',  label: 'Pontos de doação', icon: <Icon.Pin size={18} />,      desc: '4 pontos · 3 abertos' },
    { id: 'iso',      label: 'Processo ISO 13407', icon: <Icon.Loop size={18} />,   desc: 'Ciclo de design centrado no usuário' },
  ];

  if (sub === 'abrigos')  return <ShelterList actions={actions} />;
  if (sub === 'riscos')   return <RiskAreas actions={actions} />;
  if (sub === 'doacoes')  return <DonationPoints actions={actions} />;
  if (sub === 'iso')      return <ISOProcess actions={actions} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>Mais</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          Visões físicas e referência de processo
        </div>
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {subs.map((s, i) => (
          <button key={s.id} onClick={() => actions.goTo('more', { sub: s.id })} style={{
            width: '100%', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', minHeight: 56,
            background: 'transparent', border: 'none',
            borderTop: i === 0 ? 'none' : '1px solid var(--line-2)',
            cursor: 'pointer',
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--surface-2)', display: 'grid', placeItems: 'center',
              color: 'var(--ink-2)',
            }}>{s.icon}</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{s.label}</span>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>{s.desc}</span>
            </span>
            <Icon.Chevron size={16} color="var(--muted)" />
          </button>
        ))}
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 10, padding: 14,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Demo · tela do voluntário</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
          Versão móvel simplificada — recebe tarefa e confirma com um toque
        </div>
        <window.UI.Button variant="secondary" full
                          icon={<Icon.Phone size={14} />}
                          onClick={() => actions.openVolunteerMobile()}>
          Abrir tela do voluntário
        </window.UI.Button>
      </div>
    </div>
  );
}

// ============ SHELTERS ============
function ShelterList({ actions }) {
  const shelters = window.CFData.INITIAL_SHELTERS;
  const statusIcon = {
    'ok':      { color: 'var(--p4)', label: 'OK' },
    'alerta':  { color: 'var(--p2)', label: 'alerta' },
    'crítico': { color: 'var(--p1)', label: 'crítico' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SubHeader title="Abrigos" subtitle={`${shelters.length} unidades monitoradas`} actions={actions} />

      {shelters.map(s => {
        const occPct = Math.round(s.occupied / s.capacity * 100);
        let occColor = 'var(--p4)';
        if (occPct >= 95) occColor = 'var(--p1)';
        else if (occPct >= 80) occColor = 'var(--p2)';

        const hasCrit = s.water === 'crítico' || s.power === 'crítico' || s.infirmary === 'crítico';

        return (
          <div key={s.id} style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderLeft: hasCrit ? '4px solid var(--p1)' : '1px solid var(--line)',
            borderRadius: 10, padding: 14,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {s.occupied}/{s.capacity}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginBottom: 4,
                textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Ocupação
              </div>
              <div style={{ height: 8, background: 'var(--line-2)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${occPct}%`, height: '100%', background: occColor }} />
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: occColor, fontWeight: 600 }}>
                {occPct}% ocupado
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              <StatusTile icon={<Icon.Drop size={14} />} label="Água" stat={s.water} colorMap={statusIcon} />
              <StatusTile icon={<Icon.Bolt size={14} />} label="Energia" stat={s.power} colorMap={statusIcon} />
              <StatusTile icon={<Icon.HeartPulse size={14} />} label="Enfermaria" stat={s.infirmary} colorMap={statusIcon} />
            </div>

            {s.issues && s.issues.length > 0 && (
              <div style={{ borderTop: '1px dashed var(--line-2)', paddingTop: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginBottom: 4,
                  textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Issues abertas · {s.issues.length}
                </div>
                {s.issues.map((iss, i) => (
                  <div key={i} style={{
                    fontSize: 13, padding: '4px 0', color: 'var(--ink-2)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--muted)' }} />
                    {iss}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusTile({ icon, label, stat, colorMap }) {
  const m = colorMap[stat] || colorMap['ok'];
  return (
    <div style={{
      background: 'var(--surface-2)', borderRadius: 6,
      padding: '8px 6px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    }}>
      <span style={{ color: m.color }}>{icon}</span>
      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.label}</span>
    </div>
  );
}

// ============ RISK AREAS ============
function RiskAreas({ actions }) {
  const { PriorityBadge } = window.UI;
  const areas = window.CFData.RISK_AREAS;

  // Simple stylized mini-map with markers (NOT a real map — synthetic representation)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SubHeader title="Áreas de risco" subtitle={`${areas.length} áreas monitoradas`} actions={actions} />

      {/* Mini map */}
      <div style={{
        background: '#eef1f4', border: '1px solid var(--line)',
        borderRadius: 10, padding: 12, position: 'relative', height: 240, overflow: 'hidden',
      }}>
        {/* River SVG */}
        <svg viewBox="0 0 320 220" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
        }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d9dde2" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="320" height="220" fill="url(#grid)" />
          <path d="M -10 80 Q 80 60 140 100 T 280 130 L 340 140 L 340 160 Q 220 160 140 130 Q 80 110 -10 130 Z"
                fill="#cdd9eb" stroke="#9eb3d2" strokeWidth="1" />
          <text x="170" y="115" fontSize="9" fill="#5b6470" fontFamily="JetBrains Mono">Rio Capibaribe</text>
        </svg>
        {/* Markers */}
        {[
          { x: '20%', y: '20%', a: areas[0] },
          { x: '60%', y: '38%', a: areas[1] },
          { x: '40%', y: '70%', a: areas[2] },
          { x: '78%', y: '78%', a: areas[3] },
        ].map((m, i) => {
          const c = window.CFData.PRIORITIES[m.a.level].color;
          return (
            <div key={i} style={{
              position: 'absolute', left: m.x, top: m.y,
              transform: 'translate(-50%, -100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span className={m.a.level === 'P1' ? 'crit-pulse' : ''} style={{
                width: 20, height: 20, borderRadius: '50% 50% 50% 0',
                background: c, transform: 'rotate(-45deg)',
                border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
              <span style={{
                fontSize: 10, background: '#fff', border: '1px solid var(--line)',
                borderRadius: 4, padding: '1px 5px', fontWeight: 700, color: c,
              }}>{m.a.level}</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {areas.map(a => {
          const c = window.CFData.PRIORITIES[a.level].color;
          return (
            <div key={a.id} style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderLeft: `4px solid ${c}`,
              borderRadius: 8, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <PriorityBadge p={a.level} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.note}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{a.people}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>pessoas</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ DONATION POINTS ============
function DonationPoints({ actions }) {
  const points = window.CFData.DONATION_POINTS;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SubHeader title="Pontos de doação" subtitle={`${points.length} pontos no evento`} actions={actions} />

      {points.map(p => (
        <div key={p.id} style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 8, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: p.status === 'aberto' ? 'var(--p4-bg)' : 'var(--gray-bg)',
            color: p.status === 'aberto' ? 'var(--p4)' : 'var(--gray)',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon.Pin size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.address}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{p.itemsToday}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>itens hoje</div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700,
            background: p.status === 'aberto' ? 'var(--p4-bg)' : 'var(--gray-bg)',
            color: p.status === 'aberto' ? 'var(--p4)' : 'var(--gray)',
            padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>{p.status}</span>
        </div>
      ))}
    </div>
  );
}

// ============ ISO 13407 ============
function ISOProcess({ actions }) {
  const steps = [
    { n: 1, label: 'Planejar', desc: 'Planejar o processo centrado no humano' },
    { n: 2, label: 'Contexto', desc: 'Entender e especificar o contexto de uso' },
    { n: 3, label: 'Requisitos', desc: 'Especificar requisitos do usuário e da organização' },
    { n: 4, label: 'Solução', desc: 'Produzir soluções de design' },
    { n: 5, label: 'Avaliar', desc: 'Avaliar as soluções contra os requisitos' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SubHeader title="Processo · ISO 13407" subtitle="Design centrado no usuário aplicado ao CrisisFlow" actions={actions} />

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 10, padding: 16,
      }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.5 }}>
          Ciclo iterativo que coloca o coordenador (sob fadiga, sob pressão) no centro
          das decisões de design — usabilidade de sobrevivência.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start',
                                    paddingBottom: i < steps.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: 'var(--ink)', color: '#fff',
                  display: 'grid', placeItems: 'center',
                  fontSize: 13, fontWeight: 700,
                }}>{s.n}</div>
                {i < steps.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: 'var(--line)', minHeight: 24, marginTop: 2 }} />
                )}
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16, padding: 12, background: 'var(--surface-2)',
          borderRadius: 8, fontSize: 12, color: 'var(--ink-2)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon.Loop size={16} color="var(--p5)" />
          O ciclo retorna ao passo 2 sempre que a avaliação revela necessidades novas.
        </div>
      </div>
    </div>
  );
}

function SubHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
      <button onClick={() => actions.goTo('more')} style={{
        background: 'transparent', border: 'none', padding: 4, margin: '-4px 0 -4px -4px',
        color: 'var(--muted)', display: 'grid', placeItems: 'center', cursor: 'pointer',
      }}>
        <Icon.Chevron size={18} style={{ transform: 'rotate(180deg)' }} />
      </button>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{subtitle}</div>
      </div>
    </div>
  );
}

window.ScreenMore = ScreenMore;
