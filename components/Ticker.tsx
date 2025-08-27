"use client"
import { useEffect, useRef, useState } from "react"

type TickerProps = {
  text: string
  pixelsPerSecond?: number // TUNABLE: scroll speed (px/s). ~90–120 reads well.
  height?: number // Band height in px
}

export default function Ticker({ text, pixelsPerSecond = 110, height = 72 }: TickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLSpanElement | null>(null)
  const [durationSec, setDurationSec] = useState<number>(20)
  const [running, setRunning] = useState<boolean>(false)

  // Measure content/container to set duration based on reading speed
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current
      const content = contentRef.current
      if (!container || !content) return
      const containerWidth = container.offsetWidth
      const contentWidth = content.offsetWidth
      // We scroll one full content width; the duplicated text ensures seamless loop
      const distance = contentWidth
      const speed = Math.max(40, pixelsPerSecond) // clamp to avoid 0
      const d = distance / speed
      setDurationSec(Math.max(8, Math.min(120, d)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    if (contentRef.current) ro.observe(contentRef.current)
    return () => ro.disconnect()
  }, [pixelsPerSecond, text])

  // Start animation when ticker enters viewport; pause when off-screen
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        const r = entries[0]
        setRunning(r.isIntersecting)
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height }}
      aria-live="polite"
      aria-label="ticker"
    >
      {/* Band background */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] ring-1 ring-white/10" />

      {/* Edge fades to soften text entrance/exit */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        {/* Scrolling track */}
        <div
          className="absolute left-0 top-1/3 -translate-y-1/2 whitespace-nowrap will-change-transform"
          style={{
            animationName: "ticker-scroll",
            animationDuration: `${durationSec}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: running ? "running" : "paused",
          }}
        >
                     {/* Duplicate content to enable seamless loop */}
           <span ref={contentRef} className="text-white/90 text-2xl md:text-4xl font-serif font-medium tracking-wide px-8">
             {text}
           </span>
           <span aria-hidden className="text-white/90 text-2xl md:text-4xl font-serif font-medium tracking-wide px-8">
             {text}
           </span>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-45%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[aria-label="ticker"] div[style*="animation-name"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}


