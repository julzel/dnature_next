import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { isSupabaseConfigured, requireSupabaseConfig } from './config';

const createClient = async () => {
  const cookieStore = await cookies();
  const { publishableKey, url } = requireSupabaseConfig();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The root proxy refreshes
          // the session before rendering and persists any changed cookies.
        }
      },
    },
  });
};

export { createClient, isSupabaseConfigured };

