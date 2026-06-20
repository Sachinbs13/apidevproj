import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../store/authSlice.js';
import { ROUTES } from '../constants/routes.js';
import { cn } from '../utils/cn.js';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.FEED, { replace: true });
  }, [isAuthenticated, navigate]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) dispatch(clearError());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const action =
      mode === 'login'
        ? login({ email: form.email, password: form.password })
        : register(form);
    const result = await dispatch(action);
    if (!result.error) navigate(ROUTES.FEED);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to={ROUTES.FEED} className="text-2xl font-semibold text-white">
            InsightHub
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div className="mb-6 flex rounded-lg border border-slate-800 bg-slate-900 p-1">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                dispatch(clearError());
              }}
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-medium capitalize transition',
                mode === m ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white',
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          {mode === 'register' && (
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-600"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm text-slate-400">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-600"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-400">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-600"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-800/60 bg-red-950/30 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to={ROUTES.FEED} className="text-sky-500 hover:text-sky-400">
            Continue without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
