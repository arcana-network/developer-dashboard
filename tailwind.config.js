/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      colors: {
        pink: '#ff4e9f',
        liquid: '#dfecee',
        liquidlight: '#f7f7f7',
        liquidgrey: '#D9D9D9',
        liquiddark: '#8d8d8d',
        liquidaqua: '#5B93FF',
        overlay: {
          background: '#1e1f1e',
          input: '#313030',
          textplaceholder: '#989898',
        },
      },
      backdropBlur: {
        'xar-sm': '20px',
      },
      fontSize: {
        otp: '2rem',
      },
      zIndex: {
        surface: 0,
        overlay: 99999,
        overlayTop: 100000,
      },
    },
  },
}

export default config
