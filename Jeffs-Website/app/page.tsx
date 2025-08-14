import Link from 'next/link'
import Hero from '@/components/Hero'

const quotes = [
  'Plant systems that plant more systems — code like a forest.',
  'Edge computing: where privacy meets speed and small is beautiful.',
  'Compost complexity. Grow clarity.',
  'Robots pick trash so people can plant trees.',
  'Resilience is a feature, not a fix.',
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />

      <section className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <div key={i} className="p-6 rounded-lg bg-white/5 ring-1 ring-white/10 backdrop-blur">
              <p className="text-white/90">{q}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="px-4 py-2 rounded bg-sky-500/90 text-white" href="/blog">Read the blog</Link>
          <Link className="px-4 py-2 rounded bg-white/10 text-white/90" href="/projects">Projects</Link>
          <Link className="px-4 py-2 rounded bg-white/10 text-white/90" href="/media">Media</Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="text-2xl font-semibold mb-4">Currently</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-white/5 ring-1 ring-white/10">
            <h3 className="font-medium">Edgewise</h3>
            <p className="text-white/70">Building the apps of the future on the edge — private, light, brilliant, fast.</p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 ring-1 ring-white/10">
            <h3 className="font-medium">Permaculture automation</h3>
            <p className="text-white/70">Seed to forest, sensors to systems. Tooling the long game of stewardship.</p>
          </div>
        </div>
      </section>
    </main>
  )
}


