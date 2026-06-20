import { Outlet, NavLink } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import { NAV_ITEMS } from '../../constants/routes.js';
import { cn } from '../../utils/cn.js';

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:px-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <nav className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            {NAV_ITEMS.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  cn(
                    'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition',
                    isActive
                      ? 'bg-sky-950/60 text-sky-400'
                      : 'bg-slate-900 text-slate-400 hover:text-white',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
