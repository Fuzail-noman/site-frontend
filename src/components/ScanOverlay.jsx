import { useEffect, useState } from 'react';

const STEPS = [
  'DNS resolve ho raha hai...',
  'SSRF guard: public host verify ✔',
  'HTML download + response time naap raha hoon...',
  'Meta tags, headings aur Open Graph scan...',
  'Security headers ki talaashi...',
  'Images ke alt text ginne baithe hain...',
  'Links ko ek ek karke ping kar raha hoon...',
  'robots.txt aur sitemap.xml dhoond raha hoon...',
  'Score calculate + roast ready kar raha hoon 🔥',
];

export default function ScanOverlay({ url }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/90 p-4 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="card w-full max-w-lg overflow-hidden p-6">
        <div className="relative mb-5 h-40 overflow-hidden rounded-xl border border-neon-cyan/30 bg-ink-800">
          <div className="absolute inset-0 grid place-items-center text-6xl animate-floaty">🌐</div>
          <div className="absolute left-0 right-0 h-0.5 bg-neon-cyan shadow-[0_0_18px_4px_#22e5ff] animate-scan" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(34,229,255,.15)_95%)] bg-[length:100%_12px]" />
        </div>
        <p className="mb-3 truncate font-mono text-xs text-neon-cyan">$ sitescope scan {url}</p>
        <ul className="space-y-1 font-mono text-sm">
          {STEPS.slice(0, step + 1).map((s, i) => (
            <li key={s} className={i === step ? 'text-neon-lime' : 'text-slate-500'}>
              {i === step ? '▸' : '✔'} {s}
              {i === step && <span className="animate-blink">_</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
