import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Feed from './pages/Feed.jsx';
import Search from './pages/Search.jsx';
import Trending from './pages/Trending.jsx';
import Compare from './pages/Compare.jsx';
import Analytics from './pages/Analytics.jsx';
import Alerts from './pages/Alerts.jsx';
import Login from './pages/Login.jsx';
import Preferences from './pages/Preferences.jsx';
import MorningBriefPage from './pages/MorningBriefPage.jsx';
import LocalIntelligence from './pages/LocalIntelligence.jsx';
import SchemesIntelligence from './pages/SchemesIntelligence.jsx';
import { ROUTES } from './constants/routes.js';

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid #334155',
          },
        }}
      />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path={ROUTES.FEED} element={<Feed />} />
          <Route path={ROUTES.SEARCH} element={<Search />} />
          <Route path={ROUTES.TRENDING} element={<Trending />} />
          <Route path={ROUTES.COMPARE} element={<Compare />} />
          <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
          <Route path={ROUTES.LOCAL} element={<LocalIntelligence />} />
          <Route path={ROUTES.SCHEMES} element={<SchemesIntelligence />} />
          <Route
            path={ROUTES.BRIEF}
            element={
              <ProtectedRoute>
                <MorningBriefPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ALERTS}
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PREFERENCES}
            element={
              <ProtectedRoute>
                <Preferences />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
      </Routes>
    </>
  );
}

export default App;
