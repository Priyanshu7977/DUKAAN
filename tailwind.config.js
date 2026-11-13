export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forme: {
          bg: '#FAF9F6',
          bgPure: '#FFFFFF',
          dark: '#141414',
          secondary: '#73706B',
          accent: '#A7654A',
          surface: '#F4F2EC',
          surfaceLight: '#FFFFFF',
          surfaceMuted: '#EAE7DF',
          sand: '#ECE7DD',
          border: 'rgba(20, 20, 20, 0.08)',
          borderSubtle: 'rgba(20, 20, 20, 0.05)',
          borderDark: 'rgba(255, 255, 255, 0.12)',
          olive: '#4A4E3D',
          terracotta: '#9A5630',
        }
      },
      fontFamily: {
        serif: ['"Bodoni Moda"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.2em',
        subtle: '0.06em',
        wider: '0.12em',
        widest: '0.22em',
      },
      aspectRatio: {
        'portrait': '3 / 4',
        'portrait-tall': '2 / 3',
        'editorial': '4 / 5',
        'editorial-wide': '16 / 9',
      }
    },
  },
  plugins: [],
}
