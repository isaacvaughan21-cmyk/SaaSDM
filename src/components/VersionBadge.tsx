import { useState, useRef, useEffect } from 'react';
import { CHANGELOG, CURRENT_VERSION } from '../state/changelog';

export function VersionBadge() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-muted hover:text-ink transition-colors tabular-nums"
        title="What's new"
      >
        v{CURRENT_VERSION}
      </button>

      {open && (
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-72 bg-surface border border-line rounded-xl shadow-lift p-4 z-40 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">
              What's new
            </span>
            <span className="text-xs text-muted tabular-nums">v{CURRENT_VERSION}</span>
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto">
            {CHANGELOG.map((entry) => (
              <div key={entry.version}>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-ink">{entry.title}</span>
                  <span className="text-xs text-muted tabular-nums">v{entry.version}</span>
                </div>
                <ul className="space-y-1">
                  {entry.changes.map((c, i) => (
                    <li key={i} className="flex gap-1.5 text-xs text-muted leading-snug">
                      <span className="text-ink mt-px">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
