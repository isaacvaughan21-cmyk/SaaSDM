import { useEffect, useReducer, useState } from 'react';
import type { Idea, Weights } from './state/types';
import { reducer } from './state/reducer';
import { loadState, saveState } from './state/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { IdeaModal } from './components/IdeaModal';
import { WeightsDrawer } from './components/WeightsDrawer';
import { FeedbackDrawer } from './components/FeedbackDrawer';

const loaded = loadState();

export default function App() {
  const [state, dispatch] = useReducer(reducer, loaded.state);
  const [modalIdea, setModalIdea] = useState<Idea | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [weightsOpen, setWeightsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // persist on every change (debounced)
  useEffect(() => {
    const t = setTimeout(() => saveState(state), 250);
    return () => clearTimeout(t);
  }, [state]);

  // one-time corruption notice
  useEffect(() => {
    if (loaded.corrupted) {
      showToast('Saved data was unreadable — started fresh.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  const openNew = () => {
    setModalIdea(null);
    setModalOpen(true);
  };
  const openEdit = (idea: Idea) => {
    setModalIdea(idea);
    setModalOpen(true);
  };
  const saveIdea = (idea: Idea) => {
    if (state.ideas.some((i) => i.id === idea.id)) {
      dispatch({ type: 'update', idea });
    } else {
      dispatch({ type: 'add', idea });
    }
    setModalOpen(false);
  };
  const saveWeights = (weights: Weights) => {
    dispatch({ type: 'setWeights', weights });
    setWeightsOpen(false);
    showToast('Weights saved — scores recomputed.');
  };

  const doExportPdf = async () => {
    if (state.ideas.length === 0) return;
    const { exportPdf } = await import('./lib/exportPdf');
    exportPdf(state);
    showToast('PDF report downloaded.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-10">
      <Header
        onFeedback={() => setFeedbackOpen(true)}
        onWeights={() => setWeightsOpen(true)}
        onExportPdf={doExportPdf}
        onNew={openNew}
        canExport={state.ideas.length > 0}
      />

      <div className="mb-8">
        <Hero onNew={openNew} ideaCount={state.ideas.length} />
      </div>

      <Dashboard
        ideas={state.ideas}
        weights={state.weights}
        onNew={openNew}
        onEdit={openEdit}
        onDelete={(id) => dispatch({ type: 'delete', id })}
      />

      {modalOpen && (
        <IdeaModal
          initial={modalIdea}
          weights={state.weights}
          onSave={saveIdea}
          onCancel={() => setModalOpen(false)}
        />
      )}
      {weightsOpen && (
        <WeightsDrawer
          weights={state.weights}
          onSave={saveWeights}
          onClose={() => setWeightsOpen(false)}
        />
      )}
      {feedbackOpen && (
        <FeedbackDrawer
          onClose={() => setFeedbackOpen(false)}
          onSent={() => showToast('Thanks — opening your email app.')}
        />
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-ink text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
