import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocketContext } from '../../context/SocketContext.jsx';
import { NAV_ITEMS, ROUTES } from '../../constants/routes.js';
import { cn } from '../../utils/cn.js';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { connected } = useSocketContext();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <NavLink to={ROUTES.FEED} className="text-lg font-semibold tracking-tight text-white">
            InsightHub
          </NavLink>
          {isAuthenticated && (
            <span
              className={cn(
                'hidden items-center gap-1.5 text-xs sm:flex',
                connected ? 'text-emerald-400' : 'text-slate-500',
              )}
            >
              <span
                className={cn('h-2 w-2 rounded-full', connected ? 'bg-emerald-400' : 'bg-slate-600')}
              />
              {connected ? 'Live' : 'Offline'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NavLink
                to={ROUTES.PREFERENCES}
                className="hidden text-sm text-slate-400 hover:text-white sm:block"
              >
                {user?.name}
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to={ROUTES.LOGIN}
              className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-500"
            >
              Sign in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
