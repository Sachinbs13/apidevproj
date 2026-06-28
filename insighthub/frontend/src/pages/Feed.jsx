import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchNews, fetchPersonalizedFeed, fetchSources, fetchTodayBrief } from '../api/newsApi.js';
import ArticleCard from '../components/ui/ArticleCard.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import StatusPill from '../components/ui/StatusPill.jsx';
import toast from 'react-hot-toast';

const CATEGORIES = ['general', 'technology', 'business', 'politics', 'science', 'health', 'sports'];

function Feed() {
  const { user } = useAuth();
  const [feedMode, setFeedMode] = useState('global'); // 'personalized' or 'global'
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [sources, setSources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [page, setPage] = useState(1);
  const [todayBrief, setTodayBrief] = useState(null);

  const liveArticles = useSelector((state) => state.news.liveArticles);

  // Initialize mode based on user authentication
  useEffect(() => {
    if (user) {
      setFeedMode('personalized');
    } else {
      setFeedMode('global');
    }
  }, [user]);

  // Load news sources
  useEffect(() => {
    fetchSources()
      .then((res) => setSources(res.data || []))
      .catch(() => {});
  }, []);

  // Fetch today's summary brief in recommended mode
  useEffect(() => {
    if (user && feedMode === 'personalized') {
      fetchTodayBrief({ lang: user.preferences?.preferredLanguage || 'English' })
        .then((res) => setTodayBrief(res.data))
        .catch(() => {});
    } else {
      setTodayBrief(null);
    }
  }, [user, feedMode]);

  // Fetch news feed content
  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (feedMode === 'personalized' && user) {
          res = await fetchPersonalizedFeed({ page, limit: 15 });
          const docs = res.data?.articles || [];
          setArticles(docs);
          setPagination({
            page: res.data?.page || page,
            limit: res.data?.limit || 15,
            totalPages: Math.ceil((res.data?.total || 0) / (res.data?.limit || 15)) || 1
          });
        } else {
          res = await fetchNews({
            page,
            limit: 15,
            category: selectedCategory || undefined,
            source: selectedSource || undefined
          });
          setArticles(res.data?.articles || []);
          setPagination(res.pagination || { page: 1, limit: 15, totalPages: 1 });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load feed.');
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [feedMode, user, selectedCategory, selectedSource, page]);

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  function handleModeChange(mode) {
    if (mode === 'personalized' && !user) {
      toast.error('Log in to unlock personalized feeds');
      return;
    }
    setPage(1);
    setFeedMode(mode);
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Headline & Greeting */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-900/60 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Intelligence Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            {user && feedMode === 'personalized' ? (
              <span>
                Personalized feed for: <span className="font-semibold text-sky-400">{user.preferences?.occupation || 'General'}</span> in <span className="font-semibold text-emerald-400">{user.preferences?.state || 'National'}</span>
              </span>
            ) : (
              <span>Global aggregated news flow analytics stream</span>
            )}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-slate-900/40 p-1 border border-slate-900/60 backdrop-blur-sm">
          <button
            onClick={() => handleModeChange('personalized')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              feedMode === 'personalized' ? 'bg-sky-600/90 text-white shadow-lg shadow-sky-950/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Recommended
          </button>
          <button
            onClick={() => handleModeChange('global')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              feedMode === 'global' ? 'bg-sky-600/90 text-white shadow-lg shadow-sky-950/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 General Stream
          </button>
        </div>
      </div>

      {/* Today's Brief Hero Banner */}
      {feedMode === 'personalized' && todayBrief && (
        <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-r from-slate-950 to-sky-950/30 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 h-40 w-40 rounded-full bg-sky-500/5 blur-2xl"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-900/50 pb-3 mb-4">
            <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-400">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
              ⚡ Today's Morning Intelligence Digest (2-Min)
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Occupation Profile: {todayBrief.occupation}</span>
          </div>
          <p className="text-sm font-semibold text-slate-350 leading-relaxed italic">
            "{todayBrief.digest2Min}"
          </p>
        </div>
      )}

      {/* Conditional Filtering Panel */}
      {feedMode === 'global' && (
        <div className="space-y-4 rounded-2xl border border-slate-900 bg-slate-950/25 p-4.5 backdrop-blur-md">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => { setSelectedCategory(''); setPage(1); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide transition ${
                !selectedCategory
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/35'
                  : 'bg-slate-900 border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              All Topics
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/35'
                    : 'bg-slate-900 border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-slate-900/60 pt-3">
              {sources.map((src) => (
                <button
                  key={src._id}
                  onClick={() => { setSelectedSource(selectedSource === src.name ? '' : src.name); setPage(1); }}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                    selectedSource === src.name
                      ? 'border-sky-500/30 bg-sky-950/20 text-sky-400 shadow-sm shadow-sky-950/20'
                      : 'border-slate-800 bg-slate-900/20 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {src.name}
                  <StatusPill status={src.status} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Grid SaaS Layout */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Articles Feed */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="py-24 flex justify-center">
              <LoadingSpinner label="Compiling intelligence feed..." />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-900 bg-red-950/10 p-6 text-center text-sm text-red-400">
              <p>{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-900 py-24 text-center text-slate-500 font-semibold">
              No articles match the current filter parameters. Make sure background sync or database seeding is complete.
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}

          {!loading && articles.length > 0 && (
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </div>

        {/* Live News flow Column */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-4 sticky top-24 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live News Flow
              </span>
              <span className="rounded bg-slate-900 px-1.5 py-0.2 text-[9px] font-bold text-slate-500 border border-slate-800">
                {liveArticles.length} Events
              </span>
            </div>
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto scrollbar-thin pr-1">
              {liveArticles.length === 0 ? (
                <div className="py-12 text-center text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Waiting for active news flow events from the socket channel...
                </div>
              ) : (
                liveArticles.slice(0, 10).map((art) => (
                  <div key={art._id} className="rounded-xl bg-slate-950/60 border border-slate-900/60 p-3 space-y-1.5 hover:border-slate-800 hover:bg-slate-900/10 transition duration-150">
                    <div className="flex justify-between items-center gap-2">
                      <span className="rounded bg-sky-950/60 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-sky-400 border border-sky-500/10">
                        {art.category}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {new Date(art.publishedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <a
                      href={art.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-xs font-bold text-slate-350 line-clamp-2 hover:text-sky-400 leading-snug"
                    >
                      {art.title}
                    </a>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">
                      {art.sources?.[0]?.sourceName || 'Source Ingest'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
