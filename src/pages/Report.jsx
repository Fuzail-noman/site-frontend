import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAudit, runAudit } from '../api.js';
import Gauge from '../components/Gauge.jsx';
import CheckList from '../components/CheckList.jsx';
import ScanOverlay from '../components/ScanOverlay.jsx';
import { CATEGORY_META, scoreColor } from '../utils.js';

export default function Report() {
  const { id } = useParams();
  const nav = useNavigate();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('seo');
  const [filter, setFilter] = useState('all');
  const [rescanning, setRescanning] = useState(false);

  useEffect(() => {
    setReport(null);
    setError('');
    getAudit(id).then(setReport).catch((e) => setError(e.message));
  }, [id]);

  const rescan = async () => {
    setRescanning(true);
    try {
      const r = await runAudit(report.finalUrl);
      nav(`/report/${r.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setRescanning(false);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sitescope-${report.hostname}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (error)
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <p role="alert" className="text-neon-pink">{error}</p>
        <Link to="/" className="btn btn-ghost mt-6">← Wapis jao</Link>
      </main>
    );
  if (!report) return <p className="py-24 text-center font-mono text-slate-500">Report load ho rahi hai<span className="animate-blink">_</span></p>;

  const visible = report.checks.filter((c) => c.category === tab && (filter === 'all' || c.status === filter));
  const m = report.meta;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-8">
      {rescanning && <ScanOverlay url={report.finalUrl} />}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/" className="no-print text-sm text-slate-500 hover:text-white">← Naya scan</Link>
          <h1 className="mt-1 break-all text-2xl font-bold sm:text-3xl">{report.hostname}</h1>
          <a href={report.finalUrl} target="_blank" rel="noopener noreferrer" className="break-all font-mono text-xs text-neon-cyan hover:underline">
            {report.finalUrl}
          </a>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button className="btn btn-ghost !py-2 text-sm" onClick={rescan}>↻ Re-scan</button>
          <button className="btn btn-ghost !py-2 text-sm" onClick={exportJson}>⬇ JSON</button>
          <button className="btn btn-ghost !py-2 text-sm" onClick={() => window.print()}>🖨 PDF / Print</button>
        </div>
      </div>

      {/* hero score */}
      <section className="card grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
        <div className="mx-auto">
          <Gauge value={report.overall} size={190} stroke={14} label="Overall score" grade={report.grade} />
        </div>
        <div>
          <div className="rounded-xl border border-neon-pink/30 bg-neon-pink/10 p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-neon-pink">🔥 Roast mode</p>
            <p className="mt-1 text-lg font-medium text-slate-100">{report.roast}</p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            {[
              ['Passed', m.passed, 'text-neon-lime'],
              ['Warnings', m.warnings, 'text-neon-amber'],
              ['Failed', m.failed, 'text-neon-pink'],
              ['Load', `${m.responseMs}ms`, 'text-neon-cyan'],
            ].map(([k, v, c]) => (
              <div key={k} className="rounded-xl bg-ink-800 p-3">
                <dd className={`font-mono text-xl font-bold ${c}`}>{v}</dd>
                <dt className="text-xs text-slate-500">{k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* category gauges */}
      <section className="no-print mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={`card flex flex-col items-center gap-2 p-4 transition ${tab === key ? 'border-neon-lime/60 shadow-[0_0_0_1px_rgba(184,255,61,.4)]' : 'hover:border-white/30'}`}
          >
            <Gauge value={report.scores[key]} size={76} stroke={7} label={meta.label} />
            <span className="text-sm font-bold">{meta.icon} {meta.label}</span>
          </button>
        ))}
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* checks */}
        <section className="card p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">
              {CATEGORY_META[tab].icon} {CATEGORY_META[tab].label}
              <span className="ml-2 font-mono text-base" style={{ color: scoreColor(report.scores[tab]) }}>{report.scores[tab]}/100</span>
            </h2>
            <div className="no-print flex gap-1 font-mono text-xs">
              {['all', 'fail', 'warn', 'pass'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-2 py-1 uppercase ${filter === f ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          {visible.length ? <CheckList checks={visible} /> : <p className="py-8 text-center text-slate-500">Is filter mein kuch nahi mila.</p>}
        </section>

        {/* quick wins */}
        <aside className="card h-fit p-5">
          <h2 className="text-lg font-bold">🚀 Top quick wins</h2>
          {report.quickWins.length ? (
            <ol className="mt-3 space-y-3">
              {report.quickWins.map((q, i) => (
                <li key={q.title} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-neon-lime font-mono text-xs font-bold text-ink-950">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-bold">{q.title}</span>
                    <span className="block text-sm text-slate-400">{q.fix}</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-slate-400">Koi issue nahi. Respect! 🫡</p>
          )}
          <hr className="my-4 border-white/10" />
          <dl className="space-y-1 font-mono text-xs text-slate-400">
            <div className="flex justify-between gap-3"><dt>HTTP status</dt><dd>{m.statusCode}</dd></div>
            <div className="flex justify-between gap-3"><dt>HTML size</dt><dd>{m.sizeKb} KB</dd></div>
            {m.server && <div className="flex justify-between gap-3"><dt>Server</dt><dd className="truncate">{m.server}</dd></div>}
          </dl>
        </aside>
      </div>
    </main>
  );
}
