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
    <section className="relative min-h-[140svh] overflow-hidden">
      <div ref={wrapperRef} className="sticky top-0 h-screen">
        <div className="absolute inset-0 bg-black" style={{ opacity: Math.max(0, 1 - phase) }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1220] to-[#0ea5e9] transition-opacity" style={{ opacity: phase }} />
        <CursorField />
        <div className="relative z-10 h-full grid md:grid-cols-2">
          <div className="flex items-center justify-center p-6 md:p-12">
            <div className="relative w-72 h-96 md:w-[28rem] md:h-[38rem] border border-white/10 shadow-2xl">
              <Image src="/Jeff.jpg" alt="Portrait" fill className="object-cover object-center grayscale" priority />
            </div>
          </div>
          <div className="flex flex-col items-start justify-center gap-4 p-6 md:p-12">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
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


