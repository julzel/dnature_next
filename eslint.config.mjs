import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      'react-hooks/immutability': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  globalIgnores([
    '.next/**',
    '.next-e2e/**',
    '.next-baseline/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'out/**',
    'build/**',
    'supabase/.temp/**',
    'supabase/.branches/**',
    'next-env.d.ts',
  ]),
]);
