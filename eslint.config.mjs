import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Flat config (ESLint 9+). Replaces .eslintrc.json — Next.js 16 removed
// `next lint`, so `npm run lint` runs ESLint directly.
export default defineConfig([
    ...nextVitals,
    {
        // Same file scope as the Next block that registers these plugins —
        // flat config only applies a plugin's rules where the plugin is loaded.
        files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
        rules: {
            'react/no-unescaped-entities': 'off',
            '@next/next/no-img-element': 'off',
            // React Compiler rules that arrived with eslint-config-next 16. They
            // flag existing template components (sliders, menus, tabs) and the
            // demo pages; reported as warnings until that code is cleaned up.
            'react-hooks/error-boundaries': 'warn',
            'react-hooks/static-components': 'warn',
            'react-hooks/set-state-in-effect': 'warn',
            'react-hooks/refs': 'warn',
        },
    },
    globalIgnores([
        '.next/**',
        'node_modules/**',
        'documentation/**',
        'public/**',
        'migrations/**',
        'payload-types.ts',
        'app/(payload)/newsroom/importMap.js',
        'next-env.d.ts',
    ]),
])
