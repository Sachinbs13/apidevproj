import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoadingSpinner from './components/ui/LoadingSpinner.jsx';
import { ROUTES } from './constants/routes.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const ArticlePage = lazy(() => import('./pages/ArticlePage.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const Trending = lazy(() => import('./pages/Trending.jsx'));
const Analytics = lazy(() => import('./pages/Analytics.jsx'));
const Alerts = lazy(() => import('./pages/Alerts.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'dark:!bg-slate-900 dark:!text-slate-100',
        }}
      />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route element={<AppLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ARTICLE} element={<ArticlePage />} />
          <Route path={ROUTES.SEARCH} element={<Search />} />
          <Route path={ROUTES.TRENDING} element={<Trending />} />
          <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
          <Route path={ROUTES.BRIEF} element={<Navigate to={ROUTES.HOME} replace />} />
          <Route path={ROUTES.LOCAL} element={<Navigate to={`${ROUTES.HOME}?section=local`} replace />} />
          <Route path={ROUTES.SCHEMES} element={<Navigate to={ROUTES.PROFILE} replace />} />
          <Route path={ROUTES.COMPARE} element={<Navigate to={ROUTES.SEARCH} replace />} />
          <Route
            path={ROUTES.ALERTS}
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.PREFERENCES} element={<Navigate to={ROUTES.PROFILE} replace />} />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
