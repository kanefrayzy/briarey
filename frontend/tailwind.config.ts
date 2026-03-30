import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease',
      },
      colors: {
        brand: {
          bg: '#242424',
          footer: '#202020',
          darker: '#1C1C1C',
          card: '#2E2E2E',
          blue: '#2B5CE6',
          gray: '#C4C4C4',
          darkgray: '#3F3F3F',
          golden: '#D4A843',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
