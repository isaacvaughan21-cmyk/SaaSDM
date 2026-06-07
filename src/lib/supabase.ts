import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Null until the env vars are set — lets the app run before backend setup. */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const supabaseReady = supabase !== null;

export type Result = 'ok' | 'exists' | 'error' | 'unconfigured';

export async function addSubscriber(email: string): Promise<Result> {
  if (!supabase) return 'unconfigured';
  const { error } = await supabase.from('subscribers').insert({ email: email.trim() });
  if (!error) return 'ok';
  // 23505 = unique_violation → already subscribed, treat as success
  if (error.code === '23505') return 'exists';
  console.error('addSubscriber failed', error);
  return 'error';
}

export type FeedbackType = 'feature' | 'bug';

export async function addFeedback(type: FeedbackType, message: string): Promise<Result> {
  if (!supabase) return 'unconfigured';
  const { error } = await supabase.from('feedback').insert({ type, message: message.trim() });
  if (!error) return 'ok';
  console.error('addFeedback failed', error);
  return 'error';
}
