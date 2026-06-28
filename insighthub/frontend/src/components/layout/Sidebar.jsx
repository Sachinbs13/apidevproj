import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/routes.js';
import { cn } from '../../utils/cn.js';

function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-1.5 rounded-2xl border border-slate-900/60 bg-slate-950/40 p-3 backdrop-blur-md">
        <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
          News Intelligence
        </p>
        {NAV_ITEMS.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition duration-200',
                isActive
                  ? 'bg-gradient-to-r from-sky-950/50 to-indigo-950/20 text-sky-400 border border-sky-500/20 shadow-md shadow-sky-950/10'
                  : 'text-slate-400 border border-transparent hover:bg-slate-900/40 hover:text-white'
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
