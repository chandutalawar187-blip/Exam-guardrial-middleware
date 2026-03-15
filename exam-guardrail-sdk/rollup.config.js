import terser from '@rollup/plugin-terser';

const shared = {
  plugins: [terser()],
  external: ['react', 'react-dom'],
};

export default [
  // Main entry (vanilla JS — no React dependency)
  {
    input: 'src/index.js',
    output: [
      { file: 'dist/index.js', format: 'cjs', exports: 'named' },
      { file: 'dist/index.mjs', format: 'es' },
    ],
    ...shared,
  },

  // React hook
  {
    input: 'src/react.js',
    output: [
      { file: 'dist/react.js', format: 'cjs', exports: 'named' },
      { file: 'dist/react.mjs', format: 'es' },
    ],
    ...shared,
  },

  // ProctoringOverlay component
  {
    input: 'src/overlay.js',
    output: [
      { file: 'dist/overlay.js', format: 'cjs', exports: 'named' },
      { file: 'dist/overlay.mjs', format: 'es' },
    ],
    ...shared,
  },
];
