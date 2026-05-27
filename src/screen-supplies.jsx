// Supplies — stock with dynamic-color bars + batch donation registration

function ScreenSupplies({ state, actions }) {
  const { StockBar, Button, Modal } = window.UI;
  const [batchOpen, setBatchOpen] = React.useState(false);
  const [batchOutOpen, setBatchOutOpen] = React.useState(false);
  const [editLimitItem, setEditLimitItem] = React.useState(null);
  const [minVal, setMinVal] = React.useState('');
  const [maxVal, setMaxVal] = React.useState('');

  const grouped = {};
  state.supplies.forEach(s => {
    const k = s.shelter;
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(s);
  });

  const criticalCount = state.supplies.filter(s => s.current < s.min).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>Suprimentos</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {state.supplies.length} itens · {criticalCount} críticos
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button onClick={() => setBatchOutOpen(true)} variant="danger" icon={<Icon.Minus size={14} strokeWidth={2.6} />}>
            Registrar saídas
          </Button>
          <Button onClick={() => setBatchOpen(true)} icon={<Icon.Plus size={14} strokeWidth={2.6} />}>
            Registrar doações
          </Button>
        </div>
      </div>

      {/* Critical alerts strip */}
      {criticalCount > 0 && (
        <div style={{
          background: 'var(--p1-bg)', border: '1px solid #f5c2c5',
          borderLeft: '4px solid var(--p1)',
          borderRadius: 10, padding: 12,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--p1)',
            display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon.Alert size={14} color="var(--p1)" /> {criticalCount} insumo{criticalCount > 1 ? 's' : ''} abaixo do mínimo
          </div>
          {state.supplies.filter(s => s.current < s.min).map(s => (
            <div key={s.id} style={{
              background: '#fff', borderRadius: 6, padding: '6px 10px',
              fontSize: 12, color: 'var(--ink-2)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>{s.name} · {s.ward} ({s.shelter})</span>
              <span style={{ color: 'var(--p1)', fontWeight: 700 }}>
                {s.current}/{s.max} {s.unit} (Mín: {s.min})
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Grouped by shelter */}
      {Object.entries(grouped).map(([shelter, items]) => (
        <div key={shelter} style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 10, padding: 12,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
            fontSize: 14, fontWeight: 700,
          }}>
            <Icon.House size={16} color="var(--ink-2)" />
            {shelter}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(s => {
              const isCrit = s.current < s.min;
              return (
                <div key={s.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr', gap: 4,
                  paddingBottom: 6, borderBottom: '1px solid var(--line-2)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: isCrit ? 'var(--p1)' : 'inherit' }}>
                      {s.name} {isCrit && '⚠️'}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{s.ward}</span>
                  </div>
                  <StockBar value={s.current} max={s.max} height={8} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, marginTop: 4 }}>
                    <span style={{ color: 'var(--muted)' }}>Estoque: {s.current} / {s.max} {s.unit}</span>
                    <button 
                      onClick={() => {
                        setEditLimitItem(s);
                        setMinVal(s.min);
                        setMaxVal(s.max);
                      }}
                      style={{
                        background: 'var(--line-2)', border: 'none',
                        borderRadius: 4, padding: '2px 6px',
                        fontSize: 11, fontWeight: 600, color: 'var(--ink-2)',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                        transition: 'background 150ms',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--line)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'var(--line-2)'}
                      title="Ajustar limite de alerta crítico"
                    >
                      Mín: {s.min} {s.unit} ✏️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <BatchDonationModal open={batchOpen} onClose={() => setBatchOpen(false)} actions={actions} />
      <BatchConsumptionModal open={batchOutOpen} onClose={() => setBatchOutOpen(false)} actions={actions} state={state} />

      {/* Edit Limits Modal */}
      {editLimitItem && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,18,22,0.55)',
          display: 'grid', placeItems: 'center', zIndex: 400, padding: 16,
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 12,
            width: '100%', maxWidth: 360, overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)',
                          fontSize: 15, fontWeight: 700 }}>
              Configurar limites: {editLimitItem.name}
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>
                  Mínimo Recomendado ({editLimitItem.unit})
                </label>
                <input 
                  type="number" 
                  value={minVal} 
                  onChange={e => setMinVal(e.target.value)} 
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 6,
                    border: '1px solid var(--line)', fontSize: 14, background: '#fff',
                  }} 
                />
                <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginTop: 4 }}>
                  Abaixo deste valor o item entra em estado crítico (vermelho).
                </span>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>
                  Capacidade Máxima ({editLimitItem.unit})
                </label>
                <input 
                  type="number" 
                  value={maxVal} 
                  onChange={e => setMaxVal(e.target.value)} 
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 6,
                    border: '1px solid var(--line)', fontSize: 14, background: '#fff',
                  }} 
                />
              </div>
            </div>
            <div style={{
              padding: '12px 16px', borderTop: '1px solid var(--line-2)',
              display: 'flex', gap: 8, background: 'var(--surface-2)',
            }}>
              <button onClick={() => setEditLimitItem(null)} style={{
                flex: 1, minHeight: 44, padding: '10px 14px',
                background: 'transparent', color: 'var(--ink-2)',
                border: '1px solid var(--line)', borderRadius: 8,
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}>Cancelar</button>
              <button 
                onClick={() => {
                  actions.updateSupplyLimits(editLimitItem.id, parseFloat(minVal) || 0, parseFloat(maxVal) || 100);
                  setEditLimitItem(null);
                }} 
                style={{
                  flex: 1, minHeight: 44, padding: '10px 14px',
                  background: 'var(--ink)', color: '#fff',
                  border: 'none', borderRadius: 8,
                  fontWeight: 600, fontSize: 14, cursor: 'pointer',
                }}
              >Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BatchDonationModal({ open, onClose, actions }) {
  const ITEM_AUTOCOMPLETE = window.CFData.ITEM_AUTOCOMPLETE;
  const SHELTERS = window.CFData.INITIAL_SHELTERS.map(s => s.name);
  const [selectedShelter, setSelectedShelter] = React.useState('Abrigo Várzea');
  const [rows, setRows] = React.useState([{ name: '', qty: '', unit: 'un', description: '' }]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open) {
      setSelectedShelter('Abrigo Várzea');
      setRows([{ name: '', qty: '', unit: 'un', description: '' }]);
      setErrors({});
      setConfirmOpen(false);
    }
  }, [open]);

  if (!open) return null;

  const updateRow = (i, field, value) => {
    setRows(rs => rs.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    if (errors[`${i}-${field}`]) {
      setErrors(e => { const ne = {...e}; delete ne[`${i}-${field}`]; return ne; });
    }
  };

  const addRow = () => setRows(rs => [...rs, { name: '', qty: '', unit: 'un', description: '' }]);
  const removeRow = (i) => setRows(rs => rs.filter((_, idx) => idx !== i));

  const validate = () => {
    const errs = {};
    rows.forEach((r, i) => {
      const trimmedName = r.name.trim();
      if (!trimmedName) {
        errs[`${i}-name`] = 'Informe o item.';
      } else {
        const isValidItem = ITEM_AUTOCOMPLETE.some(item => item.toLowerCase() === trimmedName.toLowerCase());
        if (!isValidItem) {
          errs[`${i}-name`] = 'Por favor, selecione um item válido da lista.';
        }
      }
      if (trimmedName.toLowerCase() === 'outro') {
        if (!r.description || !r.description.trim()) {
          errs[`${i}-description`] = 'Informe a descrição do item.';
        }
      }
      const n = parseFloat(r.qty);
      if (!r.qty || isNaN(n) || n <= 0) {
        errs[`${i}-qty`] = 'A quantidade precisa ser um número maior que zero. Digite, por exemplo, 12.';
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const tryConfirm = () => { if (validate()) setConfirmOpen(true); };

  const finish = () => {
    setConfirmOpen(false);
    if (actions.registerDonations) {
      actions.registerDonations(rows, selectedShelter);
    }
    actions.toast({ msg: `${rows.length} itens registrados em lote · estoque atualizado.` });
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,18,22,0.55)',
      display: 'grid', placeItems: 'end center', zIndex: 300,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: '16px 16px 0 0',
        width: '100%', maxWidth: 480, maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 200ms ease',
      }}>
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid var(--line-2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Registrar doações em lote</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Adicione 5+ itens; auto-complete a partir do segundo caractere
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', padding: 4 }}>
            <Icon.Close size={18} color="var(--muted)" />
          </button>
        </div>

        {/* Shelter selection dropdown */}
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--line-2)',
          background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: 10
        }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)' }}>
            Destino (Abrigo):
          </label>
          <select 
            value={selectedShelter} 
            onChange={(e) => setSelectedShelter(e.target.value)}
            style={{
              flex: 1, padding: '8px 10px', borderRadius: 6,
              border: '1px solid var(--line)', background: '#fff', fontSize: 13,
              fontWeight: 600, color: 'var(--ink)'
            }}
          >
            {SHELTERS.map(sh => (
              <option key={sh} value={sh}>{sh}</option>
            ))}
          </select>
        </div>

        <div className="scroll-area" style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
          {rows.map((r, i) => (
            <DonationRow key={i} idx={i} row={r} errors={errors}
                         onUpdate={updateRow} onRemove={removeRow}
                         canRemove={rows.length > 1} />
          ))}
          <button onClick={addRow} style={{
            marginTop: 8, padding: '10px 12px', minHeight: 44, width: '100%',
            background: 'var(--surface-2)', color: 'var(--ink-2)',
            border: '1px dashed var(--line)', borderRadius: 8,
            fontWeight: 600, fontSize: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Icon.Plus size={14} strokeWidth={2.6} /> Adicionar outro item
          </button>
        </div>

        <div style={{
          padding: '12px 16px', borderTop: '1px solid var(--line-2)',
          display: 'flex', gap: 8, background: 'var(--surface-2)',
        }}>
          <button onClick={onClose} style={{
            flex: 1, minHeight: 44, padding: '10px 14px',
            background: 'transparent', color: 'var(--ink-2)',
            border: '1px solid var(--line)', borderRadius: 8,
            fontWeight: 600, fontSize: 14,
          }}>Cancelar</button>
          <button onClick={tryConfirm} style={{
            flex: 2, minHeight: 44, padding: '10px 14px',
            background: 'var(--ink)', color: '#fff',
            border: 'none', borderRadius: 8,
            fontWeight: 600, fontSize: 14,
          }}>Concluir ({rows.length})</button>
        </div>

        {/* Confirmation modal — high-impact double-confirm */}
        {confirmOpen && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15,18,22,0.6)',
            display: 'grid', placeItems: 'center', zIndex: 400, padding: 16,
          }}>
            <div style={{
              background: 'var(--surface)', borderRadius: 12,
              width: '100%', maxWidth: 420, overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)',
                            fontSize: 16, fontWeight: 700 }}>
                Confirmar registro
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
                  Resumo da operação:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rows.map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 13, padding: '6px 8px', background: 'var(--surface-2)',
                      borderRadius: 6,
                    }}>
                      <span>{r.name.toLowerCase() === 'outro' && r.description ? `Outro (${r.description})` : r.name}</span>
                      <span style={{ fontWeight: 700 }}>+{r.qty} {r.unit}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
                  Esta ação atualiza o estoque imediatamente.
                </div>
              </div>
              <div style={{
                padding: '12px 16px', borderTop: '1px solid var(--line-2)',
                display: 'flex', gap: 8, background: 'var(--surface-2)',
              }}>
                <button onClick={() => setConfirmOpen(false)} style={{
                  flex: 1, minHeight: 44, padding: '10px 14px',
                  background: 'transparent', color: 'var(--ink-2)',
                  border: '1px solid var(--line)', borderRadius: 8,
                  fontWeight: 600, fontSize: 14,
                }}>Voltar</button>
                <button onClick={finish} style={{
                  flex: 1, minHeight: 44, padding: '10px 14px',
                  background: 'var(--p4)', color: '#fff',
                  border: 'none', borderRadius: 8,
                  fontWeight: 600, fontSize: 14,
                }}>Confirmar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DonationRow({ idx, row, errors, onUpdate, onRemove, canRemove }) {
  const ITEMS = window.CFData.ITEM_AUTOCOMPLETE;
  const [showAC, setShowAC] = React.useState(false);
  const matches = row.name.length >= 2
    ? ITEMS.filter(it => it.toLowerCase().includes(row.name.toLowerCase())).slice(0, 5)
    : [];
  const errName = errors[`${idx}-name`];
  const errQty = errors[`${idx}-qty`];
  const errDesc = errors[`${idx}-description`];

  return (
    <div style={{
      padding: '10px 0', borderBottom: '1px solid var(--line-2)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{
          width: 24, height: 36, display: 'grid', placeItems: 'center',
          fontSize: 11, color: 'var(--muted)', fontWeight: 700,
        }}>{idx + 1}</div>
        <div style={{ flex: 2, position: 'relative' }}>
          <input
            value={row.name}
            onChange={(e) => { onUpdate(idx, 'name', e.target.value); setShowAC(true); }}
            onFocus={() => setShowAC(true)}
            onBlur={() => setTimeout(() => setShowAC(false), 150)}
            placeholder="Item"
            style={{
              width: '100%', padding: '10px 12px', minHeight: 44,
              border: `1px solid ${errName ? 'var(--p1)' : 'var(--line)'}`,
              borderRadius: 6, fontSize: 14, fontFamily: 'inherit',
              background: '#fff',
            }} />
          {showAC && matches.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5,
              background: '#fff', border: '1px solid var(--line)',
              borderRadius: 6, boxShadow: 'var(--shadow-2)',
              marginTop: 2, overflow: 'hidden',
            }}>
              {matches.map(m => (
                <div key={m} onMouseDown={() => onUpdate(idx, 'name', m)} style={{
                  padding: '8px 10px', fontSize: 13, cursor: 'pointer',
                  borderBottom: '1px solid var(--line-2)',
                }}>{m}</div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <input
            value={row.qty}
            onChange={(e) => onUpdate(idx, 'qty', e.target.value)}
            placeholder="Qtde"
            inputMode="numeric"
            style={{
              width: '100%', padding: '10px 12px', minHeight: 44,
              border: `1px solid ${errQty ? 'var(--p1)' : 'var(--line)'}`,
              borderRadius: 6, fontSize: 14, fontFamily: 'inherit',
              background: '#fff',
            }} />
        </div>
        <select value={row.unit} onChange={(e) => onUpdate(idx, 'unit', e.target.value)} style={{
          padding: '10px 8px', minHeight: 44,
          border: '1px solid var(--line)', borderRadius: 6,
          fontSize: 14, background: '#fff', fontFamily: 'inherit',
        }}>
          <option value="un">un</option>
          <option value="L">L</option>
          <option value="kg">kg</option>
          <option value="pç">pç</option>
          <option value="cx">cx</option>
          <option value="pct">pct</option>
        </select>
        {canRemove && (
          <button onClick={() => onRemove(idx)} style={{
            width: 36, minHeight: 44, background: 'transparent',
            border: 'none', color: 'var(--muted)',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            <Icon.Trash size={16} />
          </button>
        )}
      </div>
      
      {row.name.toLowerCase() === 'outro' && (
        <div style={{ marginTop: 8, marginLeft: 32 }}>
          <input
            value={row.description}
            onChange={(e) => onUpdate(idx, 'description', e.target.value)}
            placeholder="Descreva o item (ex: Brinquedos, Colchão...)"
            style={{
              width: '100%', padding: '8px 12px', minHeight: 38,
              border: `1px solid ${errDesc ? 'var(--p1)' : 'var(--line)'}`,
              borderRadius: 6, fontSize: 13, fontFamily: 'inherit',
              background: '#fff',
            }}
          />
        </div>
      )}

      {(errName || errQty || (row.name.toLowerCase() === 'outro' && errDesc)) && (
        <div style={{
          marginTop: 4, marginLeft: 32, fontSize: 12, color: 'var(--p1)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon.Alert size={12} color="var(--p1)" /> {errName || errQty || errDesc}
        </div>
      )}
    </div>
  );
}

function BatchConsumptionModal({ open, onClose, actions, state }) {
  const ITEM_AUTOCOMPLETE = window.CFData.ITEM_AUTOCOMPLETE;
  const SHELTERS = window.CFData.INITIAL_SHELTERS.map(s => s.name);
  const [selectedShelter, setSelectedShelter] = React.useState('Abrigo Várzea');
  const [rows, setRows] = React.useState([{ name: '', qty: '', unit: 'un', description: '' }]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open) {
      setSelectedShelter('Abrigo Várzea');
      setRows([{ name: '', qty: '', unit: 'un', description: '' }]);
      setErrors({});
      setConfirmOpen(false);
    }
  }, [open]);

  if (!open) return null;

  const updateRow = (i, field, value) => {
    setRows(rs => rs.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    if (errors[`${i}-${field}`]) {
      setErrors(e => { const ne = {...e}; delete ne[`${i}-${field}`]; return ne; });
    }
  };

  const addRow = () => setRows(rs => [...rs, { name: '', qty: '', unit: 'un', description: '' }]);
  const removeRow = (i) => setRows(rs => rs.filter((_, idx) => idx !== i));

  const validate = () => {
    const errs = {};
    rows.forEach((r, i) => {
      const trimmedName = r.name.trim();
      let finalItemName = trimmedName;

      if (!trimmedName) {
        errs[`${i}-name`] = 'Informe o item.';
        return;
      } else {
        const isValidItem = ITEM_AUTOCOMPLETE.some(item => item.toLowerCase() === trimmedName.toLowerCase());
        if (!isValidItem) {
          errs[`${i}-name`] = 'Por favor, selecione um item válido da lista.';
          return;
        }
      }

      if (trimmedName.toLowerCase() === 'outro') {
        if (!r.description || !r.description.trim()) {
          errs[`${i}-description`] = 'Informe a descrição do item.';
          return;
        }
        finalItemName = r.description.trim();
      }

      // Check if this item exists in the selected shelter's supplies
      const existing = state.supplies.find(s =>
        s.name.toLowerCase() === finalItemName.toLowerCase() &&
        s.shelter.toLowerCase() === selectedShelter.toLowerCase()
      );

      if (!existing) {
        errs[`${i}-name`] = `Este item não existe no estoque do ${selectedShelter}.`;
      } else {
        const qtyToConsume = parseFloat(r.qty);
        if (!r.qty || isNaN(qtyToConsume) || qtyToConsume <= 0) {
          errs[`${i}-qty`] = 'A quantidade precisa ser maior que zero.';
        } else if (qtyToConsume > existing.current) {
          errs[`${i}-qty`] = `Quantidade excede o estoque disponível (${existing.current} ${existing.unit}).`;
        }
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const tryConfirm = () => { if (validate()) setConfirmOpen(true); };

  const finish = () => {
    setConfirmOpen(false);
    if (actions.registerConsumptions) {
      actions.registerConsumptions(rows, selectedShelter);
    }
    actions.toast({ msg: `${rows.length} saídas registradas · estoque atualizado.` });
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,18,22,0.55)',
      display: 'grid', placeItems: 'end center', zIndex: 300,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: '16px 16px 0 0',
        width: '100%', maxWidth: 480, maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 200ms ease',
      }}>
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid var(--line-2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Registrar consumo/saída em lote</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Selecione o abrigo e informe as saídas do estoque
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', padding: 4 }}>
            <Icon.Close size={18} color="var(--muted)" />
          </button>
        </div>

        {/* Shelter selection dropdown */}
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--line-2)',
          background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: 10
        }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)' }}>
            Origem (Abrigo):
          </label>
          <select 
            value={selectedShelter} 
            onChange={(e) => setSelectedShelter(e.target.value)}
            style={{
              flex: 1, padding: '8px 10px', borderRadius: 6,
              border: '1px solid var(--line)', background: '#fff', fontSize: 13,
              fontWeight: 600, color: 'var(--ink)'
            }}
          >
            {SHELTERS.map(sh => (
              <option key={sh} value={sh}>{sh}</option>
            ))}
          </select>
        </div>

        <div className="scroll-area" style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
          {rows.map((r, i) => (
            <DonationRow key={i} idx={i} row={r} errors={errors}
                         onUpdate={updateRow} onRemove={removeRow}
                         canRemove={rows.length > 1} />
          ))}
          <button onClick={addRow} style={{
            marginTop: 8, padding: '10px 12px', minHeight: 44, width: '100%',
            background: 'var(--surface-2)', color: 'var(--ink-2)',
            border: '1px dashed var(--line)', borderRadius: 8,
            fontWeight: 600, fontSize: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Icon.Plus size={14} strokeWidth={2.6} /> Adicionar outro item
          </button>
        </div>

        <div style={{
          padding: '12px 16px', borderTop: '1px solid var(--line-2)',
          display: 'flex', gap: 8, background: 'var(--surface-2)',
        }}>
          <button onClick={onClose} style={{
            flex: 1, minHeight: 44, padding: '10px 14px',
            background: 'transparent', color: 'var(--ink-2)',
            border: '1px solid var(--line)', borderRadius: 8,
            fontWeight: 600, fontSize: 14,
          }}>Cancelar</button>
          <button onClick={tryConfirm} style={{
            flex: 2, minHeight: 44, padding: '10px 14px',
            background: 'var(--ink)', color: '#fff',
            border: 'none', borderRadius: 8,
            fontWeight: 600, fontSize: 14,
          }}>Registrar Saídas ({rows.length})</button>
        </div>

        {/* Confirmation modal */}
        {confirmOpen && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15,18,22,0.6)',
            display: 'grid', placeItems: 'center', zIndex: 400, padding: 16,
          }}>
            <div style={{
              background: 'var(--surface)', borderRadius: 12,
              width: '100%', maxWidth: 420, overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)',
                            fontSize: 16, fontWeight: 700 }}>
                Confirmar registro de saída
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
                  Resumo da operação:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rows.map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 13, padding: '6px 8px', background: 'var(--surface-2)',
                      borderRadius: 6,
                    }}>
                      <span>{r.name.toLowerCase() === 'outro' && r.description ? `Outro (${r.description})` : r.name}</span>
                      <span style={{ fontWeight: 700, color: 'var(--p1)' }}>-{r.qty} {r.unit}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
                  Esta ação dará baixa do estoque imediatamente.
                </div>
              </div>
              <div style={{
                padding: '12px 16px', borderTop: '1px solid var(--line-2)',
                display: 'flex', gap: 8, background: 'var(--surface-2)',
              }}>
                <button onClick={() => setConfirmOpen(false)} style={{
                  flex: 1, minHeight: 44, padding: '10px 14px',
                  background: 'transparent', color: 'var(--ink-2)',
                  border: '1px solid var(--line)', borderRadius: 8,
                  fontWeight: 600, fontSize: 14,
                }}>Voltar</button>
                <button onClick={finish} style={{
                  flex: 1, minHeight: 44, padding: '10px 14px',
                  background: 'var(--p1)', color: '#fff',
                  border: 'none', borderRadius: 8,
                  fontWeight: 600, fontSize: 14,
                }}>Confirmar Saída</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.ScreenSupplies = ScreenSupplies;
