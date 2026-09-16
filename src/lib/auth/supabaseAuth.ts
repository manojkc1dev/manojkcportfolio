/**
 * src/lib/auth/supabaseAuth.ts
 *
 * Auth helper functions wrapping the singleton supabase client.
 */

import { supabase } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  full_name: string | null;
}

/** Return the active session (or null if not logged in). */
export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return data.session;
}

/** Return the current Supabase Auth user (server-validated). */
export async function getUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

/** Sign in with email + password. Returns data or throws on error. */
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  return data;
}

/** Sign out the current user and clear the local session. */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

/** Update the logged-in user's password. */
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    throw error;
  }
  return data;
}

/** Fetch user profile from the `profiles` table, returns null on error or missing. */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, full_name')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      role: data.role === 'admin' ? 'admin' : 'viewer',
      full_name: data.full_name ?? null,
    };
  } catch {
    return null;
  }
}
