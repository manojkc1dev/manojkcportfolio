import { redirect } from 'next/navigation';
import { getUser, type AuthContext } from './getUser';

export async function requireAdmin(redirectToPath: string = '/admin'): Promise<AuthContext> {
  const auth = await getUser();

  if (!auth.user) {
    redirect(`/login?redirectTo=${encodeURIComponent(redirectToPath)}`);
  }

  if (!auth.isAdmin) {
    redirect('/account?error=admin_required');
  }

  return auth;
}

export async function requireAuth(redirectToPath: string = '/account'): Promise<AuthContext> {
  const auth = await getUser();

  if (!auth.user) {
    redirect(`/login?redirectTo=${encodeURIComponent(redirectToPath)}`);
  }

  return auth;
}
