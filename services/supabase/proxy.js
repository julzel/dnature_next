import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

import { isSupabaseConfigured, requireSupabaseConfig } from './config';

const refreshSupabaseSession = async (request) => {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return { claims: null, response };
  }

  const { publishableKey, url } = requireSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headersToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headersToSet).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  try {
    const {
      data: { claims },
    } = await supabase.auth.getClaims();

    return { claims: claims || null, response };
  } catch (error) {
    console.warn('Supabase session refresh is temporarily unavailable.', {
      name: error?.name,
    });
    return { claims: null, response };
  }
};

export { refreshSupabaseSession };
