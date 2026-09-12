import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore signOut errors
  }

  return NextResponse.redirect(new URL('/login', 'https://manojkc1.com.np'), {
    status: 303,
  });
}
