import { useState } from 'react';
import { supabase, addSubscriber } from '../lib/supabase';

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

type Tab = 'signin' | 'signup';

export function AuthModal({ onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [optIn, setOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);

  const switchTab = (t: Tab) => {
    setTab(t);
    setError(null);
    setConfirmMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);

    if (tab === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      onSuccess();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // opt-in to email marketing (best-effort; never blocks signup)
      if (optIn) {
        try {
          await addSubscriber(email);
        } catch {
          /* ignore — signup already succeeded */
        }
      }
      setConfirmMsg('Check your email for a confirmation link, then sign in.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-paper rounded-2xl shadow-lift w-full max-w-sm mx-4 p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold text-ink">
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-muted mt-1">
            Save ideas to your Library and access them from any device.
          </p>
        </div>

        {/* tabs */}
        <div className="flex gap-5 mb-5 border-b border-line">
          {(['signin', 'signup'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`pb-2.5 text-sm font-medium transition-colors ${
                tab === t
                  ? 'text-ink border-b-2 border-ink -mb-px'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {t === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* confirm message after sign-up */}
        {confirmMsg ? (
          <p className="text-sm text-ink bg-wash rounded-lg p-3">{confirmMsg}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-line rounded-lg px-3 py-2 text-sm text-ink bg-paper focus:outline-none focus:ring-1 focus:ring-ink placeholder:text-muted"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === 'signup' ? 'At least 6 characters' : ''}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm text-ink bg-paper focus:outline-none focus:ring-1 focus:ring-ink placeholder:text-muted"
              />
            </div>
            {tab === 'signup' && (
              <label className="flex items-start gap-2 cursor-pointer select-none pt-0.5">
                <input
                  type="checkbox"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="mt-0.5 accent-ink w-3.5 h-3.5 shrink-0"
                />
                <span className="text-xs text-muted leading-snug">
                  Email me occasional founder tips and product updates. No spam, unsubscribe
                  anytime.
                </span>
              </label>
            )}
            {error && <p className="text-xs text-bad">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-ink text-paper text-sm font-semibold rounded-lg hover:bg-ink-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading…' : tab === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
