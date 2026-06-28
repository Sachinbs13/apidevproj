import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchTrendingRegions, fetchNews } from '../api/newsApi.js';
import ArticleCard from '../components/ui/ArticleCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

function LocalIntelligence() {
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [localNews, setLocalNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    async function loadRegions() {
      try {
        const res = await fetchTrendingRegions();
        setRegions(res.data || []);
      } catch (err) {
        toast.error('Failed to load state metrics.');
      } finally {
        setLoadingRegions(false);
      }
    }
    loadRegions();
  }, []);

  useEffect(() => {
    async function loadLocalNews() {
      if (!selectedState) return;
      setLoadingNews(true);
      try {
        const res = await fetchNews({ state: selectedState });
        setLocalNews(res.data.articles || []);
      } catch (err) {
        toast.error(`Failed to load news for ${selectedState}`);
      } finally {
        setLoadingNews(false);
      }
    }
    loadLocalNews();
  }, [selectedState]);

  if (loadingRegions) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Local Intelligence</h1>
        <p className="mt-1 text-sm text-slate-400">
          State-by-state news density, trending tags, and localized news feeds across India.
        </p>
      </div>

      {/* Grid of Indian States Dashboard */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {regions.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
            No local news indicators logged yet. Make sure articles are auto-tagged with state names.
          </div>
        ) : (
          regions.map((reg) => (
            <button
              key={reg.state}
              onClick={() => setSelectedState(reg.state)}
              className={`flex flex-col justify-between rounded-xl border p-4 text-left transition duration-200 ${
                selectedState === reg.state
                  ? 'border-sky-500 bg-sky-950/20 shadow-md'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-base">{reg.state}</h3>
                  <span className="rounded-full bg-sky-900/50 px-2 py-0.5 text-xs text-sky-400 font-semibold">
                    {reg.articleCount} Articles
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Trending Category:
                </p>
                <div className="mt-1">
                  <span className="rounded-md bg-slate-950 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                    {reg.trendingTopic}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Selected State News Feed */}
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/20 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📍 Local Feed — <span className="text-sky-400">{selectedState}</span>
          </h2>
          {loadingNews && <span className="text-xs text-slate-500">Refreshing feed...</span>}
        </div>

        {loadingNews ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : localNews.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No local articles reported in {selectedState} today.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {localNews.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LocalIntelligence;
