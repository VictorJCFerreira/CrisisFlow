// Cases screen — Triagem Hospitalar
// Each case card has a left color border and is a drop target for volunteer chips.

function ScreenCases({ state, actions, filter, focusId }) {
  const { PriorityBadge, Chip, Button } = window.UI;
  const PRI = window.CFData.PRIORITIES;
  const [activeFilter, setActiveFilter] = React.useState(filter || 'TODOS');

  React.useEffect(() => { if (filter) setActiveFilter(filter); }, [filter]);

  const filtered = state.cases.filter(c => {
    if (c.status === 'fechado') return false;
    if (activeFilter === 'TODOS') return true;
    if (activeFilter === 'SEM_EQUIPE') return c.team.length === 0;
    return c.priority === activeFilter;
  }).sort((a, b) => a.priority.localeCompare(b.priority));

  const counts = {
    TODOS: state.cases.filter(c => c.status !== 'fechado').length,
    SEM_EQUIPE: state.cases.filter(c => c.team.length === 0 && c.status !== 'fechado').length,
    P1: state.cases.filter(c => c.priority === 'P1' && c.status !== 'fechado').length,
    P2: state.cases.filter(c => c.priority === 'P2' && c.status !== 'fechado').length,
    P3: state.cases.filter(c => c.priority === 'P3' && c.status !== 'fechado').length,
    P4: state.cases.filter(c => c.priority === 'P4' && c.status !== 'fechado').length,
    P5: state.cases.filter(c => c.priority === 'P5' && c.status !== 'fechado').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>Casos · triagem</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {counts.TODOS} abertos · ordenados por severidade
          </div>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 600, color: 'var(--muted)',
          background: 'var(--gray-bg)', padding: '4px 8px', borderRadius: 4,
          display: 'flex', alignItems: 'center', gap: 4, marginTop: 4,
        }} title="Dados pessoais protegidos em conformidade com a LGPD">
          <span>🔒</span> LGPD
        </div>
      </div>

      {/* Filters */}
      <div className="scroll-area" style={{
        display: 'flex', gap: 6, overflowX: 'auto',
        margin: '0 -16px', padding: '4px 16px',
      }}>
        <Chip active={activeFilter === 'TODOS'} onClick={() => setActiveFilter('TODOS')}
              color="var(--ink-2)" count={counts.TODOS}>Todos</Chip>
        <Chip active={activeFilter === 'SEM_EQUIPE'} onClick={() => setActiveFilter('SEM_EQUIPE')}
              color="var(--p2)" count={counts.SEM_EQUIPE}>Sem equipe</Chip>
        {['P1','P2','P3','P4','P5'].map(p => (
          <Chip key={p} active={activeFilter === p} onClick={() => setActiveFilter(p)}
                color={PRI[p].color} count={counts[p]}>{p}</Chip>
        ))}
      </div>

      {/* Available Volunteers Tray at the top of the list (close to P1 cases) */}
      <div style={{
        padding: '10px 12px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon.Volunteer size={13} color="var(--p4)" />
            Voluntários Disponíveis ({state.volunteers.filter(v => v.status === 'disponível').length})
          </span>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>Arraste para um caso abaixo</span>
        </div>
        <div className="scroll-area" style={{
          display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4
        }}>
          {state.volunteers.filter(v => v.status === 'disponível').map(v => (
            <CaseVolunteerChip key={v.id} v={v} state={state} actions={actions} />
          ))}
          {state.volunteers.filter(v => v.status === 'disponível').length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', padding: '4px 0' }}>
              Nenhum voluntário disponível.
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(c => (
          <CaseCard key={c.id} c={c} state={state} actions={actions} focused={focusId === c.id} />
        ))}
        {filtered.length === 0 && (
          <div style={{
            background: 'var(--surface-2)', border: '1px dashed var(--line)',
            borderRadius: 10, padding: 24, textAlign: 'center',
            color: 'var(--muted)', fontSize: 13,
          }}>
            Nenhum caso para esse filtro.
          </div>
        )}
      </div>
    </div>
  );
}

