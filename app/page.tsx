import Hero from '@/components/Hero'
import Constellation from '@/components/Constellation'
import AutoCarousel from '@/components/AutoCarousel'
import Ticker from '@/components/Ticker'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* Constellation Section - move closer to hero */}
      <section className="relative pt-6 md:pt-10 pb-12 md:pb-16 -mt-10 md:-mt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <Constellation />
          </div>
        </div>
      </section>

      {/* Info Ticker Band (full-width, auto-scrolling) */}
      <section className="relative py-6">
        <Ticker
          text={
            'Born at the cusp of Gen X & Millennials, riding the most extraordinary wave of technological innovation humanity remembers. Anticipating a fantastic future where the intelligent take over the world and create abundance for all..!'
          }
          pixelsPerSecond={90}
          height={110}
        />
      </section>

      {/* Past Projects Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/80 italic mb-6">"The world is alive with low-hanging fruit for those willing to reach. I can’t stop reaching."</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Past Projects</h2>
            <AutoCarousel
              slides={[
                { title: 'Mirror Aphrodite' },
                { title: 'Sustainable Artisan' },
                { title: 'C&C Automation' },
                { title: 'Computer Science' },
                { title: 'Hydroponics' },
                { title: 'Day Trading' },
                { title: 'Spanish Life' },
                { title: 'Canada' },
              ]}
              intervalMs={5000}
            />
          </div>
        </div>
      </section>

      {/* Family Section */}
      <section id="family" className="relative py-20">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-[url('/Jeff-1.jpg')] bg-cover bg-center opacity-30" />
        </div>
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="rounded-2xl bg-black/50 backdrop-blur-sm ring-1 ring-white/10 p-8 md:p-12">
              <p className="text-lg md:text-2xl text-white/90">
                The greatest invention of my life is the life I share with my wife and our child. They are both my grounding wire, my inspiration, and my favorite ongoing project!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Section (Current Projects) */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 text-center">In the Workshop</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Item 1 */}
            <div className="grid grid-cols-[160px_1fr] gap-4 p-4 rounded-xl bg-white/5 ring-1 ring-white/10">
              <div className="flex items-center justify-center rounded-lg bg-sky-500/10 text-sky-300 font-semibold">AR</div>
              <div>
                <h3 className="text-white font-medium">Augmented Reality Permaculture Landscaping App</h3>
                <p className="text-white/70">Exploring spatial computing to plan and simulate regenerative design on-site.</p>
              </div>
            </div>
            {/* Item 2 */}
            <div className="grid grid-cols-[160px_1fr] gap-4 p-4 rounded-xl bg-white/5 ring-1 ring-white/10">
              <div className="flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold">AI</div>
              <div>
                <h3 className="text-white font-medium">On-Device AI Apps</h3>
                <p className="text-white/70">Private, responsive, and playful intelligent tools that run at the edge.</p>
              </div>
            </div>
            {/* Item 3 */}
            <div className="grid grid-cols-[160px_1fr] gap-4 p-4 rounded-xl bg-white/5 ring-1 ring-white/10">
              <div className="flex items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300 font-semibold">MECH</div>
              <div>
                <h3 className="text-white font-medium">Automated Wheelbarrow</h3>
                <p className="text-white/70">A practical robotics project blending autonomy with real-world utility.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future / Philosophy Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Where We’re Going</h2>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              We stand at a turning point as profound as the Industrial Revolution. Automation and AI will transform our economy, not from the top down like so many expect, but from real grass-root teams. I work toward a world where the intelligence lead, the creative produce, and regenerative design empower everyone to live their best lives.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}


