import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { Idea, LibraryIdea, Weights } from './state/types';
import type { Score } from './state/types';
import { reducer } from './state/reducer';
import { loadState, saveState } from './state/storage';
import { compositeScore } from './state/scoring';
import { uuid } from './lib/uuid';
import {
  getLibraryIdeas,
  addScoredLibraryIdea,
  saveScoredLibraryIdea,
  deleteLibraryIdea,
} from './lib/libraryDb';
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

/** A scored Library idea, in the shape the Matrix/Dashboard expects. */
function libraryIdeaToIdea(li: LibraryIdea): Idea {
  return {
    id: li.id,
    name: li.name,
    description: li.description,
    scores: li.scores ?? blankIdeaScores(),
    createdAt: li.created_at,
    updatedAt: li.updated_at,
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

  // when signed in, the Library is the source of truth for the Matrix
  const [libIdeas, setLibIdeas] = useState<LibraryIdea[]>([]);

  const reloadLib = useCallback(async () => {
    if (!user) {
      setLibIdeas([]);
      return;
    }
    setLibIdeas(await getLibraryIdeas());
  }, [user]);

  // keep the Matrix copy fresh whenever the user, tab, or library changes
  useEffect(() => {
    reloadLib();
  }, [reloadLib, activeTab, libraryRefreshKey]);

  // The Matrix shows local ideas when signed out, and the user's scored
  // (non-archived) Library ideas when signed in.
  const matrixIdeas: Idea[] = user
    ? libIdeas
        .filter((i) => i.status === 'scored' && !i.archived)
        .map(libraryIdeaToIdea)
    : state.ideas;

  // On sign-in, migrate any local Matrix ideas into the Library, then clear
  // them locally so the Library is the single source of truth.
  const migratedRef = useRef(false);
  useEffect(() => {
    if (!user) {
      migratedRef.current = false;
      return;
    }
    if (migratedRef.current) return;
    migratedRef.current = true;
    (async () => {
      if (state.ideas.length > 0) {
        for (const idea of state.ideas) {
          const cs = compositeScore(idea, state.weights);
          await addScoredLibraryIdea(idea.name, idea.description, idea.scores, cs);
        }
        dispatch({ type: 'import', state: { ...state, ideas: [] } });
        showToast('Your ideas were saved to your Library.');
      }
      await reloadLib();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
    // when signed in, Matrix ideas ARE library ideas → route the save to the library
    setLibraryScoringId(user ? idea.id : null);
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
    if (user) {
      // signed in → the Library is the source of truth
      const cs = compositeScore(idea, state.weights);
      if (libraryScoringId) {
        await saveScoredLibraryIdea(libraryScoringId, {
          name: idea.name,
          description: idea.description,
          scores: idea.scores,
          composite_score: cs,
        });
      } else {
        await addScoredLibraryIdea(idea.name, idea.description, idea.scores, cs);
      }
      setLibraryScoringId(null);
      setLibraryRefreshKey((k) => k + 1);
      await reloadLib();
      showToast('Saved to your Library.');
    } else {
      // signed out → local matrix only
      if (state.ideas.some((i) => i.id === idea.id)) {
        dispatch({ type: 'update', idea });
      } else {
        dispatch({ type: 'add', idea });
      }
    }

    setModalOpen(false);
  };

  // delete from the Matrix: hits the Library when signed in, local otherwise
  const deleteFromMatrix = async (id: string) => {
    if (user) {
      await deleteLibraryIdea(id);
      setLibraryRefreshKey((k) => k + 1);
      await reloadLib();
    } else {
      dispatch({ type: 'delete', id });
    }
  };

  const saveWeights = (weights: Weights) => {
    dispatch({ type: 'setWeights', weights });
    setWeightsOpen(false);
    showToast('Weights saved — scores recomputed.');
  };

  const doExportPdf = async () => {
    if (matrixIdeas.length === 0) return;
    const { exportPdf } = await import('./lib/exportPdf');
    exportPdf({ ...state, ideas: matrixIdeas });
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
        canExport={matrixIdeas.length > 0}
      />

      {activeTab === 'matrix' && (
        <>
          <div className="mb-8">
            <Hero onNew={openNew} ideaCount={matrixIdeas.length} />
          </div>
          <Dashboard
            ideas={matrixIdeas}
            weights={state.weights}
            onNew={openNew}
            onEdit={openEdit}
            onDelete={deleteFromMatrix}
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
