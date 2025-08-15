"use client"
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import CursorField from './CursorField'

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [phase, setPhase] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const r = entries[0]
        // Use intersection ratio to drive color phase 0..1
        setPhase(1 - r.intersectionRatio)
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section className="relative min-h-[160vh] overflow-hidden">{/* TUNABLE: reduces scroll length so constellation appears sooner */}
      <div ref={wrapperRef} className="sticky top-0 h-screen">
        {/* Black background that fades out; masked at the bottom to avoid a hard seam */}
        <div
          className="absolute inset-0 bg-black z-0"
          style={{
            opacity: Math.max(0, 1 - phase),
            WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          }}
        />
        
        {/* CursorField only on initial screen */}
        <div className="fixed inset-0 h-screen overflow-hidden z-10" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' }}>
          <CursorField count={isMobile ? 24 : 120} compact={isMobile} />
        </div>
        
        <div className="relative z-20 h-full">
          {/* Mobile layout: stacked */}
          <div className="flex flex-col md:hidden p-6">
            {/* Portrait */}
            <div className="relative w-64 h-96 mb-4">
              <Image 
                src="/jeff.png" 
                alt="Portrait" 
                fill 
                className="object-contain object-left grayscale transition-opacity duration-200" 
                style={{ opacity: Math.max(0.3, 1 - phase * 1.5) }}
                priority 
              />
            </div>
            
            {/* Lead line and subtitle */}
            <div className="relative text-center">
              <h1 
                className="relative z-20 text-4xl font-semibold tracking-tight mb-2"
                style={{
                  background: 'linear-gradient(to right, #4c1d95, #1e3a8a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Reimagining civilization
              </h1>
              <p className="relative z-20 text-base text-sky-200/90">
                One reality-shifting project at a time.
              </p>
            </div>
          </div>

          {/* Desktop layout: side by side */}
          <div className="hidden md:grid md:grid-cols-2 h-full">
            <div className="flex items-start justify-start p-12">
              <div className="relative w-80 h-[800px]">
                <Image 
                  src="/jeff.png" 
                  alt="Portrait" 
                  fill 
                  className="object-contain object-left grayscale transition-opacity duration-200" 
                  style={{ opacity: Math.max(0.3, 1 - phase * 1.5) }}
                  priority 
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
              <h1 
                className="text-6xl font-semibold tracking-tight"
                style={{
                  background: 'linear-gradient(to right, #4c1d95, #1e3a8a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Reimagining civilization
              </h1>
              <p className="text-sky-200/90 text-xl">
                One reality-shifting project at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


