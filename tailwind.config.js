/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Source Serif 4 Variable"', '"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: 'var(--bg)',
        soft: 'var(--bg-soft)',
        ink: 'var(--text)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
        line: 'var(--border)',
        signal: 'var(--accent)',
      },
    },
  },
  plugins: [],
}