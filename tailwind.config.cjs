/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/ui/**/*.html',
    './src/ui/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b1220',
        surface: '#0f1724',
        primary: {
          DEFAULT: '#2563eb',
          600: '#1e40af'
        },
        accent: '#06b6d4',
        success: '#16a34a',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        muted: '#94a3b8'
      },
      boxShadow: {
        'card-dark': '0 6px 18px rgba(2,6,23,0.6)'
      },
      borderRadius: {
        xl: '12px'
      }
    },
  },
  plugins: [],
}
