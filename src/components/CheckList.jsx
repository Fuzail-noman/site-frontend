import { useState } from 'react';
import { STATUS_STYLE } from '../utils.js';

export default function CheckList({ checks }) {
  const [open, setOpen] = useState(null);
  return (
    <ul className="divide-y divide-white/5">
      {checks.map((c) => {
        const st = STATUS_STYLE[c.status];
        const expandable = !!c.fix;
        const isOpen = open === c.id;
        return (
          <li key={c.id} className="py-3">
            <button
              type="button"
              className="flex w-full items-start gap-3 text-left"
              onClick={() => expandable && setOpen(isOpen ? null : c.id)}
              aria-expanded={expandable ? isOpen : undefined}
            >
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${st.dot}`} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-100">{c.title}</span>
                  <span className={`font-mono text-[10px] font-bold tracking-widest ${st.text}`}>{st.label}</span>
                </span>
                <span className="mt-0.5 block break-words text-sm text-slate-400">{c.detail}</span>
              </span>
              {expandable && <span className="text-slate-500">{isOpen ? '−' : '+'}</span>}
            </button>
            {expandable && isOpen && (
              <div className="ml-5 mt-2 animate-rise rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3 text-sm text-slate-200">
                <span className="font-bold text-neon-cyan">🛠 Fix: </span>
                {c.fix}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
