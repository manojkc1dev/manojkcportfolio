import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'viewer' | string;
  created_at?: string;
}

export interface AuthContext {
  user: User | null;
  profile: UserProfile | null;
  role: string | null;
  isAdmin: boolean;
}

export async function getUser(): Promise<AuthContext> {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        user: null,
        profile: null,
        role: null,
        isAdmin: false,
      };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const isOwner =
      user.email?.toLowerCase() === 'manojkc1dev@gmail.com';

    const resolvedRole = isOwner
      ? 'admin'
      : profile?.role || 'viewer';

    return {
      user,
      profile:
        profile || {
          id: user.id,
          email: user.email || '',
          role: resolvedRole,
        },
      role: resolvedRole,
      isAdmin: resolvedRole === 'admin',
    };
  } catch {
    return {
      user: null,
      profile: null,
      role: null,
      isAdmin: false,
    };
  }
}
