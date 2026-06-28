import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import MobileTabBar from './MobileTabBar.jsx';

function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 pb-24 sm:px-6 lg:pb-8">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <div key={location.pathname} className="page-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}

export default AppLayout;
