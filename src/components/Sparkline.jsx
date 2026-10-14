import { scoreColor } from '../utils.js';

export default function Sparkline({ points, width = 120, height = 36 }) {
  if (!points || points.length < 2) return <span className="text-xs text-slate-500">1 scan</span>;
  const step = width / (points.length - 1);
  const y = (v) => height - 4 - ((height - 8) * v) / 100;
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const trend = last - points[0];
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={width} height={height} aria-hidden="true">
        <path d={d} fill="none" stroke={scoreColor(last)} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={(points.length - 1) * step} cy={y(last)} r="3" fill={scoreColor(last)} />
      </svg>
      <span className={`font-mono text-xs font-bold ${trend >= 0 ? 'text-neon-lime' : 'text-neon-pink'}`}>
        {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}
      </span>
    </span>
  );
}
