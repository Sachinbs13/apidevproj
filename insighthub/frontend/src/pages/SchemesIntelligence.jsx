import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchRecommendedSchemes } from '../api/newsApi.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

function SchemesIntelligence() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadSchemes() {
      try {
        const res = await fetchRecommendedSchemes();
        setSchemes(res.data || []);
      } catch (err) {
        toast.error('Failed to load recommended schemes.');
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, []);

  if (loading) return <LoadingSpinner />;

  const filteredSchemes = schemes.filter(s =>
    s.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.benefits.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.eligibility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Government Scheme Intelligence</h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time tracker of Indian welfare, scholarship, and credit schemes detected in news feeds.
          </p>
        </div>

        {/* Search filter */}
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter schemes by benefits/eligibility..."
          className="w-full md:w-80 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white outline-none focus:border-sky-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredSchemes.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
            No government schemes match your filter criteria or have been parsed from news feeds yet.
          </div>
        ) : (
          filteredSchemes.map((scheme) => (
            <div
              key={scheme.schemeName}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/35 p-6 transition duration-200 hover:border-slate-700"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-extrabold text-white text-lg tracking-tight">
                    {scheme.schemeName}
                  </h3>
                  <span className="rounded-full bg-sky-950 px-2.5 py-0.5 text-xs text-sky-400 font-bold uppercase tracking-wider">
                    {scheme.category || 'General'}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Target Eligibility
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-300 leading-relaxed">
                      {scheme.eligibility}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Benefits & Subsidies
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-300 leading-relaxed">
                      {scheme.benefits}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-800 pt-4 sm:flex-row sm:items-center">
                <div className="text-xs text-slate-500">
                  Parsed from: <span className="font-semibold text-slate-400">{scheme.latestNewsTitle || 'Source article'}</span>
                </div>
                <a
                  href={scheme.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-sky-600 px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-sky-500"
                >
                  Visit Portal ↗
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SchemesIntelligence;