function CaseVolunteerChip({ v, state, actions }) {
  const [dragging, setDragging] = React.useState(false);
  const ref = React.useRef(null);

  const onDragStart = (e) => {
    setDragging(true);
    actions.setDrag({ kind: 'volunteer', id: v.id });
    try { e.dataTransfer.setData('text/plain', v.id); } catch {}
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragEnd = () => {
    setDragging(false);
    actions.setDrag(null);
  };

  // Touch support for dragging within the same screen
  const touchRef = React.useRef({ active: false, x: 0, y: 0, ghost: null });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { active: true, x: t.clientX, y: t.clientY, ghost: null };
    actions.setDrag({ kind: 'volunteer', id: v.id });
  };
  const onTouchMove = (e) => {
    if (!touchRef.current.active) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - touchRef.current.x);
    const dy = Math.abs(t.clientY - touchRef.current.y);
    if (!touchRef.current.ghost && (dx > 4 || dy > 4)) {
      const ghost = ref.current.cloneNode(true);
      ghost.style.position = 'fixed';
      ghost.style.left = (t.clientX - 60) + 'px';
      ghost.style.top = (t.clientY - 18) + 'px';
      ghost.style.pointerEvents = 'none';
      ghost.style.opacity = '0.9';
      ghost.style.zIndex = '500';
      ghost.style.transform = 'scale(1.05)';
      document.body.appendChild(ghost);
      touchRef.current.ghost = ghost;
      setDragging(true);
    }
    if (touchRef.current.ghost) {
      touchRef.current.ghost.style.left = (t.clientX - 60) + 'px';
      touchRef.current.ghost.style.top = (t.clientY - 18) + 'px';

      const el = document.elementFromPoint(t.clientX, t.clientY);
      const card = el && el.closest && el.closest('[data-case-id]');
      document.querySelectorAll('[data-case-id]').forEach(c => c.classList.remove('drop-target-active'));
      if (card) card.classList.add('drop-target-active');
    }
  };
  const onTouchEnd = (e) => {
    if (!touchRef.current.active) return;
    const t = e.changedTouches[0];
    if (touchRef.current.ghost) {
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const card = el && el.closest && el.closest('[data-case-id]');
      if (card) {
        actions.assignVolunteer(v.id, card.getAttribute('data-case-id'));
      }
      document.body.removeChild(touchRef.current.ghost);
    }
    document.querySelectorAll('[data-case-id]').forEach(c => c.classList.remove('drop-target-active'));
    touchRef.current = { active: false, x: 0, y: 0, ghost: null };
    setDragging(false);
    actions.setDrag(null);
  };

  return (
    <div
      ref={ref}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={dragging ? 'drag-ghost' : ''}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 10px',
        background: '#fff',
        border: `1px solid var(--line)`,
        borderLeft: `3px solid var(--p4)`,
        borderRadius: 6,
        fontSize: 13, fontWeight: 600,
        color: 'var(--ink-2)',
        minHeight: 36,
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
      title={`${v.name} · ${v.specialty}`}
    >
      <Icon.Drag size={12} color="var(--muted)" />
      <span>{v.name.split(' ')[0]}</span>
      <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>· {v.specialty}</span>
    </div>
  );
}

function CaseCard({ c, state, actions, focused }) {
  const { PriorityBadge } = window.UI;
  const PRI = window.CFData.PRIORITIES;
  const [isOver, setIsOver] = React.useState(false);
  const [justAssigned, setJustAssigned] = React.useState(false);

  const handleDragOver = (e) => {
    if (state.drag?.kind === 'volunteer') {
      e.preventDefault();
      setIsOver(true);
    }
  };
  const handleDragLeave = () => setIsOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    if (state.drag?.kind === 'volunteer') {
      const ok = actions.assignVolunteer(state.drag.id, c.id);
      if (ok) {
        setJustAssigned(true);
        setTimeout(() => setJustAssigned(false), 1400);
      }
    }
  };

  const teamVols = c.team.map(id => state.volunteers.find(v => v.id === id)).filter(Boolean);

  return (
    <div
      data-case-id={c.id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={isOver ? 'drop-target-active' : ''}
      style={{
        background: 'var(--surface)',
        border: focused ? '2px solid var(--ink)' : '1px solid var(--line)',
        borderLeft: `5px solid ${PRI[c.priority].color}`,
        borderRadius: 10, padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
        transition: 'background 160ms ease, outline 160ms ease',
        position: 'relative',
        outline: justAssigned ? '2px solid var(--p4)' : undefined,
      }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PriorityBadge p={c.priority} />
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {c.id}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)',
                       display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon.Clock size={12} /> {c.openedMin}min
        </span>
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
        {c.title}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontSize: 13, color: 'var(--muted)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon.Pin size={13} /> {c.location}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon.Users size={13} /> {c.people} pessoa{c.people !== 1 ? 's' : ''}
        </span>
      </div>

      {c.note && (
        <div style={{
          fontSize: 12, color: 'var(--ink-2)',
          background: 'var(--surface-2)', borderRadius: 6, padding: '6px 8px',
          borderLeft: '2px solid var(--line)',
        }}>{c.note}</div>
      )}

      {/* Needs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {c.needs.map((n, i) => (
          <span key={i} style={{
            fontSize: 11, fontWeight: 500,
            background: 'var(--surface-2)', color: 'var(--ink-2)',
            border: '1px solid var(--line-2)', borderRadius: 4,
            padding: '2px 6px',
          }}>{n}</span>
        ))}
      </div>

      {/* Team / drop zone */}
      <div style={{
        borderTop: '1px dashed var(--line-2)', paddingTop: 8,
        display: 'flex', alignItems: 'center', gap: 8, minHeight: 32,
      }}>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600,
                       textTransform: 'uppercase', letterSpacing: 0.5 }}>Equipe</span>
        {teamVols.length === 0 ? (
          <span style={{
            fontSize: 12, color: isOver ? 'var(--p5)' : 'var(--p2)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {isOver ? '↓ soltar voluntário aqui' : 'Sem equipe · arraste voluntário'}
          </span>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, flex: 1 }}>
            {teamVols.map(v => (
              <span key={v.id} title={v.name} style={{
                fontSize: 11, background: 'var(--p5-bg)', color: 'var(--p5)',
                borderRadius: 12, padding: '2px 8px', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: 3, background: 'var(--p5)' }} />
                {v.name.split(' ')[0]}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.changeVolunteerStatus(v.id, 'disponível');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 2,
                    marginRight: -4,
                    padding: 2,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'background 150ms, transform 100ms',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(19, 81, 180, 0.15)';
                    e.currentTarget.style.transform = 'scale(1.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title={`Remover ${v.name} deste caso`}
                >
                  <Icon.Close size={10} strokeWidth={3} color="var(--p5)" />
                </span>
              </span>
            ))}
          </div>
        )}
        {justAssigned && (
          <span style={{
            marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: 'var(--p4)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Icon.Check size={12} strokeWidth={3} /> alocado
          </span>
        )}
      </div>
    </div>
  );
}

window.ScreenCases = ScreenCases;
