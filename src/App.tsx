import { useEffect, useReducer, useState } from 'react';
import type { Idea, LibraryIdea, Weights } from './state/types';
import type { Score } from './state/types';
import { reducer } from './state/reducer';
import { loadState, saveState } from './state/storage';
import { compositeScore } from './state/scoring';
import { uuid } from './lib/uuid';
import { scoreLibraryIdea } from './lib/libraryDb';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { FounderNote } from './components/FounderNote';
import { IdeaModal } from './components/IdeaModal';
import { WeightsDrawer } from './components/WeightsDrawer';
import { FeedbackDrawer } from './components/FeedbackDrawer';
import { AuthModal } from './components/AuthModal';
import { LibraryView } from './components/LibraryView';
import { IdeaWorkspace } from './components/IdeaWorkspace';
import { VersionBadge } from './components/VersionBadge';

type Tab = 'matrix' | 'library';

const loaded = loadState();

function blankIdeaScores(): Idea['scores'] {
  return {
    desirability: { problemSeverity: 3 as Score, dogfoodingFit: 3 as Score, wedgeClarity: 3 as Score },
    feasibility: { timeToMvp: 3 as Score, skillMatch: 3 as Score, opComplexity: 3 as Score },
    viability: { profitability: 3 as Score, distributionPath: 3 as Score, wtpClarity: 3 as Score },
  };
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, loaded.state);
  const [activeTab, setActiveTab] = useState<Tab>('matrix');
  const { user, loading: authLoading, signOut } = useAuth();

  // modal state
  const [modalIdea, setModalIdea] = useState<Idea | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [weightsOpen, setWeightsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // library scoring state
  const [libraryScoringId, setLibraryScoringId] = useState<string | null>(null);
  const [libraryRefreshKey, setLibraryRefreshKey] = useState(0);
  const [workspaceIdea, setWorkspaceIdea] = useState<LibraryIdea | null>(null);

  // persist on every change
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

  // Matrix tab handlers
  const openNew = () => {
    setLibraryScoringId(null);
    setModalIdea(null);
    setModalOpen(true);
  };
  const openEdit = (idea: Idea) => {
    setLibraryScoringId(null);
    setModalIdea(idea);
    setModalOpen(true);
  };

  // Library → score a new idea
  const openScoreFromLibrary = (libraryIdea: LibraryIdea) => {
    const idea: Idea = {
      id: uuid(),
      name: libraryIdea.name,
      description: libraryIdea.description,
      scores: blankIdeaScores(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLibraryScoringId(libraryIdea.id);
    setModalIdea(idea);
    setModalOpen(true);
  };

  // Library → edit scores on an already-scored library idea
  const openEditFromLibrary = (libraryIdea: LibraryIdea) => {
    const idea: Idea = {
      id: uuid(),
      name: libraryIdea.name,
      description: libraryIdea.description,
      scores: libraryIdea.scores ?? blankIdeaScores(),
      createdAt: libraryIdea.created_at,
      updatedAt: libraryIdea.updated_at,
    };
    setLibraryScoringId(libraryIdea.id);
    setModalIdea(idea);
    setModalOpen(true);
  };

  const saveIdea = async (idea: Idea) => {
    // add / update in local matrix
    if (state.ideas.some((i) => i.id === idea.id)) {
      dispatch({ type: 'update', idea });
    } else {
      dispatch({ type: 'add', idea });
    }

    // if triggered from library, sync to Supabase too. scoreLibraryIdea sets
    // status='scored' (so "Score now" ideas move to the Scored list) and also
    // updates the scores + composite, so it's correct for re-scoring as well.
    if (libraryScoringId) {
      const cs = compositeScore(idea, state.weights);
      await scoreLibraryIdea(libraryScoringId, idea.scores, cs);
      setLibraryScoringId(null);
      setLibraryRefreshKey((k) => k + 1);
      showToast('Scores saved to your Library.');
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

  const handleSignIn = () => setAuthOpen(true);
  const handleAuthSuccess = () => {
    setAuthOpen(false);
    setActiveTab('library');
  };

  const handleTabChange = (tab: Tab) => {
    if (tab === 'library' && !user && !authLoading) {
      setAuthOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-10">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={signOut}
        onFeedback={() => setFeedbackOpen(true)}
        onWeights={() => setWeightsOpen(true)}
        onExportPdf={doExportPdf}
        onNew={openNew}
        canExport={state.ideas.length > 0}
      />

      {activeTab === 'matrix' && (
        <>
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
          <FounderNote onFeedback={() => setFeedbackOpen(true)} />
        </>
      )}

      {activeTab === 'library' &&
        (workspaceIdea ? (
          <IdeaWorkspace idea={workspaceIdea} onBack={() => setWorkspaceIdea(null)} />
        ) : (
          <LibraryView
            user={user}
            weights={state.weights}
            refreshKey={libraryRefreshKey}
            onNeedAuth={() => setAuthOpen(true)}
            onScoreNow={openScoreFromLibrary}
            onEditScores={openEditFromLibrary}
            onOpenWorkspace={setWorkspaceIdea}
          />
        ))}

      {/* footer */}
      <footer className="mt-12 pt-6 border-t border-line flex items-center justify-center">
        <VersionBadge />
      </footer>

      {/* modals & drawers */}
      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
      )}
      {modalOpen && (
        <IdeaModal
          initial={modalIdea}
          weights={state.weights}
          onSave={saveIdea}
          onCancel={() => { setModalOpen(false); setLibraryScoringId(null); }}
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
          onSent={() => showToast('Thanks — your feedback was sent.')}
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
