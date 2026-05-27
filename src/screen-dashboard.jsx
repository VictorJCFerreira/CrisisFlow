// Dashboard — Visão de Comando

const { useState: dsUseState } = React;

function ScreenDashboard({ state, actions }) {
  const { PriorityBadge, KPI, StockBar, Button, Chip } = window.UI;
  const PRI = window.CFData.PRIORITIES;
  const cases = state.cases;
  const vols = state.volunteers;
  const trucks = window.CFData.INITIAL_TRUCKS;

  // Triage counts
  const triage = ['P1','P2','P3','P4','P5'].map(p => ({
    p, count: cases.filter(c => c.priority === p && c.status !== 'fechado').length
  }));
  const criticalAlerts = triage.find(t => t.p === 'P1').count;

  // KPIs
  const totalPeople = 718; // assistidas no evento
  const volsActive = vols.filter(v => v.status !== 'descanso').length;
  const sheltersMonitored = window.CFData.INITIAL_SHELTERS.length;

  // Auto-calculated bottlenecks based on current state
  const bottlenecks = [];
  
  // 1. Check for water critical status in Abrigo Várzea
  const waterVarzea = state.supplies.find(s => s.name.toLowerCase().includes('água') && s.shelter === 'Abrigo Várzea');
  if (waterVarzea && (waterVarzea.current / waterVarzea.max) < 0.2) {
    const pct = Math.round((waterVarzea.current / waterVarzea.max) * 100);
    bottlenecks.push({
      sev: 'P1',
      text: `Abrigo Várzea · Ala B: água potável < 20% (${pct}% · ${waterVarzea.current}/${waterVarzea.max} L)`
    });
  }

  // 2. Check for idle volunteers with unstaffed P1 cases
  const idleCount = vols.filter(v => v.status === 'disponível').length;
  const p1NoTeam = cases.filter(c => c.priority === 'P1' && c.status !== 'fechado' && c.team.length === 0).length;
  if (p1NoTeam > 0 && idleCount > 0) {
    bottlenecks.push({
      sev: 'P2',
      text: `${idleCount} voluntário${idleCount > 1 ? 's' : ''} ocioso${idleCount > 1 ? 's' : ''} com casos P1 abertos sem equipe`
    });
  }

  // 3. Check for low medication in Abrigo São José
  const medsSaoJose = state.supplies.find(s => s.name.toLowerCase().includes('medicamento') && s.shelter === 'Abrigo São José');
  if (medsSaoJose && medsSaoJose.current < medsSaoJose.min) {
    bottlenecks.push({
      sev: 'P2',
      text: `Abrigo São José: medicamentos básicos abaixo do mínimo (${medsSaoJose.current}/${medsSaoJose.max} cx)`
    });
  }

  const p1Cases = cases.filter(c => c.priority === 'P1' && c.status !== 'fechado').slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Event banner */}
      <div style={{
        background: 'var(--ink)', color: '#fff',
        borderRadius: 10, padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div className="crit-pulse" style={{
            width: 10, height: 10, borderRadius: 5, background: 'var(--p1)', flex: '0 0 10px',
          }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.2, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase' }}>
              Evento ativo
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Enchente · Bacia do Rio Capibaribe
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>ativo há</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>3 dias 04h</div>
        </div>
      </div>

      {/* Triage panel — first visual anchor */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 10, padding: 14,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Triagem · 5 níveis</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>casos abertos</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {triage.map(t => (
            <button key={t.p} onClick={() => actions.goTo('cases', { filter: t.p })} style={{
              background: PRI[t.p].bg,
              border: `1px solid ${PRI[t.p].color}33`,
              borderTop: `3px solid ${PRI[t.p].color}`,
              borderRadius: 8, padding: '10px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              cursor: 'pointer',
            }}>
              <span style={{
                color: PRI[t.p].color, fontWeight: 700, fontSize: 11, letterSpacing: 0.5,
              }}>{t.p}</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {t.count}
              </span>
              <span style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.2 }}>
                {PRI[t.p].name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Critical bottlenecks — figure/ground */}
      <div style={{
        background: 'var(--p1-bg)',
        border: '1px solid #f5c2c5',
        borderLeft: '4px solid var(--p1)',
        borderRadius: 10, padding: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Icon.Alert size={18} color="var(--p1)" strokeWidth={2.2} />
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--p1)' }}>
            Gargalos críticos detectados
          </div>
          <span style={{
            marginLeft: 'auto', background: 'var(--p1)', color: '#fff',
            borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700,
          }}>{bottlenecks.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {bottlenecks.map((b, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 6, padding: '8px 10px',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13, color: 'var(--ink-2)',
            }}>
              <PriorityBadge p={b.sev} size="sm" />
              <span style={{ flex: 1 }}>{b.text}</span>
              <Icon.Chevron size={14} color="var(--muted)" />
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        <KPI label="Pessoas assistidas" value={totalPeople} sub="+24 nas últimas 6h"
             icon={<Icon.Users size={16} color="var(--muted)" />} />
        <KPI label="Voluntários ativos" value={`${volsActive}/${vols.length}`} sub={`${vols.filter(v=>v.status==='disponível').length} disponíveis`}
             accent="var(--p4)" icon={<Icon.Volunteer size={16} color="var(--muted)" />} />
        <KPI label="Abrigos monitorados" value={sheltersMonitored} sub="1 com alerta crítico"
             icon={<Icon.House size={16} color="var(--muted)" />} />
        <KPI label="Casos abertos" value={cases.filter(c=>c.status!=='fechado').length} sub={`${criticalAlerts} em P1`}
             accent={criticalAlerts ? 'var(--p1)' : 'var(--ink)'} icon={<Icon.Cases size={16} color="var(--muted)" />} />
      </div>

      {/* Trucks in transit */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 10, padding: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon.Truck size={18} color="var(--p5)" />
            <span style={{ fontSize: 15, fontWeight: 700 }}>Comboios em trânsito</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{trucks.length} em rota</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {trucks.map(t => (
            <div key={t.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{t.label}</span>
                <span style={{ color: 'var(--p5)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>ETA {t.etaMin} min</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                {t.origin} → {t.dest}
              </div>
              <div style={{ height: 6, background: 'var(--line-2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${t.progress}%`, height: '100%', background: 'var(--p5)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable P1 cases */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 10, padding: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>P1 acionáveis agora</div>
          <button onClick={() => actions.goTo('cases', { filter: 'P1' })} style={{
            background: 'transparent', border: 'none', color: 'var(--p5)',
            fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
          }}>Ver todos <Icon.Chevron size={14} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {p1Cases.map(c => (
            <button key={c.id} onClick={() => actions.goTo('cases', { focus: c.id })} style={{
              textAlign: 'left', background: 'var(--surface-2)',
              border: '1px solid var(--line-2)', borderLeft: '4px solid var(--p1)',
              borderRadius: 6, padding: '10px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <PriorityBadge p="P1" size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Icon.Pin size={12} /> {c.location} · {c.people} pessoa{c.people!==1?'s':''}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: c.team.length ? 'var(--p4)' : 'var(--p2)', fontWeight: 600 }}>
                {c.team.length ? `${c.team.length} alocado${c.team.length>1?'s':''}` : 'Sem equipe'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export */}
      <div style={{
        background: 'var(--surface)', border: '1px dashed var(--line)',
        borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Relatório de situação</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon.Lock size={12} /> Dados agregados/anonimizados (LGPD) · formato COBRADE
          </div>
        </div>
        <Button variant="secondary" size="sm"
                icon={<Icon.Download size={14} />}
                onClick={() => actions.exportReport()}>PDF/CSV</Button>
      </div>
    </div>
  );
}

window.ScreenDashboard = ScreenDashboard;
