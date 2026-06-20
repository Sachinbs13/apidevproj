import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/routes.js';
import { cn } from '../../utils/cn.js';

function Sidebar() {
  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <nav className="sticky top-20 space-y-1">
        {NAV_ITEMS.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'block rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-sky-950/60 text-sky-400'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white',
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
