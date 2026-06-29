import { useState, useEffect } from 'react';
import { getInterestsForOccupation, OCCUPATIONS, LANGUAGES } from '../../constants/occupationInterests.js';
import { INDIAN_STATES } from '../../constants/indianStates.js';
import { cn } from '../../utils/cn.js';
import Select from '../ui/Select.jsx';

function OnboardingForm({ onComplete, onSkip, loading }) {
  const [occupation, setOccupation] = useState('General');
  const [interests, setInterests] = useState(getInterestsForOccupation('General'));
  const [state, setState] = useState('National');
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  useEffect(() => {
    setInterests(getInterestsForOccupation(occupation));
  }, [occupation]);

  function toggleInterest(item) {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    onComplete({
      occupation,
      interests,
      topics: interests,
      state,
      preferredLanguage,
      onboardingCompleted: true,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Personalize your feed</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tell us about yourself for a better news experience.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-400">Occupation</label>
          <Select
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full"
          >
            {OCCUPATIONS.map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-600 dark:text-slate-400">Interests</label>
          <div className="flex flex-wrap gap-2">
            {getInterestsForOccupation(occupation).map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => toggleInterest(topic)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs capitalize transition',
                  interests.includes(topic)
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-300 text-slate-600 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white',
                )}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-400">State</label>
            <Select value={state} onChange={(e) => setState(e.target.value)} className="w-full">
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-400">Language</label>
            <Select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-sky-600 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Finish & go to Home'}
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-600 transition hover:border-sky-400 hover:text-sky-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
        >
          Skip for now
        </button>
      </div>
    </form>
  );
}

export default OnboardingForm;
