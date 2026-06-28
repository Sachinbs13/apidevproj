import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { useHomeFeed } from '../queries/useHomeFeed.js';
import CategoryTabs from '../components/home/CategoryTabs.jsx';
import TodaysBriefCard from '../components/home/TodaysBriefCard.jsx';
import LocalNewsSection from '../components/home/LocalNewsSection.jsx';
import HomeFeed from '../components/home/HomeFeed.jsx';
import { cn } from '../utils/cn.js';

function Home() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get('section');

  const [feedMode, setFeedMode] = useState('global');
  const [categoryId, setCategoryId] = useState('top');
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useHomeFeed({
    feedMode,
    categoryId,
    page,
    user,
  });

  const articles = data?.articles ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 15, totalPages: 1 };
  const errorMessage = error?.response?.data?.message || error?.message || '';

  useEffect(() => {
    if (isAuthenticated) {
      setFeedMode('personalized');
    } else {
      setFeedMode('global');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (sectionParam === 'local') {
      const el = document.getElementById('local-news');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sectionParam]);

  function handleModeChange(mode) {
    if (mode === 'personalized' && !user) {
      toast.error('Sign in for a personalized feed');
      return;
    }
    setPage(1);
    setFeedMode(mode);
  }

  function handleCategoryChange(id) {
    setCategoryId(id);
    setPage(1);
    if (feedMode === 'personalized') {
      setFeedMode('global');
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            News Intelligence
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {feedMode === 'personalized' && user ? (
              <>
                Personalized for{' '}
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {user.preferences?.occupation || 'you'}
                </span>
                {user.preferences?.state && (
                  <>
                    {' '}
                    ·{' '}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {user.preferences.state}
                    </span>
                  </>
                )}
              </>
            ) : (
              'Top headlines from aggregated sources across India'
            )}
          </p>
        </div>

        <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => handleModeChange('personalized')}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-bold transition',
              feedMode === 'personalized'
                ? 'bg-sky-600 text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            For You
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('global')}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-bold transition',
              feedMode === 'global'
                ? 'bg-sky-600 text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            All News
          </button>
        </div>
      </header>

      {isAuthenticated && user && <TodaysBriefCard />}

      {feedMode === 'global' && (
        <CategoryTabs
          activeId={categoryId}
          onChange={handleCategoryChange}
          disabled={isLoading}
        />
      )}

      <LocalNewsSection
        defaultState={user?.preferences?.state || 'Karnataka'}
        defaultExpanded={sectionParam === 'local'}
      />

      <HomeFeed
        articles={articles}
        loading={isLoading}
        error={errorMessage}
        pagination={pagination}
        onPageChange={setPage}
        onRetry={refetch}
      />
    </div>
  );
}

export default Home;
