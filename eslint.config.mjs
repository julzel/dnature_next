import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // The legacy Pages Router code intentionally derives local UI state in
      // effects and mutates model instances before committing cloned state.
      // Keep these React Compiler-oriented rules out until those flows are
      // refactored independently of the framework upgrade.
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);
