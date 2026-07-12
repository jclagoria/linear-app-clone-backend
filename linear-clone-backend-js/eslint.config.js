import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import boundaries from 'eslint-plugin-boundaries';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.ts'],
    plugins: {
      prettier: prettierPlugin,
      boundaries,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    settings: {
      'boundaries/elements': [
        // Domain layer - entities and value objects
        { type: 'domain', pattern: 'src/modules/*/domain' },
        // Application layer - use cases and ports
        { type: 'application', pattern: 'src/modules/*/application' },
        { type: 'application', pattern: 'src/modules/*/application/ports' },
        // Adapter layer - inbound (controllers, DTOs)
        { type: 'adapter-in', pattern: 'src/modules/*/adapters/in' },
        // Adapter layer - outbound (repositories, services)
        { type: 'adapter-out', pattern: 'src/modules/*/adapters/out' },
        // Shared utilities - can be imported by anyone
        { type: 'shared', pattern: 'src/shared' },
        // Entry points - app and server
        { type: 'entry', pattern: 'src/app.ts', mode: 'file' },
        { type: 'entry', pattern: 'src/server.ts', mode: 'file' },
      ],
    },
    rules: {
      'prettier/prettier': 'error',
      'no-undef': 'off',
      'no-unused-vars': 'off',

      // Boundary rules - enforce hexagonal architecture
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // Domain cannot import from anything except itself
            { from: 'domain', allow: ['domain'] },

            // Application can only import from domain and shared
            { from: 'application', allow: ['domain', 'application', 'shared'] },

            // Adapters-in can import from application, domain, and shared
            { from: 'adapter-in', allow: ['application', 'domain', 'shared'] },

            // Adapters-out can import from application, domain, and shared
            { from: 'adapter-out', allow: ['application', 'domain', 'shared'] },

            // Shared can import from anyone (utilities)
            { from: 'shared', allow: ['domain', 'application', 'shared'] },

            // Entry points can import from anywhere
            { from: 'entry', allow: ['domain', 'application', 'adapter-in', 'adapter-out', 'shared', 'entry'] },
          ],
        },
      ],

      // Warn on unknown types (catches misconfigured paths)
      'boundaries/no-unknown-dependencies': 'warn',
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
];
