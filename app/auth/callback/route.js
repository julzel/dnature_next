import { NextResponse } from 'next/server';

import { safeNextPath } from '../../../features/Account/server';
import { createClient, isSupabaseConfigured } from '../../../services/supabase/server';

const trustedOrigin = (request) => {
  if (process.env.NODE_ENV !== 'production') {
    return new URL(request.url).origin;
  }

  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
  } catch {
    return new URL(request.url).origin;
  }
};

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const origin = trustedOrigin(request);
  const nextPath = safeNextPath(requestUrl.searchParams.get('siguiente'));
  const code = requestUrl.searchParams.get('code');

  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(
      new URL('/cuenta/iniciar-sesion?error=oauth', origin),
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      new URL('/cuenta/iniciar-sesion?error=oauth', origin),
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  if (requestUrl.searchParams.get('edad') === 'confirmada') {
    const { error: ageError } = await supabase
      .from('customer_profiles')
      .update({ age_confirmed_at: new Date().toISOString() })
      .eq('user_id', data.user.id);

    if (ageError) {
      console.error('Unable to persist customer age confirmation', {
        code: ageError.code,
      });
    }
  }

  return NextResponse.redirect(new URL(nextPath, origin), {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
