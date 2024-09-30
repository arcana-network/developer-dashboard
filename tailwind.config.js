/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        nohemi: ['Nohemi', 'sans-serif'],
      },
      colors: {
        pink: '#ff4e9f',
        liquid: '#dfecee',
        liquidlight: {
          DEFAULT: '#f7f7f7',
          100: '#efefef',
        },
        liquidgrey: '#d9d9d9',
        liquiddark: {
          DEFAULT: '#8d8d8d',
          100: '#1d2a31',
        },
        liquidaqua: '#5b93ff',
        liquidred: '#FF5555',
        overlay: {
          background: '#1e1f1e',
          input: '#313030',
          textplaceholder: '#989898',
        },
        primary_light: 'var(--primary-light)',
        secondary: 'var(--secondary)',
        primary_liquid: 'var(--primary-liquid)',
        text_grey: 'var(--text-grey)',
        text_black: 'var(--text-black)',
        color_green: 'var(--color-green)',
        primary: 'var(--primary)',
        text_white: 'var(--text-white)',
      },
      backdropBlur: {
        'xar-sm': '20px',
      },
      fontSize: {
        rem2: '2rem',
      },
      zIndex: {
        surface: 0,
        overlay: 99999,
        overlayTop: 100000,
      },
      maxWidth: {
        sd: '360px',
        hd: '720px',
      },
      letterSpacing: {
        h1: '-2%',
      },
    },
  },
}

export default config
