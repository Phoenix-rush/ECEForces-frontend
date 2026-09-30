/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        obsidian: {
          base:     '#06080A',
          surface:  '#0C1015',
          elevated: '#141920',
          border:   'rgba(255,255,255,0.06)',
          'border-hover': 'rgba(255,255,255,0.12)',
        },
        accent: {
          green:  '#00E887',
          blue:   '#5B7FFF',
          amber:  '#FFB224',
          red:    '#FF5C5C',
        },
        txt: {
          primary:   '#EAEDF0',
          secondary: '#8891A0',
          muted:     '#505866',
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'mesh-1': 'mesh-move-1 22s ease-in-out infinite',
        'mesh-2': 'mesh-move-2 28s ease-in-out infinite',
        'mesh-3': 'mesh-move-3 32s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}