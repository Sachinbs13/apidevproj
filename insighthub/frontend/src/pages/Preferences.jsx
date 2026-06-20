import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { savePreferences } from '../api/newsApi.js';
import { updatePreferences } from '../store/authSlice.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

const SUGGESTED_TOPICS = ['technology', 'politics', 'business', 'science', 'health', 'sports'];
const SUGGESTED_SOURCES = ['newsapi', 'gnews', 'guardian', 'nyt', 'rss-bbc'];

function Preferences() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [topics, setTopics] = useState([]);
  const [sources, setSources] = useState([]);
  const [topicInput, setTopicInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setTopics(user.preferences.topics || []);
      setSources(user.preferences.sources || []);
    }
  }, [user]);

  function toggleItem(list, setList, item) {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  }

  function addTopic(e) {
    e.preventDefault();
    const t = topicInput.trim().toLowerCase();
    if (t && !topics.includes(t)) setTopics((prev) => [...prev, t]);
    setTopicInput('');
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await savePreferences({ topics, sources });
      dispatch(updatePreferences(res.data.preferences));
      toast.success('Preferences saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Preferences</h1>
        <p className="mt-1 text-sm text-slate-400">
          Customize your feed topics and preferred sources for {user.name}
        </p>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="mb-3 text-sm font-medium text-slate-300">Topics</h2>
        <form onSubmit={addTopic} className="mb-3 flex gap-2">
          <input
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Add a topic..."
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-600"
          />
          <button
            type="submit"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Add
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => toggleItem(topics, setTopics, topic)}
              className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                topics.includes(topic)
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        {topics.length > 0 && (
          <p className="mt-3 text-xs text-slate-500">Selected: {topics.join(', ')}</p>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="mb-3 text-sm font-medium text-slate-300">Preferred Sources</h2>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SOURCES.map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => toggleItem(sources, setSources, source)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                sources.includes(source)
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
        {sources.length > 0 && (
          <p className="mt-3 text-xs text-slate-500">Selected: {sources.join(', ')}</p>
        )}
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save preferences'}
      </button>
    </div>
  );
}

export default Preferences;
