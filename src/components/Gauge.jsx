import { useEffect, useState } from 'react';
import { scoreColor } from '../utils.js';

export default function Gauge({ value, size = 120, stroke = 10, label, grade }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(value), 80);
    return () => clearTimeout(t);
  }, [value]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = scoreColor(value);

  return (
    <div className="relative inline-flex flex-col items-center" role="img" aria-label={`${label || 'Score'}: ${value} out of 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * shown) / 100}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)', filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-bold leading-none" style={{ color, fontSize: size * 0.3 }}>
          {value}
        </span>
        {grade && <span className="mt-1 text-xs font-bold tracking-widest text-slate-400">GRADE {grade}</span>}
      </div>
    </div>
  );
}
