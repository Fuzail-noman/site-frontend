/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: { 950: '#05060d', 900: '#0a0c18', 800: '#10132a', 700: '#1a1e3d' },
        neon: { lime: '#b8ff3d', cyan: '#22e5ff', pink: '#ff3da5', amber: '#ffb020' },
      },
      keyframes: {
        scan: { '0%': { top: '0%' }, '100%': { top: '100%' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        blink: { '50%': { opacity: 0 } },
        rise: { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: {
        scan: 'scan 1.8s linear infinite',
        floaty: 'floaty 4s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        rise: 'rise .5s ease-out both',
      },
    },
  },
  plugins: [],
};
