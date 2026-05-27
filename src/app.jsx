// CrisisFlow / SOS Coord — Main App
// Single-page React app. Tablet-friendly mobile-first.

const { useState: useS, useEffect: useE, useCallback: useC, useRef: useR } = React;

function App() {
  // ---------- STATE ----------
  const [cases, setCases] = useS(window.CFData.INITIAL_CASES);
  const [volunteers, setVolunteers] = useS(window.CFData.INITIAL_VOLUNTEERS);
  const [supplies, setSupplies] = useS(window.CFData.INITIAL_SUPPLIES);

  const [tab, setTab] = useS('dashboard');
  const [casesFilter, setCasesFilter] = useS(null);
  const [casesFocus, setCasesFocus] = useS(null);
  const [moreSub, setMoreSub] = useS(null);

  const [drag, setDrag] = useS(null); // {kind, id}
  const [toasts, setToasts] = useS([]);
  const [history, setHistory] = useS([]); // undo stack
  const [online, setOnline] = useS(true);
  const [lastSync, setLastSync] = useS(new Date());
  const [volunteerMobileOpen, setVolunteerMobileOpen] = useS(false);
  const [confirmOpen, setConfirmOpen] = useS(null); // {title, body, onConfirm}

  // Heartbeat: refresh "last sync" label every 30s + Ctrl+Z listener
  useE(() => {
    const t = setInterval(() => setLastSync(new Date()), 30000);
    
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        // Trigger undo on the last toast if exists
        setToasts(currentToasts => {
          const lastUndoable = [...currentToasts].reverse().find(x => x.undo);
          if (lastUndoable) {
            setTimeout(() => undoLast(lastUndoable.id), 0);
          }
          return currentToasts;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(t);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undoLast]);

  // ---------- TOASTS ----------
  const dismissToast = useC((id) => {
    setToasts(ts => ts.filter(t => t.id !== id));
  }, []);

  const toast = useC((opts) => {
    const id = Date.now() + Math.random();
    
    // Intercept success messages when offline to show the localized warning required by RU-09
    let msg = opts.msg;
    let type = opts.type || 'success';
    let duration = opts.duration || (type === 'success' ? 5000 : 30000);
    let undo = opts.undo;
    
    if (!online && type === 'success' && !opts.bypassOfflineCheck) {
      msg = 'Sem conexão. Seu registro foi salvo localmente e será sincronizado automaticamente quando a rede voltar.';
      type = 'warn';
      duration = 4500;
      undo = false; // Disable undo for offline warnings as they are auto-saved locally
    }

    const t = { id, msg, type, undo };
    setToasts(ts => [...ts, t]);
    setTimeout(() => {
      setToasts(ts => ts.filter(x => x.id !== id));
    }, duration);
    return id;
  }, [online]);

  const undoLast = useC((toastId) => {
    const h = history[history.length - 1];
    if (!h) return;
    h.undo();
    setHistory(hh => hh.slice(0, -1));
    dismissToast(toastId);
    toast({ msg: 'Ação desfeita.', type: 'success', duration: 3000 });
  }, [history, dismissToast, toast]);

  // ---------- ACTIONS ----------
  const assignVolunteer = useC((volId, caseId) => {
    const v = volunteers.find(x => x.id === volId);
    const c = cases.find(x => x.id === caseId);
    if (!v || !c) return false;
    if (v.status === 'descanso') {
      toast({ msg: `${v.name.split(' ')[0]} está em descanso até ${v.restUntil}. Escolha um voluntário disponível ou aguarde o fim do descanso.`, type: 'warn' });
      return false;
    }
    if (c.team.includes(volId)) {
      toast({ msg: `${v.name.split(' ')[0]} já está alocado neste caso.`, type: 'warn', duration: 3000 });
      return false;
    }

    const prevVol = {...v};
    const prevCases = cases.map(cx => ({ ...cx, team: [...cx.team] }));

    setVolunteers(vs => vs.map(x => x.id === volId
      ? { ...x, status: 'em-missão', caseId } : x));
    setCases(cs => cs.map(x => x.id === caseId
      ? { ...x, team: [...x.team, volId] } : x));

    setHistory(h => [...h, {
      undo: () => {
        setVolunteers(vs => vs.map(x => x.id === volId ? prevVol : x));
        setCases(prevCases);
      }
    }]);

    toast({
      msg: `${v.name.split(' ')[0]} alocado a ${c.id} · ${c.location.split('·')[0].trim()}`,
      undo: true,
    });
    return true;
  }, [volunteers, cases, toast]);

  const changeVolunteerStatus = useC((volId, newStatus) => {
    const v = volunteers.find(x => x.id === volId);
    if (!v || v.status === newStatus) return;

    if (newStatus === 'em-missão' && v.status === 'descanso') {
      toast({ 
        msg: `${v.name.split(' ')[0]} está em descanso até ${v.restUntil || 'o fim do período'}. Escolha um voluntário disponível ou aguarde o fim do descanso.`, 
        type: 'warn' 
      });
      return;
    }

    const prevVol = { ...v };
    const prevCases = cases.map(c => ({ ...c, team: [...c.team] }));

    if (v.caseId && newStatus !== 'em-missão') {
      setCases(cs => cs.map(c => 
        c.id === v.caseId ? { ...c, team: c.team.filter(id => id !== volId) } : c
      ));
    }

    setVolunteers(vs => vs.map(x => {
      if (x.id !== volId) return x;
      let extra = {};
      if (newStatus === 'descanso' && x.status !== 'descanso') {
        const d = new Date();
        d.setHours(d.getHours() + 2);
        extra.restUntil = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        extra.caseId = undefined;
      }
      if (newStatus === 'disponível') {
        extra.restUntil = undefined;
        extra.caseId = undefined;
      }
      return { ...x, status: newStatus, ...extra };
    }));

    setHistory(h => [...h, {
      undo: () => {
        setVolunteers(vs => vs.map(x => x.id === volId ? prevVol : x));
        setCases(prevCases);
      }
    }]);

    toast({ 
      msg: `${v.name.split(' ')[0]} agora está: ${newStatus}.`, 
      undo: true 
    });
  }, [volunteers, cases, toast]);

  const updateSupplyLimits = useC((supplyId, newMin, newMax) => {
    setSupplies(current => current.map(s => 
      s.id === supplyId ? { ...s, min: newMin, max: newMax } : s
    ));
    toast({ msg: `Limites de alerta atualizados com sucesso.`, duration: 3000 });
  }, [toast]);

  const registerDonations = useC((donations, shelter) => {
    setSupplies(currentSupplies => {
      let next = [...currentSupplies];
      donations.forEach(d => {
        const targetName = d.name.toLowerCase() === 'outro' ? d.description : d.name;
        const idx = next.findIndex(s => 
          s.name.toLowerCase() === targetName.toLowerCase() &&
          s.shelter.toLowerCase() === shelter.toLowerCase()
        );
        const qty = parseFloat(d.qty) || 0;
        if (idx >= 0) {
          next[idx] = { ...next[idx], current: next[idx].current + qty };
        } else {
          next.push({
            id: 'S-' + Math.floor(Math.random()*10000),
            name: targetName,
            shelter: shelter,
            ward: 'Geral',
            current: qty,
            min: qty, max: qty * 2,
            unit: d.unit,
          });
        }
      });
      return next;
    });
  }, []);

  const registerConsumptions = useC((consumptions, shelter) => {
    setSupplies(currentSupplies => {
      let next = [...currentSupplies];
      consumptions.forEach(c => {
        const targetName = c.name.toLowerCase() === 'outro' ? c.description : c.name;
        const idx = next.findIndex(s => 
          s.name.toLowerCase() === targetName.toLowerCase() &&
          s.shelter.toLowerCase() === shelter.toLowerCase()
        );
        const qty = parseFloat(c.qty) || 0;
        if (idx >= 0) {
          next[idx] = { ...next[idx], current: Math.max(0, next[idx].current - qty) };
        }
      });
      return next;
    });
  }, []);

  const exportReport = useC(() => {
    setConfirmOpen({
      title: 'Exportar relatório de situação',
      body: (
        <div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
            Resumo a ser exportado:
          </div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, lineHeight: 1.8 }}>
            <li>{cases.filter(c => c.status !== 'fechado').length} casos abertos</li>
            <li>{volunteers.length} voluntários no evento</li>
            <li>{supplies.filter(s => s.current/s.max < 0.2).length} suprimentos críticos</li>
            <li>Formato compatível COBRADE</li>
            <li>Dados agregados/anonimizados (LGPD)</li>
          </ul>
          <div style={{
            marginTop: 12, padding: 10, background: 'var(--surface-2)',
            borderRadius: 6, fontSize: 12, color: 'var(--ink-2)',
            display: 'flex', alignItems: 'center', gap: 6, borderLeft: '2px solid var(--p2)',
          }}>
            <Icon.Alert size={14} color="var(--p2)" />
            Falta o código COBRADE do evento. Toque em "Confirmar" para usar o código padrão (1.2.1.1.1).
          </div>
        </div>
      ),
      primary: { label: 'Confirmar e exportar', danger: false },
      onConfirm: () => {
        setConfirmOpen(null);
        toast({ msg: 'Relatório COBRADE gerado · 2 arquivos prontos para download.' });
      }
    });
  }, [cases, volunteers, supplies, toast]);

  const actions = {
    toast,
    setDrag,
    assignVolunteer,
    changeVolunteerStatus,
    updateSupplyLimits,
    registerDonations,
    registerConsumptions,
    exportReport,
    goTo: (newTab, opts = {}) => {
      setTab(newTab);
      if (newTab === 'cases') {
        setCasesFilter(opts.filter || null);
        setCasesFocus(opts.focus || null);
      }
      if (newTab === 'more') {
        setMoreSub(opts.sub || null);
      }
    },
    openVolunteerMobile: () => setVolunteerMobileOpen(true),
  };

  const state = { cases, volunteers, supplies, drag, tab };

  // ---------- CONNECTIVITY TEST ----------
  const toggleOnline = () => {
    setOnline(o => {
      const next = !o;
      if (!next) {
        toast({ msg: 'Sem conexão. Seu registro foi salvo localmente e será sincronizado automaticamente quando a rede voltar.', type: 'warn', duration: 4500 });
      } else {
        setLastSync(new Date());
        toast({ msg: 'Conexão restabelecida · sincronizado.', duration: 3000, bypassOfflineCheck: true });
      }
      return next;
    });
  };

  // ---------- LAYOUT ----------
  const openP1 = cases.filter(c => c.priority === 'P1' && c.status !== 'fechado').length;
  const idleVols = volunteers.filter(v => v.status === 'disponível').length;
  const openCases = cases.filter(c => c.status !== 'fechado').length;

  return (
    <window.UI.ToastCtx.Provider value={{ toast, dismissToast }}>
      <div style={{
        background: 'var(--bg)',
        borderRadius: 18,
        maxWidth: 480, margin: '0 auto',
        minHeight: '90vh',
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Top status bar — system state */}
        <TopBar online={online} lastSync={lastSync} criticalAlerts={openP1}
                onToggleOnline={toggleOnline} />

        {/* Offline banner */}
        {!online && (
          <div style={{
            background: 'var(--p2)', color: '#fff',
            padding: '8px 16px', fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon.WifiOff size={14} color="#fff" />
            Modo offline · registros salvos localmente serão sincronizados quando a rede voltar
          </div>
        )}

        {/* Content */}
        <div className="scroll-area" style={{
          flex: 1, padding: 16, overflowY: 'auto', overflowX: 'hidden',
          paddingBottom: 88,
        }}>
          {tab === 'dashboard'  && <ScreenDashboard state={state} actions={actions} />}
          {tab === 'cases'      && <ScreenCases state={state} actions={actions} filter={casesFilter} focusId={casesFocus} />}
          {tab === 'volunteers' && <ScreenVolunteers state={state} actions={actions} />}
          {tab === 'supplies'   && <ScreenSupplies state={state} actions={actions} />}
          {tab === 'more'       && <ScreenMore sub={moreSub} actions={actions} />}
        </div>

        {/* Bottom navigation */}
        <BottomNav tab={tab} onChange={(t) => actions.goTo(t)}
                   badges={{ cases: openCases, volunteers: idleVols }} />

        {/* Toasts */}
        <window.UI.ToastHost toasts={toasts} onDismiss={dismissToast} onUndo={undoLast} />

        {/* Confirm modal */}
        {confirmOpen && (
          <window.UI.Modal
            open={true}
            title={confirmOpen.title}
            onClose={() => setConfirmOpen(null)}
            primary={{ label: confirmOpen.primary.label, onClick: confirmOpen.onConfirm }}
            danger={confirmOpen.primary.danger}>
            {confirmOpen.body}
          </window.UI.Modal>
        )}

        {/* Volunteer mobile demo */}
        {volunteerMobileOpen && (
          <ScreenVolunteerMobile onClose={() => setVolunteerMobileOpen(false)} />
        )}
      </div>

      {/* Side helper text outside the frame */}
      <div style={{
        position: 'fixed', left: 16, bottom: 16,
        fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace',
        maxWidth: 220, lineHeight: 1.5, pointerEvents: 'none',
      }}>
        CrisisFlow · SOS Coord<br/>
        Protótipo navegável · arraste voluntários para casos · clique no ícone de conexão para simular offline
      </div>
    </window.UI.ToastCtx.Provider>
  );
}

// ============ TOP BAR ============
function TopBar({ online, lastSync, criticalAlerts, onToggleOnline }) {
  const ago = Math.max(0, Math.round((Date.now() - lastSync.getTime()) / 1000));
  const agoLabel = ago < 60 ? `${ago}s` : `${Math.floor(ago/60)}min`;

  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid var(--line)',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: 'var(--ink)',
          color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800,
          fontSize: 11, letterSpacing: 0.5,
        }}>SOS</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>Crisis Flow</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500, letterSpacing: 0.3 }}>
            CrisisFlow · Coord. Tático
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Connectivity */}
        <button onClick={onToggleOnline} title="Simular offline" style={{
          background: 'transparent', border: 'none', padding: 6, borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 4,
          color: online ? 'var(--p4)' : 'var(--p2)', fontSize: 11, fontWeight: 600,
        }}>
          {online ? <Icon.Wifi size={14} /> : <Icon.WifiOff size={14} />}
          <span style={{ display: 'none' }}>{online ? 'online' : 'offline'}</span>
        </button>

        {/* Last sync */}
        <div style={{
          fontSize: 10, color: 'var(--muted)', display: 'flex',
          alignItems: 'center', gap: 4, fontVariantNumeric: 'tabular-nums',
        }}>
          <Icon.Sync size={12} /> {agoLabel}
        </div>

        {/* Alerts */}
        <div style={{ position: 'relative' }}>
          <Icon.Bell size={18} color="var(--ink-2)" />
          {criticalAlerts > 0 && (
            <span className="crit-pulse" style={{
              position: 'absolute', top: -4, right: -6,
              background: 'var(--p1)', color: '#fff',
              fontSize: 10, fontWeight: 700,
              minWidth: 16, height: 16, borderRadius: 8,
              padding: '0 4px',
              display: 'grid', placeItems: 'center',
              border: '2px solid #fff',
            }}>{criticalAlerts}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ BOTTOM NAV ============
function BottomNav({ tab, onChange, badges }) {
  const tabs = [
    { id: 'dashboard',  label: 'Comando',     icon: Icon.Dashboard },
    { id: 'cases',      label: 'Casos',       icon: Icon.Cases, badge: badges.cases },
    { id: 'volunteers', label: 'Voluntários', icon: Icon.Volunteer, badge: badges.volunteers, badgeColor: 'var(--p4)' },
    { id: 'supplies',   label: 'Suprimentos', icon: Icon.Box },
    { id: 'more',       label: 'Mais',        icon: Icon.More },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: '#fff', borderTop: '1px solid var(--line)',
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
      zIndex: 100,
    }}>
      {tabs.map(t => {
        const ActiveIcon = t.icon;
        const isActive = tab === t.id;
        return (
          <button key={t.id} 
            onClick={() => onChange(t.id)} 
            onDragEnter={() => onChange(t.id)}
            onDragOver={(e) => e.preventDefault()}
            data-tab-id={t.id}
            style={{
            background: 'transparent', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '8px 4px', minHeight: 56,
            color: isActive ? 'var(--ink)' : 'var(--muted)',
            cursor: 'pointer', position: 'relative',
            borderTop: isActive ? '2px solid var(--ink)' : '2px solid transparent',
            marginTop: -1,
          }}>
            <div style={{ position: 'relative' }}>
              <ActiveIcon size={20} strokeWidth={isActive ? 2.2 : 1.7} />
              {t.badge ? (
                <span style={{
                  position: 'absolute', top: -6, right: -10,
                  background: t.badgeColor || 'var(--p1)', color: '#fff',
                  fontSize: 9, fontWeight: 700,
                  minWidth: 14, height: 14, borderRadius: 7,
                  padding: '0 4px',
                  display: 'grid', placeItems: 'center',
                  border: '2px solid #fff',
                  fontVariantNumeric: 'tabular-nums',
                }}>{t.badge}</span>
              ) : null}
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
