import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useAnalyticsQuery } from '../queries/useArticleQueries.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import StatusPill from '../components/ui/StatusPill.jsx';

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function Analytics() {
  const { data, isLoading, error } = useAnalyticsQuery();
  const errorMessage = error?.response?.data?.message || error?.message || '';

  if (isLoading) return <LoadingSpinner label="Loading analytics..." />;

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
        {errorMessage}
      </div>
    );
  }

  const chartData = (data?.categoryBreakdown || []).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">Dedup rates, categories, and source health</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Articles" value={data?.totalArticles ?? 0} />
        <StatCard
          label="Multi-source Stories"
          value={data?.multiSourceArticles ?? 0}
          sub="Same story, multiple sources"
        />
        <StatCard
          label="Dedup Rate"
          value={`${((data?.dedupRate ?? 0) * 100).toFixed(1)}%`}
          sub="Articles with 2+ sources"
        />
        <StatCard
          label="Avg Source Dedup"
          value={`${((data?.avgDedupRatio ?? 0) * 100).toFixed(1)}%`}
          sub="Per-fetch duplicate ratio"
        />
      </div>

      {chartData.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-4 text-lg font-medium text-white">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="category"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  color: '#e2e8f0',
                }}
              />
              <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {(data?.sentimentBreakdown || []).length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-4 text-lg font-medium text-white">Sentiment Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.sentimentBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  color: '#e2e8f0',
                }}
              />
              <Bar dataKey="count" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="mb-4 text-lg font-medium text-white">Source Health</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="pb-3 pr-4 font-medium">Source</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Fetched</th>
                <th className="pb-3 pr-4 font-medium">Dedup Ratio</th>
                <th className="pb-3 font-medium">Last Fetch</th>
              </tr>
            </thead>
            <tbody>
              {(data?.sourceStats || []).map((source) => (
                <tr key={source.slug} className="border-b border-slate-800/50">
                  <td className="py-3 pr-4 text-white">{source.name}</td>
                  <td className="py-3 pr-4">
                    <StatusPill status={source.status} />
                  </td>
                  <td className="py-3 pr-4 text-slate-300">{source.articlesFetched}</td>
                  <td className="py-3 pr-4 text-slate-300">
                    {((source.dedupRatio ?? 0) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-slate-400">
                    {source.lastFetchedAt
                      ? new Date(source.lastFetchedAt).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
