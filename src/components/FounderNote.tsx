import { useState } from 'react';
import profilePic from '../assets/profilepic.png';

// Where list signups are delivered. Swap this mailto flow for a hosted
// provider (Buttondown / ConvertKit / Formspree) by pointing `submit` at their
// form endpoint when you have an account.
const LIST_EMAIL = 'isaacvaughan21@gmail.com';

export function FounderNote() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const subject = 'Join the email list — The Idea Matrix';
    const body = `Please add me to the list: ${email.trim()}`;
    window.location.href = `mailto:${LIST_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setJoined(true);
  };

  return (
    <section className="mt-14 border-t border-line pt-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-4">
          <img
            src={profilePic}
            alt="Isaac, founder of The Idea Matrix"
            className="w-16 h-16 rounded-full object-cover border border-line shadow-card shrink-0"
          />
          <div>
            <p className="kicker text-muted">A note from the founder</p>
            <p className="font-display text-lg font-semibold text-ink mt-0.5">Isaac</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-ink leading-relaxed">
          <p>
            Hi, I'm Isaac — founder of <span className="font-display font-semibold">The Idea Matrix</span>.
          </p>
          <p>
            Like you, I'm new to SaaS. I have a notebook full of ideas and no clear way to know which
            one is worth building.
          </p>
          <p>
            My background is in mechanical engineering, where we use decision matrices in R&amp;D to
            score competing concepts against weighted criteria and move forward with the strongest
            one. It works. So I built this tool to bring that same rigor to choosing a SaaS idea — no
            more gut-feel guessing.
          </p>
          <p>
            This is just the start. As I go deeper into my own SaaS journey, I'll keep adding the
            workflows and frameworks I find genuinely useful, and I'd love your feedback along the
            way.
          </p>
        </div>

        {/* Email list signup */}
        <div className="mt-8 rounded-2xl border border-line bg-surface shadow-card p-6 md:p-8">
          <h3 className="font-display text-2xl font-semibold text-ink">Want to build alongside me?</h3>
          <p className="mt-2 text-muted leading-relaxed">
            Join the email list to get every new feature the moment it ships. No spam — and
            everything stays 100% free until my first SaaS hits{' '}
            <span className="font-semibold text-ink">$1,000 MRR</span>.
          </p>

          {joined ? (
            <p className="mt-5 text-ink font-medium">
              Thanks — you're on the list. Check your email client to send the confirmation. ✓
            </p>
          ) : (
            <form onSubmit={submit} className="mt-5 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-md border border-line bg-paper px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              />
              <button
                type="submit"
                disabled={!valid}
                className="rounded-md bg-ink px-6 py-3 text-paper text-sm font-semibold hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                Join the list
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
