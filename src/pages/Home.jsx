import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { runAudit, listAudits } from '../api.js';
import ScanOverlay from '../components/ScanOverlay.jsx';
import { scoreColor, timeAgo } from '../utils.js';

const FEATURES = [
  { icon: '🔎', title: 'SEO', text: 'Title, meta, H1, canonical, Open Graph, sitemap' },
  { icon: '⚡', title: 'Performance', text: 'Response time, compression, caching, blocking scripts' },
  { icon: '🛡️', title: 'Security', text: 'HTTPS, HSTS, CSP, cookies, mixed content' },
  { icon: '♿', title: 'Accessibility', text: 'Alt text, labels, lang, viewport, landmarks' },
  { icon: '🔗', title: 'Broken Links', text: 'Sample links ko live ping karke check karta hai' },
  { icon: '🔥', title: 'Roast Mode', text: 'Score ke hisaab se aap ki site ka mazaaq' },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    listAudits().then((d) => setRecent(d.slice(0, 4))).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setError('');
    setLoading(true);
    try {
      const report = await runAudit(url.trim());
      nav(`/report/${report.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-14">
      {loading && <ScanOverlay url={url} />}

      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-block rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-1 font-mono text-xs text-neon-cyan">
          v1.0 · MERN · free · no signup
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Apni website ka <span className="bg-gradient-to-r from-neon-lime to-neon-cyan bg-clip-text text-transparent">X-Ray</span> karo
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          URL daalo, 10 second mein poora audit: SEO, speed, security, accessibility, links. Saath mein ek honest roast. 🔥
        </p>

        <form onSubmit={submit} className="card mt-8 flex flex-col gap-3 p-3 sm:flex-row">
          <label htmlFor="url" className="sr-only">Website URL</label>
          <input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            autoComplete="url"
            inputMode="url"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-800 px-4 py-3 font-mono text-slate-100 placeholder:text-slate-600 focus:border-neon-cyan focus:outline-none"
          />
          <button className="btn btn-primary" disabled={loading || !url.trim()}>
            Scan karo →
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-3 rounded-lg border border-neon-pink/40 bg-neon-pink/10 px-4 py-2 text-sm text-neon-pink">
            {error}
          </p>
        )}
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="card animate-rise p-5" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-2 font-bold text-slate-100">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{f.text}</p>
          </div>
        ))}
      </section>

      {recent.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-slate-500">Recent scans</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recent.map((r) => (
              <button key={r.id} onClick={() => nav(`/report/${r.id}`)} className="card flex items-center justify-between p-4 text-left transition hover:border-white/30">
                <span className="min-w-0">
                  <span className="block truncate font-bold">{r.hostname}</span>
                  <span className="text-xs text-slate-500">{timeAgo(r.createdAt)}</span>
                </span>
                <span className="font-mono text-2xl font-bold" style={{ color: scoreColor(r.overall) }}>{r.overall}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
