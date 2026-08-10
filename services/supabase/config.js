const SUPABASE_ENV_KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
];

const getSupabaseConfig = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '',
  publishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || '',
});

const isSupabaseConfigured = () => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.publishableKey);
};

const requireSupabaseConfig = () => {
  const config = getSupabaseConfig();
  const missingKeys = [
    ...(!config.url ? ['NEXT_PUBLIC_SUPABASE_URL'] : []),
    ...(!config.publishableKey
      ? ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY']
      : []),
  ];

  if (missingKeys.length) {
    throw new Error(
      `Falta configurar Supabase: ${missingKeys.join(', ')}. Revisá .env.example.`
    );
  }

  return config;
};

export {
  SUPABASE_ENV_KEYS,
  getSupabaseConfig,
  isSupabaseConfigured,
  requireSupabaseConfig,
};
