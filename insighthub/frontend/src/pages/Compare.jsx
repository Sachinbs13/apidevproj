import { useState } from 'react';
import { compareByTopic } from '../api/newsApi.js';
import ArticleCard from '../components/ui/ArticleCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

function Compare() {
  const [topic, setTopic] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [multiSource, setMultiSource] = useState([]);
  const [singleSource, setSingleSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setSubmitted(topic);
    try {
      const res = await compareByTopic(topic.trim());
      setMultiSource(res.data?.multiSource || []);
      setSingleSource(res.data?.singleSource || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Source Comparison</h1>
        <p className="mt-1 text-sm text-slate-400">
          See how the same story is covered across multiple news sources
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g. climate, AI, election)"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-600"
        />
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
        >
          Compare
        </button>
      </form>

      {loading && <LoadingSpinner label="Comparing sources..." />}

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {submitted && !loading && (
        <>
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-emerald-400">
              Multi-source coverage
              <span className="rounded-full bg-emerald-950/60 px-2 py-0.5 text-xs">
                {multiSource.length}
              </span>
            </h2>
            {multiSource.length === 0 ? (
              <p className="text-sm text-slate-500">No multi-source stories found for this topic.</p>
            ) : (
              <div className="space-y-3">
                {multiSource.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-slate-300">
              Single-source stories
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
                {singleSource.length}
              </span>
            </h2>
            {singleSource.length === 0 ? (
              <p className="text-sm text-slate-500">No single-source stories found.</p>
            ) : (
              <div className="space-y-3">
                {singleSource.slice(0, 10).map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Compare;
