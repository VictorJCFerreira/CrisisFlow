// Shared UI primitives for CrisisFlow

const { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } = React;

// ============ TOAST SYSTEM ============
const ToastCtx = createContext(null);
function useToast() { return useContext(ToastCtx); }

function ToastHost({ toasts, onUndo, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 96,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 8, zIndex: 200, pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} role="status" style={{
          pointerEvents: 'auto',
          minWidth: 280, maxWidth: 460,
          background: t.type === 'error' ? 'var(--p1)' : t.type === 'warn' ? 'var(--p2)' : 'var(--p4)',
          color: '#fff',
          borderRadius: 10, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          animation: 'slideUp 220ms ease',
          fontSize: 15, fontWeight: 500,
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 11,
            background: '#fff',
            color: t.type === 'error' ? 'var(--p1)' : t.type === 'warn' ? 'var(--p2)' : 'var(--p4)',
            display: 'grid', placeItems: 'center', flex: '0 0 22px',
          }}>
            {t.type === 'error' || t.type === 'warn' ? (
              <Icon.Close size={12} strokeWidth={3} />
            ) : (
              <Icon.Check size={14} strokeWidth={2.8} />
            )}
          </span>
          <span style={{ flex: 1 }}>{t.msg}</span>
          {t.undo && (
            <button onClick={() => { onUndo(t.id); }} style={{
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 6, padding: '4px 10px',
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon.Undo size={14} /> Desfazer
            </button>
          )}
          <button onClick={() => onDismiss(t.id)} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.7)',
            border: 'none', padding: 2, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon.Close size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ============ PRIORITY BADGE ============
function PriorityBadge({ p, size = 'md' }) {
  const def = window.CFData.PRIORITIES[p];
  if (!def) return null;
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: def.color, color: '#fff',
      fontWeight: 700, fontSize: sm ? 11 : 12,
      padding: sm ? '2px 6px' : '3px 8px',
      borderRadius: 4, letterSpacing: 0.3,
      minWidth: sm ? 24 : 28,
    }}>{def.label}</span>
  );
}

// ============ STATUS DOT ============
function StatusDot({ color = 'var(--p4)', pulse = false, size = 8 }) {
  return (
    <span className={pulse ? 'crit-pulse' : ''} style={{
      width: size, height: size, borderRadius: size/2,
      background: color, display: 'inline-block',
    }} />
  );
}

// ============ PROGRESS BAR (dynamic color) ============
function StockBar({ value, max, height = 8, showLabel = true }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  let color;
  if (pct < 20) color = 'var(--p1)';
  else if (pct < 40) color = 'var(--p2)';
  else if (pct < 70) color = 'var(--p3)';
  else color = 'var(--p4)';

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%', height, background: 'var(--line-2)', borderRadius: height/2, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color,
          transition: 'width 240ms ease, background 240ms ease',
        }} />
      </div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4,
          fontSize: 12, color: 'var(--muted)' }}>
          <span style={{ color, fontWeight: 600 }}>{pct}%</span>
          <span>{value}/{max}</span>
        </div>
      )}
    </div>
  );
}

// ============ KPI CARD ============
function KPI({ label, value, sub, accent = 'var(--ink-2)', icon = null }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 10, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        {icon}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent, lineHeight: 1.1, letterSpacing: -0.5 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>}
    </div>
  );
}

// ============ MODAL ============
function Modal({ open, title, children, onClose, primary, danger = false }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,18,22,0.55)',
      display: 'grid', placeItems: 'center', zIndex: 300, padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: 12, width: '100%', maxWidth: 460,
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', padding: 4,
            color: 'var(--muted)', display: 'grid', placeItems: 'center' }}>
            <Icon.Close size={18} />
          </button>
        </div>
        <div style={{ padding: 20, fontSize: 14, color: 'var(--ink-2)' }}>
          {children}
        </div>
        {primary && (
          <div style={{ display: 'flex', gap: 8, padding: '12px 20px',
            borderTop: '1px solid var(--line-2)', justifyContent: 'flex-end', background: 'var(--surface-2)' }}>
            <button onClick={onClose} style={{
              padding: '10px 16px', minHeight: 44,
              background: 'transparent', color: 'var(--ink-2)',
              border: '1px solid var(--line)', borderRadius: 8,
              fontWeight: 600, fontSize: 14,
            }}>Cancelar</button>
            <button onClick={primary.onClick} style={{
              padding: '10px 16px', minHeight: 44,
              background: danger ? 'var(--p1)' : 'var(--ink)', color: '#fff',
              border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14,
            }}>{primary.label}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ BUTTON ============
function Button({ children, onClick, variant = 'primary', size = 'md', icon = null, disabled = false, full = false, type = 'button' }) {
  const palettes = {
    primary:   { bg: 'var(--ink)', fg: '#fff', border: 'transparent' },
    secondary: { bg: 'var(--surface)', fg: 'var(--ink-2)', border: 'var(--line)' },
    danger:    { bg: 'var(--p1)', fg: '#fff', border: 'transparent' },
    ghost:     { bg: 'transparent', fg: 'var(--ink-2)', border: 'transparent' },
    p5:        { bg: 'var(--p5)', fg: '#fff', border: 'transparent' },
  };
  const p = palettes[variant];
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: size === 'sm' ? '8px 12px' : '11px 16px',
      minHeight: size === 'sm' ? 36 : 44,
      width: full ? '100%' : undefined,
      background: disabled ? 'var(--gray-bg)' : p.bg,
      color: disabled ? 'var(--gray)' : p.fg,
      border: `1px solid ${disabled ? 'var(--line)' : p.border}`,
      borderRadius: 8, fontWeight: 600, fontSize: size === 'sm' ? 13 : 14,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'transform 80ms ease, opacity 120ms ease',
    }}>
      {icon}
      {children}
    </button>
  );
}

// ============ TAG CHIP ============
function Chip({ children, active, onClick, color = 'var(--ink-2)', count = null }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', minHeight: 32,
      background: active ? color : 'var(--surface)',
      color: active ? '#fff' : color,
      border: `1px solid ${active ? color : 'var(--line)'}`,
      borderRadius: 16, fontSize: 13, fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {children}
      {count != null && (
        <span style={{
          background: active ? 'rgba(255,255,255,0.22)' : 'var(--line-2)',
          color: active ? '#fff' : color,
          borderRadius: 8, padding: '0 6px', fontSize: 11, fontWeight: 700,
        }}>{count}</span>
      )}
    </button>
  );
}

window.UI = { ToastCtx, useToast, ToastHost, PriorityBadge, StatusDot, StockBar, KPI, Modal, Button, Chip };
