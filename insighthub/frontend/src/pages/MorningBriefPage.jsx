import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchTodayBrief } from '../api/newsApi.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam'];

function MorningBriefPage() {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState('English');
  const [lengthMode, setLengthMode] = useState('2min'); // '2min' or '5min'
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    async function loadBrief() {
      setLoading(true);
      try {
        const res = await fetchTodayBrief({ lang: selectedLang });
        setBrief(res.data);
      } catch (err) {
        toast.error('Failed to load morning brief.');
      } finally {
        setLoading(false);
      }
    }
    loadBrief();
  }, [selectedLang]);

  // Simulated audio summary reading progress bar
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  function handlePlayAudio() {
    setIsPlaying(!isPlaying);
  }

  if (loading) return <LoadingSpinner />;

  const displayText = lengthMode === '2min' ? brief?.digest2Min : brief?.digest5Min;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-900/60 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            AI Morning Brief
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Tailored intelligence digest for your profile: <span className="font-semibold text-sky-400">{brief?.occupation || 'General'}</span>
          </p>
        </div>

        {/* Language Selection */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/40 p-1 rounded-xl border border-slate-900/60">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition duration-150 ${
                selectedLang === lang
                  ? 'bg-sky-600/90 text-white shadow-lg shadow-sky-950/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Main SaaS Digest Board */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary Container */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md lg:col-span-2 space-y-6">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-900/50 p-1 border border-slate-900/40">
            <button
              onClick={() => setLengthMode('2min')}
              className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition duration-150 ${
                lengthMode === '2min' ? 'bg-sky-600/80 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ 2-Minute Summary
            </button>
            <button
              onClick={() => setLengthMode('5min')}
              className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition duration-150 ${
                lengthMode === '5min' ? 'bg-sky-600/80 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 5-Minute In-Depth
            </button>
          </div>

          {/* Digest Body */}
          <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed text-sm">
            {displayText || 'No brief compiled for today yet. Make sure sources have fetched content.'}
          </div>
        </div>

        {/* Audio Summary player Widget */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-900 bg-gradient-to-br from-slate-950 to-sky-950/20 p-6 backdrop-blur-md">
          <div className="space-y-3">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
              Future Ready
            </span>
            <h3 className="text-lg font-extrabold text-white">Audio Summary Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Listen to today's news summary formatted specifically for dynamic speech-to-text synthesis.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Audio wave simulator */}
            <div className="flex items-end justify-center gap-1.5 h-12">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-sky-500/80 rounded-full transition-all duration-300"
                  style={{
                    height: isPlaying ? `${Math.floor(Math.random() * 40) + 8}px` : '4px',
                  }}
                />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-sky-500 transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                <span>{isPlaying ? 'Synthesizing Brief' : 'Ready'}</span>
                <span>{audioProgress}%</span>
              </div>
            </div>

            {/* Play controls */}
            <button
              onClick={handlePlayAudio}
              className={`w-full rounded-xl py-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                isPlaying
                  ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                  : 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/10'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  Pause Audio
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Listen Brief
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MorningBriefPage;
