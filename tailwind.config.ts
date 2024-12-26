/* eslint-disable @typescript-eslint/no-require-imports */
import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        xs: '0px',
        '3xl': '1600px',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          main: {
            '50': 'hsl(var(--primary-main-50))',
            '100': 'hsl(var(--primary-main-100))',
            '200': 'hsl(var(--primary-main-200))',
            '300': 'hsl(var(--primary-main-300))',
            '400': 'hsl(var(--primary-main-400))',
            '500': 'hsl(var(--primary-main-500))',
            '600': 'hsl(var(--primary-main-600))',
            '700': 'hsl(var(--primary-main-700))',
            '800': 'hsl(var(--primary-main-800))',
            '900': 'hsl(var(--primary-main-900))',
            '950': 'hsl(var(--primary-main-950))',
          },
          dark: 'hsl(var(--primary-dark))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      backgroundImage: {
        'gradient-header': 'linear-gradient(to right, #6441a5,#2e0777,#2a0845)',
        'gradient-header-dark':
          'linear-gradient(to right, #333399,#141452,#131339)',
      },
      backgroundColor: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          main: {
            '50': 'hsl(var(--primary-main-50))',
            '100': 'hsl(var(--primary-main-100))',
            '200': 'hsl(var(--primary-main-200))',
            '300': 'hsl(var(--primary-main-300))',
            '400': 'hsl(var(--primary-main-400))',
            '500': 'hsl(var(--primary-main-500))',
            '600': 'hsl(var(--primary-main-600))',
            '700': 'hsl(var(--primary-main-700))',
            '800': 'hsl(var(--primary-main-800))',
            '900': 'hsl(var(--primary-main-900))',
            '950': 'hsl(var(--primary-main-950))',
          },
          dark: 'hsl(var(--primary-dark))',
        },
      },
      boxShadow: {
        sidebar:
          '0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        appbar: '1px 7px 15px -7px rgba(150,170,180,0.5)',
        footerbar: '0px -7px 15px -7px rgba(150,170,180,0.5)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100vh)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(0)' },
        },
        twinkle: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
        starAnimation: {
          '0%': { transform: 'rotate(315deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'rotate(315deg) translateX(-1000px)',
            opacity: '0',
          },
        },
        pulseRed: {
          '0%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(255,82,82,0.7)',
          },
          '70%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 10px rgba(255, 82, 82, 0)',
          },
          '100%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(255, 82, 82, 0)',
          },
        },
        ringingBell: {
          '0%': { transform: 'rotate(0)' },
          '1%': { transform: 'rotate(30deg)' },
          '3%': { transform: 'rotate(-28deg)' },
          '5%': { transform: 'rotate(34deg)' },
          '7%': { transform: 'rotate(-32deg)' },
          '9%': { transform: 'rotate(30deg)' },
          '11%': { transform: 'rotate(-28deg)' },
          '13%': { transform: 'rotate(26deg)' },
          '15%': { transform: 'rotate(-24deg)' },
          '17%': { transform: 'rotate(22deg)' },
          '19%': { transform: 'rotate(-20deg)' },
          '21%': { transform: 'rotate(18deg)' },
          '23%': { transform: 'rotate(-16deg)' },
          '25%': { transform: 'rotate(14deg)' },
          '27%': { transform: 'rotate(-12deg)' },
          '29%': { transform: 'rotate(10deg)' },
          '31%': { transform: 'rotate(-8deg)' },
          '33%': { transform: 'rotate(6deg)' },
          '35%': { transform: 'rotate(-4deg)' },
          '37%': { transform: 'rotate(2deg)' },
          '39%': { transform: 'rotate(-1deg)' },
          '41%': { transform: 'rotate(1deg)' },
          '43%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        slideUp: 'slideUp 0.5s ease-in-out',
        slideDown: 'slideDown 0.5s ease-in-out',
        twinkle: 'twinkle 1s infinite ease-in-out',
        starAnimation: 'starAnimation 3s linear infinite',
        pulseRed: 'pulseRed 2s infinite',
        ringingBell: 'ringingBell 4s .7s ease-in-out infinite',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        inter: ['var(--font-inter)'],
        poppins: ['var(--font-poppins)'],
      },
      transitionDuration: {
        '1250': '1250ms',
        '1500': '1500ms',
        '1750': '1750ms',
        '2000': '2000ms',
        '2250': '2250ms',
        '2500': '2500ms',
        '3000': '3000ms',
      },
      transitionDelay: {
        '400': '400ms',
        '1200': '1200ms',
        '1400': '1400ms',
        '2750': '2750ms',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addComponents, addUtilities }) => {
      addComponents({
        '.button': {
          borderRadius: '0.5rem',
          fontFamily: 'Montserrat',
          fontWeight: '600',
          fontSize: '14px',
          padding: '0 0.5rem',
          boxShadow: '1px 7px 15px -7px rgba(150,170,180,0.7)',
        },
        '.sidebar-button-focus': {
          backgroundColor: 'hsl(var(--primary-main-50))',
          boxShadow: 'none',
          '&:before': {
            top: '.25rem',
            bottom: '.25rem',
            left: '10px',
            right: 'auto',
            width: '3px',
            backgroundColor: 'hsl(var(--primary-main-600))',
            // borderLeft: '3px solid hsl(var(--primary-main-600))',
            borderBottom: '0',
            marginLeft: '5px',
            content: '""',
            height: '70%',
            /* position: 'absolute', */
          },
        },
        '.sidebar-button-focus-dark': {
          backgroundColor: '#020617',
          boxShadow: 'none',
          '&:before': {
            top: '.25rem',
            bottom: '.25rem',
            left: '10px',
            right: 'auto',
            width: '3px',
            backgroundColor: 'hsl(var(--primary-main-600))',
            // borderLeft: '3px solid hsl(var(--primary-main-600))',
            borderBottom: '0',
            marginLeft: '5px',
            content: '""',
            height: '70%',
            /* position: 'absolute', */
          },
        },
        '.span-star-header': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '4px',
          height: '4px',
          background: '#FFF',
          borderRadius: '100%',
          boxShadow:
            '0 0 0 4px rgba(255,255,255,0.1), 0 0 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,1)',
          animation: 'starAnimation 3s linear infinite',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '150px',
            transform: 'translate(-50%)',
            width: '300px',
            height: '1px',
            background: 'linear-gradient(90deg, #FFF, transparent)',
          },
        },
        '.table-body': {
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            height: '100%',
          },
        },
        '.tooltip-arrow': {
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: '38%',
            transform: 'rotate(45deg)',
            left: '0',
            marginLeft: '-5px',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor:
              'transparent transparent hsl(var(--primary-main-200)) hsl(var(--primary-main-200))',
          },
        },
        '.button-sm': {
          height: '1.8rem',
        },
        '.button-md': {
          height: '2.4rem',
        },
        '.button-lg': {
          height: '3rem',
        },
        '.table-sort-label': {
          backgroundColor: 'transparent',
          cursor: 'pointer',
          border: 'none',
          color: 'inherit',
          padding: '0',
          margin: '0',
          width: '100%',
          fontSize: '1rem',
          fontWeight: '400',
          fontFamily: 'Poppins',
          position: 'static',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: '10px',
        },
        '.scrollbar-styled': {
          '&::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: '7px',
            height: '7px',
          },

          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },

          '&::-webkit-scrollbar-track:hover': {
            backgroundColor: 'transparent',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#babac0',
            borderRadius: '8px',
          },

          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a0a0a5',
          },

          '&::-webkit-scrollbar-button': {
            display: 'none',
          },
        },
        '.table-container': {
          maxHeight: '550px',
          overflow: 'scroll',
          width: '100%',
          '&::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: '7px',
            height: '7px',
          },

          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },

          '&::-webkit-scrollbar-track:hover': {
            backgroundColor: 'transparent',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#babac0',
            borderRadius: '8px',
          },

          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a0a0a5',
          },

          '&::-webkit-scrollbar-button': {
            display: 'none',
          },
        },
        '.table-footer': {
          padding: '8px 0px',
          width: '100%',
          fontWeight: '500',
          fontSize: '16px',
          color: '#FFF',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'static',
          bottom: '0',
        },
        '.image-convenios': {
          display: 'flex',
          justifyContent: 'initial',
          alignItems: 'center',
          margin: '10px',
          maxHeight: '180px',
          maxWidth: '200px',
        },
      })
      addUtilities({
        '.no-scrollbar': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.sticky-header': {
          position: 'sticky',
          top: '0',
          zIndex: '99',
        },
      })
    }),
  ],
} satisfies Config

export default config
