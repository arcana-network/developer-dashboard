/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      colors: {
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
