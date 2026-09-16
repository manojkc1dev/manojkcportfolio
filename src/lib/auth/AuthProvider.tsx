/**
 * src/lib/auth/AuthProvider.tsx
 *
 * Provides the authentication context across the application.
 */

import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import {
  getProfile,
  signOut as authSignOut,
  type Profile,
} from './supabaseAuth';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: 'admin' | 'viewer' | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<'admin' | 'viewer' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (currentUser: User) => {
    const p = await getProfile(currentUser.id);
    if (p) {
      setProfile(p);
      setRole(p.role);
    } else {
      const fallbackRole: 'admin' | 'viewer' =
        currentUser.email?.toLowerCase() === 'manojkc1dev@gmail.com'
          ? 'admin'
          : 'viewer';
      const fallbackProfile: Profile = {
        id: currentUser.id,
        email: currentUser.email ?? '',
        role: fallbackRole,
        full_name: null,
      };
      setProfile(fallbackProfile);
      setRole(fallbackRole);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    let mounted = true;

    // 1. Initial session load
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return;
      setSession(initialSession);
      const currentUser = initialSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchUserProfile(currentUser).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // 2. Auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        setLoading(true);
        await fetchUserProfile(currentUser);
        if (mounted) setLoading(false);
      } else {
        setProfile(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authSignOut();
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
