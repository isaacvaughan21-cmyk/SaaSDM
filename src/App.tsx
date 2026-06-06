import { useEffect, useReducer, useRef, useState } from 'react';
import type { AppState, Idea, Weights } from './state/types';
import { reducer } from './state/reducer';
import { loadState, saveState } from './state/storage';
import { uuid } from './lib/uuid';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { IdeaModal } from './components/IdeaModal';
import { WeightsDrawer } from './components/WeightsDrawer';
import { HelpDrawer } from './components/HelpDrawer';

const loaded = loadState();

export default function App() {
  const [state, dispatch] = useReducer(reducer, loaded.state);
  const [modalIdea, setModalIdea] = useState<Idea | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [weightsOpen, setWeightsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

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

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `saas-ideas-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppState;
        if (parsed.schemaVersion !== 1) {
          showToast('Import failed — unsupported file version.');
          return;
        }
        if (
          state.ideas.length > 0 &&
          !confirm('This will replace your current ideas. Continue?')
        ) {
          return;
        }
        dispatch({ type: 'import', state: parsed });
        showToast('Import successful.');
      } catch {
        showToast('Import failed — invalid JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Header
        onHelp={() => setHelpOpen(true)}
        onWeights={() => setWeightsOpen(true)}
        onExport={exportJson}
        onImport={() => fileInput.current?.click()}
        onNew={openNew}
      />

      <input
        ref={fileInput}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importJson(f);
          e.target.value = '';
        }}
      />

      <Dashboard
        ideas={state.ideas}
        weights={state.weights}
        onNew={openNew}
        onEdit={openEdit}
        onDuplicate={(id) =>
          dispatch({ type: 'duplicate', id, newId: uuid(), now: new Date().toISOString() })
        }
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
      {helpOpen && <HelpDrawer onClose={() => setHelpOpen(false)} />}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
