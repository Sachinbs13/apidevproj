import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocketContext } from '../../context/SocketContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import { clearBreakingAlerts } from '../../store/newsSlice.js';
import { cn } from '../../utils/cn.js';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { connected } = useSocketContext();
  const dispatch = useDispatch();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const breakingAlerts = useSelector((state) => state.news.breakingAlerts);
  const notificationRef = useRef(null);

  // Close notifications panel on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <NavLink to={ROUTES.FEED} className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white">
            <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Insight</span>
            <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-sky-400 border border-sky-500/20">HUB</span>
          </NavLink>
          {isAuthenticated && (
            <span
              className={cn(
                'hidden items-center gap-1.5 rounded-full bg-slate-900/50 border border-slate-800 px-3 py-1 text-xs transition duration-250 sm:flex',
                connected ? 'text-emerald-400 border-emerald-500/20' : 'text-slate-500'
              )}
            >
              <span
                className={cn('h-1.5 w-1.5 rounded-full', connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600')}
              />
              {connected ? 'Live Stream Active' : 'Offline'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg border border-slate-800 bg-slate-900/40 p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                {breakingAlerts.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Breaking Alerts</h3>
                    {breakingAlerts.length > 0 && (
                      <button
                        onClick={() => dispatch(clearBreakingAlerts())}
                        className="text-[10px] text-slate-500 hover:text-sky-400 transition"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2.5 scrollbar-thin">
                    {breakingAlerts.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">
                        No active breaking alerts reported.
                      </div>
                    ) : (
                      breakingAlerts.map((alert, idx) => (
                        <div key={idx} className="rounded-lg bg-slate-900/50 border border-slate-800/40 p-2.5 space-y-1">
                          <div className="flex justify-between items-start gap-1">
                            <span className="rounded bg-red-500/10 px-1 py-0.2 text-[9px] font-bold uppercase text-red-400 border border-red-500/15">
                              BREAKING
                            </span>
                            <span className="text-[9px] text-slate-500">
                              {new Date(alert.article.publishedAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                            {alert.article.title}
                          </p>
                          <p className="text-[10px] text-slate-400 italic">
                            Reason: {alert.reason}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <>
              <NavLink
                to={ROUTES.PREFERENCES}
                className="hidden text-sm font-semibold text-slate-400 hover:text-white sm:block"
              >
                {user?.name}
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-800 bg-slate-900/30 px-3.5 py-1.5 text-xs font-semibold text-slate-350 transition hover:bg-slate-900 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to={ROUTES.LOGIN}
              className="rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:from-sky-500 hover:to-indigo-500"
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
