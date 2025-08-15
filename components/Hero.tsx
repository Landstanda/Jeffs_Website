"use client"
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import CursorField from './CursorField'

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [phase, setPhase] = useState(0)

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

  return (
    <section className="relative min-h-[200vh] overflow-hidden">
      <div ref={wrapperRef} className="sticky top-0 h-screen">
        {/* Black background that fades out; masked at the bottom to avoid a hard seam */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: Math.max(0, 1 - phase),
            WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          }}
        />
        
        {/* CursorField only on initial screen */}
        <div className="absolute inset-0 h-screen overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
          <CursorField />
        </div>
        
        <div className="relative z-10 h-full grid md:grid-cols-2">
          <div className="flex items-start justify-start p-6 md:p-12">
            <div className="relative w-72 h-[600px] md:w-80 md:h-[800px]">
              <Image 
                src="/Jeff.png" 
                alt="Portrait" 
                fill 
                className="object-contain object-left grayscale transition-opacity duration-200" 
                style={{ opacity: Math.max(0.3, 1 - phase * 1.5) }}
                priority 
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-center gap-4 p-6 md:p-12">
            <h1 
              className="text-3xl md:text-5xl font-semibold tracking-tight"
              style={{
                background: 'linear-gradient(to right, #4c1d95, #1e3a8a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Automating better futures
            </h1>
            <p className="text-sky-200/90 max-w-xl">
              Building apps at the edge — private, lightweight, brilliant, fast.
              Permaculture‑minded. AI‑optimistic.
            </p>
            <div className="text-sm text-white/70 max-w-lg leading-relaxed">
              <p>Edgewise is an exploration of resilient software that thrives on the edge. Less weight, more signal.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


