"use client"
import { useEffect, useState } from 'react'

type Slide = {
  title: string
  subtitle?: string
}

export default function AutoCarousel({ slides, intervalMs = 5000 }: { slides: Slide[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs)
    return () => clearInterval(id)
  }, [slides.length, intervalMs])

  if (slides.length === 0) return null

  const current = slides[index]

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
      <div className="p-8 min-h-[180px] flex items-center justify-center">
        <div className="text-center">
          <h4 className="text-2xl md:text-3xl font-semibold text-white">{current.title}</h4>
          {current.subtitle ? (
            <p className="text-white/70 mt-2">{current.subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-sky-400' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  )
}


