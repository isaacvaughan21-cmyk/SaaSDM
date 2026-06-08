import { supabase } from './supabase';
import type { LibraryIdea, Idea, WorkflowStatus, IdeaWorkspace } from '../state/types';

export async function getLibraryIdeas(): Promise<LibraryIdea[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('composite_score', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getLibraryIdeas', error);
    return [];
  }
  // default any legacy rows missing the newer columns
  return (data ?? []).map((row) => ({
    ...row,
    workflow_status: row.workflow_status ?? 'open',
    archived: row.archived ?? false,
    niche: row.niche ?? '',
  })) as LibraryIdea[];
}

export async function addLibraryIdea(
  name: string,
  description: string,
  niche = ''
): Promise<LibraryIdea | null> {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('ideas')
    .insert({
      user_id: user.id,
      name: name.trim(),
      description: description.trim(),
      niche: niche.trim(),
      status: 'unscored',
      workflow_status: 'open',
      archived: false,
    })
    .select()
    .single();
  if (error) {
    console.error('addLibraryIdea', error);
    return null;
  }
  return data as LibraryIdea;
}

/** Create a brand-new idea that is already scored (used by the Matrix when signed in). */
export async function addScoredLibraryIdea(
  name: string,
  description: string,
  scores: Idea['scores'],
  composite_score: number
): Promise<LibraryIdea | null> {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('ideas')
    .insert({
      user_id: user.id,
      name: name.trim(),
      description: description.trim(),
      niche: '',
      status: 'scored',
      workflow_status: 'open',
      archived: false,
      scores,
      composite_score,
    })
    .select()
    .single();
  if (error) {
    console.error('addScoredLibraryIdea', error);
    return null;
  }
  return data as LibraryIdea;
}

/** Update name, description, scores + composite on an idea and mark it scored. */
export async function saveScoredLibraryIdea(
  id: string,
  fields: { name: string; description: string; scores: Idea['scores']; composite_score: number }
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('ideas')
    .update({
      name: fields.name.trim(),
      description: fields.description.trim(),
      scores: fields.scores,
      composite_score: fields.composite_score,
      status: 'scored',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) {
    console.error('saveScoredLibraryIdea', error);
    return false;
  }
  return true;
}

export async function scoreLibraryIdea(
  id: string,
  scores: Idea['scores'],
  composite_score: number
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('ideas')
    .update({ status: 'scored', scores, composite_score, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('scoreLibraryIdea', error);
    return false;
  }
  return true;
}

export async function updateLibraryIdeaScores(
  id: string,
  scores: Idea['scores'],
  composite_score: number
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('ideas')
    .update({ scores, composite_score, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('updateLibraryIdeaScores', error);
    return false;
  }
  return true;
}

export async function updateLibraryIdea(
  id: string,
  fields: { name: string; description: string; niche: string }
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('ideas')
    .update({
      name: fields.name.trim(),
      description: fields.description.trim(),
      niche: fields.niche.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) {
    console.error('updateLibraryIdea', error);
    return false;
  }
  return true;
}

export async function setIdeaArchived(id: string, archived: boolean): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('ideas')
    .update({ archived, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('setIdeaArchived', error);
    return false;
  }
  return true;
}

export async function updateWorkflowStatus(
  id: string,
  workflow_status: WorkflowStatus
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('ideas')
    .update({ workflow_status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('updateWorkflowStatus', error);
    return false;
  }
  return true;
}

export async function updateWorkspace(
  id: string,
  workspace: IdeaWorkspace
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('ideas')
    .update({ workspace, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('updateWorkspace', error);
    return false;
  }
  return true;
}

export async function deleteLibraryIdea(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('ideas').delete().eq('id', id);
  if (error) {
    console.error('deleteLibraryIdea', error);
    return false;
  }
  return true;
}
