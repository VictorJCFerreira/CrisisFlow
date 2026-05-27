// Volunteers — Allocation
// Draggable chips grouped by status (HTML5 drag & touch fallback)

function ScreenVolunteers({ state, actions }) {
  const { Chip, KPI } = window.UI;
  const SPECIALTIES = window.CFData.SPECIALTIES;
  const [specFilter, setSpecFilter] = React.useState('TODAS');

  const filtered = state.volunteers.filter(v =>
    specFilter === 'TODAS' ? true : v.specialty === specFilter
  );

  const groups = {
    'disponível': filtered.filter(v => v.status === 'disponível'),
    'em-missão':  filtered.filter(v => v.status === 'em-missão'),
    'descanso':   filtered.filter(v => v.status === 'descanso'),
  };

  const totalIdle = state.volunteers.filter(v => v.status === 'disponível').length;
  const totalActive = state.volunteers.filter(v => v.status === 'em-missão').length;
  const totalRest = state.volunteers.filter(v => v.status === 'descanso').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>Voluntários</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          Arraste um chip e solte sobre um caso para alocar
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <KPI label="Disponível" value={totalIdle} accent="var(--p4)" />
        <KPI label="Em missão" value={totalActive} accent="var(--p5)" />
        <KPI label="Descanso" value={totalRest} accent="var(--gray)" />
      </div>

      {/* Specialty filter */}
      <div className="scroll-area" style={{
        display: 'flex', gap: 6, overflowX: 'auto', margin: '0 -16px', padding: '4px 16px',
      }}>
        <Chip active={specFilter === 'TODAS'} onClick={() => setSpecFilter('TODAS')}>Todas</Chip>
        {SPECIALTIES.map(s => (
          <Chip key={s} active={specFilter === s} onClick={() => setSpecFilter(s)}>
            {s}
          </Chip>
        ))}
      </div>

      {/* Groups */}
      <VolunteerGroup title="Disponíveis" tint="var(--p4)" vols={groups['disponível']}
                      state={state} actions={actions} status="disponível" />
      <VolunteerGroup title="Em missão" tint="var(--p5)" vols={groups['em-missão']}
                      state={state} actions={actions} status="em-missão" />
      <VolunteerGroup title="Descanso" tint="var(--gray)" vols={groups['descanso']}
                      state={state} actions={actions} status="descanso" />
    </div>
  );
}

function VolunteerGroup({ title, tint, vols, state, actions, status }) {
  const onDragOver = (e) => { e.preventDefault(); };
  const onDrop = (e) => {
    e.preventDefault();
    const volId = state.drag?.id || e.dataTransfer.getData('text/plain');
    if (volId && status) {
      actions.changeVolunteerStatus(volId, status);
    }
  };
  if (!vols || vols.length === 0) {
    return (
      <div 
        data-status={status}
        onDragOver={onDragOver}
        onDrop={onDrop}
        style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 10, padding: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: tint }} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>0</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
          Nenhum voluntário neste grupo
        </div>
      </div>
    );
  }
  return (
    <div 
      data-status={status}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 10, padding: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: tint }} />
        <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: tint,
          background: `${tint}15`, borderRadius: 10, padding: '1px 7px',
        }}>{vols.length}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {vols.map(v => (
          <VolunteerChip key={v.id} v={v} state={state} actions={actions} />
        ))}
      </div>
    </div>
  );
}

function VolunteerChip({ v, state, actions }) {
  const draggable = true; // All volunteers can be dragged to change status
  const [dragging, setDragging] = React.useState(false);
  const ref = React.useRef(null);

  const statusColor = v.status === 'disponível' ? 'var(--p4)'
                    : v.status === 'em-missão' ? 'var(--p5)'
                    : 'var(--gray)';

  const onDragStart = (e) => {
    if (!draggable) return;
    setDragging(true);
    actions.setDrag({ kind: 'volunteer', id: v.id });
    try { e.dataTransfer.setData('text/plain', v.id); } catch {}
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragEnd = () => {
    setDragging(false);
    actions.setDrag(null);
  };

  // Touch drag support (mobile)
  const touchRef = React.useRef({ active: false, x: 0, y: 0, ghost: null });
  const onTouchStart = (e) => {
    if (!draggable) return;
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
      // create ghost
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

      // Highlight drop target
      const el = document.elementFromPoint(t.clientX, t.clientY);
      
      // Switch tab on hover during drag
      const navBtn = el && el.closest && el.closest('[data-tab-id]');
      if (navBtn) {
        const tabId = navBtn.getAttribute('data-tab-id');
        if (tabId && tabId !== state.tab) {
          actions.goTo(tabId);
        }
      }

      const card = el && el.closest && el.closest('[data-case-id]');
      const group = el && el.closest && el.closest('[data-status]');
      document.querySelectorAll('[data-case-id], [data-status]').forEach(c => c.classList.remove('drop-target-active'));
      if (card) card.classList.add('drop-target-active');
      if (group) group.classList.add('drop-target-active');
    }
  };
  const onTouchEnd = (e) => {
    if (!touchRef.current.active) return;
    const t = e.changedTouches[0];
    if (touchRef.current.ghost) {
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const card = el && el.closest && el.closest('[data-case-id]');
      const group = el && el.closest && el.closest('[data-status]');
      
      if (card) {
        actions.assignVolunteer(v.id, card.getAttribute('data-case-id'));
      } else if (group) {
        actions.changeVolunteerStatus(v.id, group.getAttribute('data-status'));
      }
      document.body.removeChild(touchRef.current.ghost);
    }
    document.querySelectorAll('[data-case-id], [data-status]').forEach(c => c.classList.remove('drop-target-active'));
    touchRef.current = { active: false, x: 0, y: 0, ghost: null };
    setDragging(false);
    actions.setDrag(null);
  };

  const linkedCase = v.caseId ? state.cases.find(c => c.id === v.caseId) : null;

  return (
    <div
      ref={ref}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={() => {
        if (v.status === 'descanso') {
          actions.toast({ msg: `${v.name.split(' ')[0]} está em descanso até ${v.restUntil}. Escolha um voluntário disponível ou aguarde.`, type: 'warn' });
        }
      }}
      className={dragging ? 'drag-ghost' : ''}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 10px',
        background: '#fff',
        border: `1px solid var(--line)`,
        borderLeft: `3px solid ${statusColor}`,
        borderRadius: 6,
        fontSize: 13, fontWeight: 600,
        color: 'var(--ink-2)',
        minHeight: 36,
        cursor: draggable ? 'grab' : (v.status === 'descanso' ? 'not-allowed' : 'default'),
        opacity: v.status === 'descanso' ? 0.65 : 1,
        touchAction: draggable ? 'none' : 'auto',
        userSelect: 'none',
      }}
      title={`${v.name} · ${v.specialty}${linkedCase ? ' · ' + linkedCase.id : ''}`}
    >
      {draggable && <Icon.Drag size={12} color="var(--muted)" />}
      <span>{v.name.split(' ')[0]}</span>
      <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>· {v.specialty}</span>
      {linkedCase && (
        <span style={{
          fontSize: 10, background: 'var(--p5-bg)', color: 'var(--p5)',
          padding: '1px 5px', borderRadius: 3, fontFamily: 'JetBrains Mono, monospace',
        }}>{linkedCase.id}</span>
      )}
      {v.status === 'descanso' && (
        <span style={{ fontSize: 10, color: 'var(--gray)', fontWeight: 500 }}>
          até {v.restUntil}
        </span>
      )}
    </div>
  );
}

window.ScreenVolunteers = ScreenVolunteers;
