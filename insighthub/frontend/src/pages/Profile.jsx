import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PreferencesForm from '../components/profile/PreferencesForm.jsx';
import SavedList from '../components/profile/SavedList.jsx';
import HistoryList from '../components/profile/HistoryList.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { cn } from '../utils/cn.js';

const TABS = [
  { id: 'settings', label: 'Settings' },
  { id: 'saved', label: 'Saved' },
  { id: 'history', label: 'History' },
];

function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');

  if (!user) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {user.name} · {user.email}
        </p>
      </div>

      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900/60">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium transition',
              activeTab === tab.id
                ? 'bg-white text-sky-600 shadow-sm dark:bg-slate-800 dark:text-sky-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'settings' && <PreferencesForm />}
      {activeTab === 'saved' && <SavedList />}
      {activeTab === 'history' && <HistoryList />}
    </div>
  );
}

export default Profile;
