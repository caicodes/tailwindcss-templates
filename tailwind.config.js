const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: [
    './pages/**/*.js',
    './components/**/*.js',
    './layouts/**/*.js',
    './lib/**/*.js',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.pink,
        accent: colors.cyan,
        gray: colors.neutral,
        // code snippet view settings //
        customCodeBgColor: '#ffffff91',
        customCodeTextColor: '#312e81d4',
        customCodeBgColorDark: '#201e58',
        customCodeTextColorDark: '#ffffffb3',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.indigo.700'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')} !important`,
              },
              code: { color: theme('colors.primary.400') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.indigo.900'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.indigo.900'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.indigo.900'),
            },
            'h4,h5,h6': {
              color: theme('colors.indigo.900'),
            },
            pre: {
              backgroundColor: theme('colors.customCodeBgColor'),
              color: theme('colors.customCodeTextColor'),
            },
            code: {
              color: theme('colors.pink.500'),
              backgroundColor: 'transparent',
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            details: {
              backgroundColor: theme('colors.indigo.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            hr: { borderColor: theme('colors.indigo.200') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.indigo.500'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.indigo.500'),
            },
            strong: { color: theme('colors.indigo.600') },
            blockquote: {
              color: theme('colors.indigo.900'),
              borderLeftColor: theme('colors.indigo.200'),
            },
          },
        },

        dark: {
          primary: colors.emerald,

          css: {
            color: theme('colors.indigo.300'),
            a: {
              color: theme('colors.accent.500'),
              '&:hover': {
                color: `${theme('colors.accent.400')} !important`,
              },
              code: { color: theme('colors.accent.400') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.indigo.100'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.indigo.100'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.indigo.100'),
            },
            'h4,h5,h6': {
              color: theme('colors.indigo.100'),
            },
            pre: {
              backgroundColor: theme('colors.customCodeBgColorDark'),
              color: theme('colors.customCodeTextColorDark'),
            },
            code: {
              backgroundColor: theme('colors.customCodeBgColorDark'),
              color: theme('colors.customCodeTextColorDark'),
            },
            details: {
              backgroundColor: theme('colors.indigo.800'),
            },
            hr: { borderColor: theme('colors.indigo.700') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.indigo.400'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.indigo.400'),
            },
            strong: { color: theme('colors.indigo.100') },
            thead: {
              th: {
                color: theme('colors.indigo.100'),
              },
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.indigo.700'),
              },
            },
            blockquote: {
              color: theme('colors.indigo.100'),
              borderLeftColor: theme('colors.indigo.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
