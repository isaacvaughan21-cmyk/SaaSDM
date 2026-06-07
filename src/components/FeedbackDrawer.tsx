import { useState } from 'react';
import { addFeedback, type FeedbackType } from '../lib/supabase';

type Props = {
  onClose: () => void;
  onSent: () => void;
};

const FEEDBACK_EMAIL = 'isaacvaughan21@gmail.com';

export function FeedbackDrawer({ onClose, onSent }: Props) {
  const [type, setType] = useState<FeedbackType>('feature');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    setError('');
    const result = await addFeedback(type, message);
    setBusy(false);

    if (result === 'ok') {
      onSent();
      onClose();
    } else if (result === 'unconfigured') {
      // Backend not wired yet — fall back to an email.
      const subject =
        type === 'feature' ? '[Idea Matrix] Feature request' : '[Idea Matrix] Bug report';
      window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message.trim())}`;
      onSent();
      onClose();
    } else {
      setError('Something went wrong — please try again.');
    }
  };

  const TypeButton = ({ value, label, hint }: { value: FeedbackType; label: string; hint: string }) => {
    const active = type === value;
    return (
      <button
        type="button"
        onClick={() => setType(value)}
        className={`flex-1 rounded-lg border px-4 py-3 text-left transition-colors ${
          active ? 'border-ink bg-ink-50' : 'border-line bg-surface hover:border-muted'
        }`}
      >
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted mt-0.5">{hint}</span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-md h-full overflow-y-auto shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-surface border-b border-line px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Send feedback</h2>
          <button onClick={onClose} className="text-muted hover:text-ink text-xl" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={send} className="px-6 py-5 space-y-5">
          <p className="text-sm text-muted">
            Have an idea to make this better, or hit something broken? Let me know.
          </p>

          <div>
            <span className="kicker text-muted">What kind of feedback?</span>
            <div className="mt-2 flex gap-3">
              <TypeButton value="feature" label="Feature request" hint="Something you wish it did" />
              <TypeButton value="bug" label="Bug report" hint="Something that's not working" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              {type === 'feature' ? 'Describe the feature' : 'Describe the bug'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder={
                type === 'feature'
                  ? 'I’d love to be able to…'
                  : 'What happened, and what did you expect?'
              }
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || busy}
            className="w-full px-4 py-2.5 rounded-md bg-ink text-paper text-sm font-semibold hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? 'Sending…' : 'Send feedback'}
          </button>
          {error && <p className="text-sm text-bad text-center">{error}</p>}
          <p className="text-xs text-muted text-center">Sent straight to the maker — no email needed.</p>
        </form>
      </div>
    </div>
  );
}
