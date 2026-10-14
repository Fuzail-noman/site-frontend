import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteAudit, listAudits } from '../api.js';
import Sparkline from '../components/Sparkline.jsx';
import { scoreColor, timeAgo } from '../utils.js';

export default function History() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listAudits().then(setItems).catch((e) => setError(e.message));
  }, []);

  // group by hostname, oldest -> newest for sparklines
  const groups = useMemo(() => {
    const map = new Map();
    [...(items || [])].reverse().forEach((a) => {
      if (!map.has(a.hostname)) map.set(a.hostname, []);
      map.get(a.hostname).push(a);
    });
    return [...map.entries()].map(([host, scans]) => ({ host, scans, latest: scans[scans.length - 1] }))
      .sort((a, b) => new Date(b.latest.createdAt) - new Date(a.latest.createdAt));
  }, [items]);

  const remove = async (id) => {
    if (!window.confirm('Ye report delete kar dein?')) return;
    try {
      await deleteAudit(id);
      setItems((x) => x.filter((a) => a.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-10">
      <h1 className="text-3xl font-bold">Scan history</h1>
      <p className="mt-1 text-slate-400">Har site ka score trend: improve hua ya bigra? 📈</p>
      {error && <p role="alert" className="mt-4 text-neon-pink">{error}</p>}
      {!items && !error && <p className="mt-10 text-center font-mono text-slate-500">Loading<span className="animate-blink">_</span></p>}
      {items && groups.length === 0 && (
        <div className="card mt-8 p-10 text-center">
          <p className="text-slate-400">Abhi koi scan nahi hua.</p>
          <Link to="/" className="btn btn-primary mt-4">Pehla scan karo</Link>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {groups.map(({ host, scans, latest }) => (
          <section key={host} className="card animate-rise p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold">{host}</h2>
                <p className="text-xs text-slate-500">{scans.length} scan(s) · last {timeAgo(latest.createdAt)}</p>
              </div>
              <Sparkline points={scans.map((s) => s.overall)} />
              <span className="font-mono text-3xl font-bold" style={{ color: scoreColor(latest.overall) }}>{latest.overall}</span>
            </div>
            <ul className="mt-3 divide-y divide-white/5 text-sm">
              {[...scans].reverse().map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                  <Link to={`/report/${s.id}`} className="flex min-w-0 flex-1 items-center gap-3 hover:text-neon-lime">
                    <span className="w-10 font-mono font-bold" style={{ color: scoreColor(s.overall) }}>{s.overall}</span>
                    <span className="rounded bg-white/10 px-1.5 font-mono text-xs">{s.grade}</span>
                    <span className="text-slate-400">{timeAgo(s.createdAt)}</span>
                  </Link>
                  <button onClick={() => remove(s.id)} className="text-slate-500 hover:text-neon-pink" aria-label={`Delete scan from ${timeAgo(s.createdAt)}`}>🗑</button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
