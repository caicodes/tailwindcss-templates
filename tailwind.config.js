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
        colorScheme: colors.indigo,
        primary: colors.cyan,
        accent: colors.cyan,
        gray: colors.neutral,
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.colorScheme.800'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')} !important`,
              },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.colorScheme.900'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.colorScheme.900'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.colorScheme.900'),
            },
            'h4,h5,h6': {
              color: theme('colors.colorScheme.900'),
            },
            pre: {
              backgroundColor: theme('colors.colorScheme.600'),
              color: theme('colors.colorScheme.200'),
            },
            code: {
              color: theme('colors.pink.500'),
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
              backgroundColor: theme('colors.colorScheme.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            hr: { borderColor: theme('colors.colorScheme.200') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.colorScheme.500'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.colorScheme.500'),
            },
            strong: { color: theme('colors.colorScheme.600') },
            blockquote: {
              color: theme('colors.colorScheme.900'),
              borderLeftColor: theme('colors.colorScheme.200'),
            },
          },
        },

        dark: {
          css: {
            color: theme('colors.colorScheme.300'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')} !important`,
              },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.colorScheme.100'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.colorScheme.100'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.colorScheme.100'),
            },
            'h4,h5,h6': {
              color: theme('colors.colorScheme.100'),
            },
            pre: {
              backgroundColor: 'rgba(0,0,0,.25)',
              color: theme('colors.accent.400'),
            },

            details: {
              backgroundColor: theme('colors.colorScheme.800'),
            },
            hr: { borderColor: theme('colors.colorScheme.700') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.colorScheme.400'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.colorScheme.400'),
            },
            strong: { color: theme('colors.colorScheme.100') },
            thead: {
              th: {
                color: theme('colors.colorScheme.100'),
              },
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.colorScheme.700'),
              },
            },
            blockquote: {
              color: theme('colors.colorScheme.100'),
              borderLeftColor: theme('colors.colorScheme.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
