import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_ITEMS } from '../../constants/routes.js';
import LanguagePicker from '../ui/LanguagePicker.jsx';
import { cn } from '../../utils/cn.js';

function Sidebar() {
  const { isAuthenticated } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.auth || isAuthenticated);

  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-1 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800/60 dark:bg-slate-950/40">
        <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          Navigate
        </p>
        {items.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              cn(
                'block rounded-xl px-3.5 py-2.5 text-sm font-semibold transition',
                isActive
                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/40 dark:hover:text-white',
              )
            }
          >
            {label}
          </NavLink>
        ))}
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Language
          </p>
          <div className="px-1">
            <LanguagePicker />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
