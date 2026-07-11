import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terra: {
          DEFAULT: '#8B3A2A',
          dark: '#6E2D1F',
        },
        gold: {
          DEFAULT: '#C8A84B',
          light: '#E8D090',
        },
        ivory: '#F9F5EE',
        cream: '#FAF7F2',
        charcoal: '#1A1A1A',
        'gray-brand': '#6B6B6B',
        'gray-lt': '#E8E2D9',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        brand: '12px',
      },
    },
  },
  plugins: [],
}

export default config
