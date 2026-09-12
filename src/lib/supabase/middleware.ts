import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Protect /admin routes (Requires Admin role)
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    // Role check for admin
    const isOwner = user.email?.toLowerCase() === 'manojkc1dev@gmail.com';
    if (!isOwner) {
      // Check role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role !== 'admin') {
        // Viewer authenticated users are redirected to /account
        const url = request.nextUrl.clone();
        url.pathname = '/account';
        url.searchParams.set('error', 'admin_required');
        return NextResponse.redirect(url);
      }
    }
  }

  // 2. Protect /account routes (Requires any authenticated user)
  if (pathname.startsWith('/account')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 3. Redirect already authenticated users from /login
  if (pathname === '/login') {
    if (user) {
      const isOwner = user.email?.toLowerCase() === 'manojkc1dev@gmail.com';
      const url = request.nextUrl.clone();
      if (isOwner) {
        url.pathname = '/admin';
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        url.pathname = profile?.role === 'admin' ? '/admin' : '/account';
      }
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
