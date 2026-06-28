import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { savePreferences } from '../api/newsApi.js';
import { updatePreferences } from '../store/authSlice.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

const SUGGESTED_TOPICS = ['technology', 'politics', 'business', 'science', 'health', 'sports'];
const SUGGESTED_SOURCES = ['newsapi', 'gnews', 'guardian', 'nyt', 'rss-bbc'];

const OCCUPATIONS = ['Student', 'Software Engineer', 'Investor', 'Farmer', 'General'];

const STATES = [
  'National',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Telangana',
  'Kerala',
  'Delhi',
  'Gujarat',
  'Andhra Pradesh',
  'Uttar Pradesh',
  'West Bengal',
  'Bihar',
  'Haryana',
  'Punjab',
  'Rajasthan',
  'Madhya Pradesh'
];

const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam'];

function Preferences() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [topics, setTopics] = useState([]);
  const [sources, setSources] = useState([]);
  const [occupation, setOccupation] = useState('General');
  const [state, setState] = useState('National');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [topicInput, setTopicInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setTopics(user.preferences.topics || []);
      setSources(user.preferences.sources || []);
      setOccupation(user.preferences.occupation || 'General');
      setState(user.preferences.state || 'National');
      setPreferredLanguage(user.preferences.preferredLanguage || 'English');
    }
  }, [user]);

  function toggleItem(list, setList, item) {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
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
      const res = await savePreferences({
        topics,
        sources,
        occupation,
        state,
        preferredLanguage
      });
      dispatch(updatePreferences(res.data.preferences));
      toast.success('Demographic preferences saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Demographic Intelligence Preferences</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure your professional profile and regional targets to personalize news feeds, morning briefs, and local analytics.
        </p>
      </div>

      {/* Profile/Occupation section */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
        <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">Demographics & Profile</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Occupation dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold">Occupation Profile</label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-600 outline-none"
            >
              {OCCUPATIONS.map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          {/* Preferred Indian State */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold">Geographic Hub (State)</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-600 outline-none"
            >
              {STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Preferred Language */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold">Preferred Summary Language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-600 outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Topics selection */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-300 uppercase">Key Interest Topics</h2>
        <form onSubmit={addTopic} className="mb-3 flex gap-2">
          <input
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Add dynamic keyword topic..."
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-600"
          />
          <button
            type="submit"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition"
          >
            Add Topic
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
      </section>

      {/* Sources selection */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-300 uppercase">Preferred Ingestion Channels</h2>
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
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
      >
        {saving ? 'Saving Configurations...' : 'Save Demographics Settings'}
      </button>
    </div>
  );
}

export default Preferences;
