import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          bg: '#050B14',      /* Deep obsidian blue/black */
          surface: '#0B1221', /* Slightly lighter panel */
          border: '#1E293B',  /* Slate border */
          accent: '#10B981',  /* Emerald 500 */
          accentDim: '#059669', /* Emerald 600 */
          cyan: '#06B6D4',    /* Cyan 500 for secondary accents */
          text: '#F8FAFC',    /* Slate 50 */
          muted: '#94A3B8',   /* Slate 400 */
          danger: '#EF4444',  /* Red 500 */
          warning: '#F59E0B', /* Amber 500 */
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        'glass-hover': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'blob': 'blob 10s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
