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
        primary: {
          DEFAULT: '#F7F7F7',
          100: '#1D2A31',
        },
        secondary: {
          DEFAULT: '#8d8d8d',
          100: '#1D2A31',
        },
        baseColor: {
          DEFAULT: '#EFEFEF',
          50: '#F7F7F7',
          100: '#13171A',
        },
        rose: {
          DEFAULT: '#ff4e9f',
          50: '#FEF1F8',
          100: '##FEE5F2',
          200: '#FFCAE7',
          300: '#FF9FD2',
          400: '#FF63B1',
          500: '#FF4E9F',
          600: '#F0126D',
          700: '#D10553',
          800: '#AD0744',
          900: '#8F0C3C',
          950: '#58001F',
        },
        firefly: {
          DEFAULT: '#DFECEE',
          50: '#F2F8F9',
          100: '#DFECEE',
          200: '#C2DADF',
          300: '#98BFC8',
          400: '#679CA9',
          500: '#4C818E',
          600: '#416A79',
          700: '#3A5864',
          800: '#354B55',
          900: '#354B55',
          950: '#1D2A31',
        },
        blackhaze: {
          DEFAULT: '#F4F7F7',
          50: '#F4F7F7',
          100: '#E2E9EB',
          200: '#C8D5D9',
          300: '#A2B7BE',
          400: '#74919C',
          500: '#597581',
          600: '#4C626E',
          700: '#42525C',
          800: '#3C474E',
          900: '#353E44',
          950: '#13171A',
        },
        whitemist: {
          DEFAULT: '##F7F7F7',
          50: '##F7F7F7',
          100: '#EFEFEF',
          200: '#DCDCDC',
          300: '#BDBDBD',
          400: '#989898',
          500: '#7C7C7C',
          600: '#656565',
          700: '#525252',
          800: '#464646',
          900: '#3D3D3D',
          950: '#292929',
        },
        system: {
          yellow: '#f9e82d',
          green: '#51cc56',
          red: '#ff5555',
          blue: '#5b93ff',
          orange: '#ff9167',
          grey: '#d9d9d9',
        },
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
      maxHeight: {
        sd: '360px',
        ms: '430px',
        hd: '720px',
      },
      letterSpacing: {
        h1: '-2%',
      },
    },
  },
}

export default config
