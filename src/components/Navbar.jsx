import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const link = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-bold transition ${isActive ? 'bg-white/10 text-neon-lime' : 'text-slate-400 hover:text-white'}`;
  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-ink-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-neon-lime text-ink-950">🔬</span>
          Site<span className="text-neon-lime">Scope</span>
        </Link>
        <div className="flex gap-1">
          <NavLink to="/" end className={link}>Scan</NavLink>
          <NavLink to="/history" className={link}>History</NavLink>
        </div>
      </nav>
    </header>
  );
}
