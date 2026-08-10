'use client';

import { createBrowserClient } from '@supabase/ssr';

import { isSupabaseConfigured, requireSupabaseConfig } from './config';

let browserClient;

const createClient = () => {
  if (!browserClient) {
    const { publishableKey, url } = requireSupabaseConfig();
    browserClient = createBrowserClient(url, publishableKey);
  }

  return browserClient;
};

export { createClient, isSupabaseConfigured };

