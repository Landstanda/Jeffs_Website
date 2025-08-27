import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,md,mdx}',
    './components/**/*.{js,ts,jsx,tsx,md,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dawn: '#0f172a',
        sunrise: '#1e293b',
        day: '#0ea5e9'
      }
    },
  },
  plugins: [typography],
} satisfies Config


