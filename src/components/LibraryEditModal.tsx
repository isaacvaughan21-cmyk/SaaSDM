import { useState } from 'react';
import type { LibraryIdea } from '../state/types';
import { NicheSelect } from './NicheSelect';

type Props = {
  idea: LibraryIdea;
  niches: string[];
  onSave: (id: string, name: string, description: string, niche: string) => Promise<void>;
  onCancel: () => void;
};

export function LibraryEditModal({ idea, niches, onSave, onCancel }: Props) {
  const [name, setName] = useState(idea.name);
  const [description, setDescription] = useState(idea.description);
  const [niche, setNiche] = useState(idea.niche ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave(idea.id, name, description, niche);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-paper rounded-2xl shadow-lift w-full max-w-md mx-4 p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-semibold text-ink mb-1">Edit idea</h2>
        <p className="text-sm text-muted mb-5">Update the name or notes for this idea.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Idea name <span className="text-bad">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-line rounded-lg px-3 py-2 text-sm text-ink bg-paper focus:outline-none focus:ring-1 focus:ring-ink placeholder:text-muted"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Niche <span className="text-muted">(optional)</span>
            </label>
            <NicheSelect value={niche} niches={niches} onChange={setNiche} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Notes <span className="text-muted">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Notes on the idea, the problem, or who it's for…"
              className="w-full border border-line rounded-lg px-3 py-2 text-sm text-ink bg-paper focus:outline-none focus:ring-1 focus:ring-ink placeholder:text-muted resize-y"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm text-muted hover:bg-ink-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-5 py-2 bg-ink text-paper text-sm font-semibold rounded-lg hover:bg-ink-700 transition-colors disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
