export const scoreColor = (n) => (n >= 90 ? '#b8ff3d' : n >= 70 ? '#22e5ff' : n >= 50 ? '#ffb020' : '#ff3da5');

export const CATEGORY_META = {
  seo: { label: 'SEO', icon: '🔎' },
  performance: { label: 'Performance', icon: '⚡' },
  security: { label: 'Security', icon: '🛡️' },
  accessibility: { label: 'Accessibility', icon: '♿' },
  links: { label: 'Links', icon: '🔗' },
};

export const STATUS_STYLE = {
  pass: { dot: 'bg-neon-lime', text: 'text-neon-lime', label: 'PASS' },
  warn: { dot: 'bg-neon-amber', text: 'text-neon-amber', label: 'WARN' },
  fail: { dot: 'bg-neon-pink', text: 'text-neon-pink', label: 'FAIL' },
  info: { dot: 'bg-slate-500', text: 'text-slate-400', label: 'INFO' },
};

export const timeAgo = (iso) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
