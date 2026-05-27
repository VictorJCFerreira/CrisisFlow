// Minimal stroke-style icons (Material/Heroicons aesthetic — original SVG)
// All 24×24, stroke 1.75, currentColor.

const _i = (path, opts = {}) => ({ size = 20, color = 'currentColor', strokeWidth = 1.75, fill = 'none', ...rest } = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth}
       strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {path}
  </svg>
);

const Icon = {
  Dashboard: _i(<><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>),
  Cases:     _i(<><path d="M4 7h16M4 12h16M4 17h10"/><circle cx="19" cy="17" r="2"/></>),
  Volunteer: _i(<><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="6" r="2"/><path d="M21 14c0-2-2-3.5-4-3.5"/></>),
  Box:       _i(<><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></>),
  More:      _i(<><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>),
  Alert:     _i(<><path d="M12 3L2 20h20L12 3z"/><path d="M12 10v5M12 18.2v.1"/></>),
  Bell:      _i(<><path d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5L6 16z"/><path d="M10 20a2 2 0 004 0"/></>),
  Wifi:      _i(<><path d="M2 9a16 16 0 0120 0M5 12.5a11 11 0 0114 0M8.5 16a6 6 0 017 0"/><circle cx="12" cy="19" r="0.6" fill="currentColor"/></>),
  WifiOff:   _i(<><path d="M2 9a16 16 0 015-2.6M22 9a16 16 0 00-3-1.7M8.5 16a6 6 0 017 0"/><path d="M3 3l18 18"/><circle cx="12" cy="19" r="0.6" fill="currentColor"/></>),
  Sync:      _i(<><path d="M4 12a8 8 0 0114-5"/><path d="M20 12a8 8 0 01-14 5"/><path d="M18 3v4h-4M6 21v-4h4"/></>),
  Undo:      _i(<><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/></>),
  Close:     _i(<><path d="M6 6l12 12M18 6L6 18"/></>),
  Check:     _i(<><path d="M5 12l5 5L20 7"/></>),
  Plus:      _i(<><path d="M12 5v14M5 12h14"/></>),
  Minus:     _i(<><path d="M5 12h14"/></>),
  Search:    _i(<><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></>),
  Filter:    _i(<><path d="M3 5h18M6 12h12M10 19h4"/></>),
  Pin:       _i(<><path d="M12 22s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/></>),
  Clock:     _i(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>),
  Truck:     _i(<><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.7"/><circle cx="17" cy="18" r="1.7"/></>),
  Users:     _i(<><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M21 18c0-2-2-3.5-4-3.5"/></>),
  House:     _i(<><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></>),
  Drop:      _i(<><path d="M12 3s6 7 6 12a6 6 0 11-12 0c0-5 6-12 6-12z"/></>),
  Bolt:      _i(<><path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z"/></>),
  HeartPulse:_i(<><path d="M3 12h4l2-3 3 6 2-4h7"/></>),
  Map:       _i(<><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v16M15 6v16"/></>),
  Download:  _i(<><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/></>),
  Chevron:   _i(<><path d="M9 6l6 6-6 6"/></>),
  Lock:      _i(<><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></>),
  Doc:       _i(<><path d="M14 3H6v18h12V7l-4-4z"/><path d="M14 3v4h4"/></>),
  Drag:      _i(<><circle cx="9" cy="6" r="1.2" fill="currentColor"/><circle cx="15" cy="6" r="1.2" fill="currentColor"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><circle cx="9" cy="18" r="1.2" fill="currentColor"/><circle cx="15" cy="18" r="1.2" fill="currentColor"/></>),
  Phone:     _i(<><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 19h2"/></>),
  Speaker:   _i(<><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6"/></>),
  Settings:  _i(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>),
  Trash:     _i(<><path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/><path d="M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"/></>),
  Play:      _i(<><path d="M7 4l13 8-13 8V4z" fill="currentColor" stroke="none"/></>),
  Power:     _i(<><path d="M12 3v9"/><path d="M6 7a8 8 0 1012 0"/></>),
  Loop:      _i(<><path d="M3 12a9 9 0 0118 0"/><path d="M21 12a9 9 0 01-18 0"/><path d="M18 7l3 0V4M6 17l-3 0v3"/></>),
};

window.Icon = Icon;
