/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ST:CCG dark theme palette
        board: {
          bg:      '#0a0e1a',
          surface: '#111827',
          border:  '#1f2d45',
          accent:  '#1e3a5f',
        },
        federation: '#3b82f6',
        klingon:    '#ef4444',
        card: {
          bg:   '#1a2235',
          text: '#e2e8f0',
          dim:  '#64748b',
        },
        phase: {
          active:   '#22c55e',
          inactive: '#374151',
        },
      },
      fontFamily: {
        game: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
