/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        board: {
          bg:      '#0a0e1a',
          surface: '#111827',
          border:  '#1f2d45',
          accent:  '#1e3a5f',
        },
        // LCARS accent colours (Star Trek computer aesthetic)
        lcars: {
          gold: '#f5a623',
          blue: '#5b9bd5',
          red:  '#c0392b',
          teal: '#1abc9c',
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
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
