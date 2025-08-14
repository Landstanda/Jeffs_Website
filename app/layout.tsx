import './globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Edgewise — Jeff',
  description: 'Building playful, permaculture‑minded AI experiences at the edge — fast, private, brilliant.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased gradients min-h-screen selection:bg-sky-500/30 selection:text-white">
        <div className="noise" />
        <Navigation />
        {children}
      </body>
    </html>
  )
}


