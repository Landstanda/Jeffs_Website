import Link from 'next/link'
import Hero from '@/components/Hero'

const quotes = [
  'Plant systems that plant more systems — code like a forest.',
  'Edge computing: where privacy meets speed and small is beautiful.',
  'Compost complexity. Grow clarity.',
  'Robots pick trash so people can plant trees.',
  'Resilience is a feature, not a fix.',
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Content sections that flow from the green gradient */}
      <section className="relative bg-gradient-to-b from-[#22c55e] to-[#16a34a] pb-24">
        <div className="container mx-auto px-6 pt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Growing the Future
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              From black to blue to green — like a seed breaking through soil, 
              reaching for light. This is how we build: one layer at a time, 
              each more vibrant than the last.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-3">AI & Automation</h3>
                <p className="text-white/80">Building systems that plant more systems. Code like a forest.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-3">Permaculture</h3>
                <p className="text-white/80">Designing resilient ecosystems, both digital and natural.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-3">Edge Computing</h3>
                <p className="text-white/80">Lightweight, fast, private. The future runs on the edge.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 space-y-10 bg-[#16a34a]">
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

      <section className="mx-auto max-w-5xl px-6 pb-24 bg-[#16a34a]">
        <h2 className="text-2xl font-semibold mb-4 text-white">Currently</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-white/5 ring-1 ring-white/10">
            <h3 className="font-medium text-white">Edgewise</h3>
            <p className="text-white/70">Building the apps of the future on the edge — private, light, brilliant, fast.</p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 ring-1 ring-white/10">
            <h3 className="font-medium text-white">Permaculture automation</h3>
            <p className="text-white/70">Seed to forest, sensors to systems. Tooling the long game of stewardship.</p>
          </div>
        </div>
      </section>
    </main>
  )
}


