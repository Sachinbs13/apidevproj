import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../store/authSlice.js';
import { ROUTES } from '../constants/routes.js';
import { INPUT_CLASS } from '../constants/formStyles.js';
import { cn } from '../utils/cn.js';
import OnboardingForm from '../components/auth/OnboardingForm.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [mode, setMode] = useState('login');
  const [registerStep, setRegisterStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.FEED, { replace: true });
  }, [isAuthenticated, navigate]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) dispatch(clearError());
  }

  function resetRegisterFlow() {
    setRegisterStep(1);
    setForm({ name: '', email: '', password: '' });
  }

  async function submitRegister(preferences) {
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      ...(preferences ? { preferences } : {}),
    };
    const result = await dispatch(register(payload));
    if (!result.error) navigate(ROUTES.FEED);
  }

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    if (mode === 'login') {
      const result = await dispatch(
        login({ email: form.email, password: form.password }),
      );
      if (!result.error) navigate(ROUTES.FEED);
      return;
    }
    setRegisterStep(2);
  }

  async function handleOnboardingComplete(preferences) {
    await submitRegister(preferences);
  }

  async function handleOnboardingSkip() {
    await submitRegister();
  }

  const cardClass =
    'rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50';

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to={ROUTES.FEED}
            className="text-2xl font-semibold text-slate-900 dark:text-white"
          >
            InsightHub
          </Link>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login'
              ? 'Sign in to your account'
              : registerStep === 1
                ? 'Create a new account'
                : 'Almost done — personalize your feed'}
          </p>
        </div>

        {mode === 'register' && registerStep === 2 ? (
          <div className={cardClass}>
            <OnboardingForm
              onComplete={handleOnboardingComplete}
              onSkip={handleOnboardingSkip}
              loading={loading}
            />
            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={() => setRegisterStep(1)}
              className="mt-4 w-full text-center text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              ← Back to account details
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    resetRegisterFlow();
                    dispatch(clearError());
                  }}
                  className={cn(
                    'flex-1 rounded-md py-2 text-sm font-medium capitalize transition',
                    mode === m
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <form onSubmit={handleCredentialsSubmit} className={cn('space-y-4', cardClass)}>
              {mode === 'register' && (
                <div>
                  <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-400">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={INPUT_CLASS}
                  />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-400">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-400">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className={INPUT_CLASS}
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-sky-600 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Sign in'
                    : 'Continue'}
              </button>
            </form>
          </>
        )}

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link
            to={ROUTES.FEED}
            className="text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
          >
            Continue without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
