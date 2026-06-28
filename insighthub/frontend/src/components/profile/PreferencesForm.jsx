import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { savePreferences } from '../../api/newsApi.js';
import { updatePreferences } from '../../store/authSlice.js';
import { INDIAN_STATES } from '../../constants/indianStates.js';
import {
  OCCUPATIONS,
  SUGGESTED_SOURCES,
  SUGGESTED_TOPICS,
  LANGUAGES,
  getInterestsForOccupation,
} from '../../constants/occupationInterests.js';
import { cn } from '../../utils/cn.js';

function PreferencesForm({ compact = false }) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [topics, setTopics] = useState([]);
  const [interests, setInterests] = useState([]);
  const [sources, setSources] = useState([]);
  const [occupation, setOccupation] = useState('General');
  const [state, setState] = useState('National');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [topicInput, setTopicInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [suggestedInterests, setSuggestedInterests] = useState(getInterestsForOccupation('General'));

  useEffect(() => {
    if (user?.preferences) {
      setTopics(user.preferences.topics || []);
      setInterests(user.preferences.interests || user.preferences.topics || []);
      setSources(user.preferences.sources || []);
      setOccupation(user.preferences.occupation || 'General');
      setState(user.preferences.state || 'National');
      setPreferredLanguage(user.preferences.preferredLanguage || 'English');
      setSuggestedInterests(getInterestsForOccupation(user.preferences.occupation || 'General'));
    }
  }, [user]);

  function handleOccupationChange(value) {
    setOccupation(value);
    const suggested = getInterestsForOccupation(value);
    setSuggestedInterests(suggested);
    setInterests(suggested);
    setTopics((prev) => {
      const merged = new Set([...suggested, ...prev]);
      return [...merged];
    });
  }

  function toggleItem(list, setList, item) {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  }

  function toggleInterest(item) {
    setInterests((prev) => {
      const next = prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item];
      setTopics((topicPrev) => {
        const merged = new Set([...next, ...topicPrev.filter((t) => !suggestedInterests.includes(t))]);
        return [...merged];
      });
      return next;
    });
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
        interests,
        sources,
        occupation,
        state,
        preferredLanguage,
        onboardingCompleted: true,
      });
      dispatch(updatePreferences(res.data.preferences));
      toast.success('Profile preferences saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-600';

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Profile & region
        </h2>
        <div className={cn('grid gap-4', compact ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Occupation</label>
            <select value={occupation} onChange={(e) => handleOccupationChange(e.target.value)} className={inputClass}>
              {OCCUPATIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">State</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className={inputClass}>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Summary language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className={inputClass}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Interest topics
        </h2>
        <p className="mb-3 text-xs text-slate-500">
          Suggested for {occupation}. Tap to toggle.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestedInterests.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => toggleInterest(topic)}
              className={cn(
                'rounded-full px-3 py-1 text-xs capitalize transition',
                interests.includes(topic)
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-300 text-slate-600 hover:border-sky-400 dark:border-slate-700 dark:text-slate-400',
              )}
            >
              {topic}
            </button>
          ))}
        </div>
        {!compact && (
          <>
            <form onSubmit={addTopic} className="mb-3 flex gap-2">
              <input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Add custom topic..."
                className={cn(inputClass, 'flex-1')}
              />
              <button
                type="submit"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
                  className={cn(
                    'rounded-full px-3 py-1 text-xs capitalize transition',
                    topics.includes(topic)
                      ? 'bg-sky-600 text-white'
                      : 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400',
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {!compact && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Preferred sources
          </h2>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SOURCES.map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => toggleItem(sources, setSources, source)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs transition',
                  sources.includes(source)
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400',
                )}
              >
                {source}
              </button>
            ))}
          </div>
        </section>
      )}

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

export default PreferencesForm;
