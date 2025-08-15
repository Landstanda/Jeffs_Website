"use client"
import { useEffect, useMemo, useRef } from 'react'

type Point = {
  x: number
  y: number
  homeU: number
  homeV: number
  vx: number
  vy: number
  twinklePhase: number
  size: number
}

export default function CursorField({ count = 120, compact = false }: { count?: number, compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const points = useMemo<Point[]>(() => {
    const arr: Point[] = []
    for (let i = 0; i < count; i++) {
      // uniform X; Y distribution less top-biased in compact mode to avoid cramped feel
      const u = Math.random()
      const v = (compact ? Math.pow(Math.random(), 1.4) * 1.0 : Math.pow(Math.random(), 2) * 0.8)
      const size = compact ? 0.8 + Math.random() * 1.0 : 1.2 + Math.random() * 1.7
      const phase = Math.random() * Math.PI * 2
      arr.push({ x: 0, y: 0, homeU: u, homeV: v, vx: 0, vy: 0, twinklePhase: phase, size })
    }
    return arr
  }, [count, compact])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const dpr = Math.min((typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1), compact ? 1.25 : 1.75)

    let animation = 0
    let mouseX = -9999, mouseY = -9999

    const onResize = () => {
      c.width = c.clientWidth * dpr
      c.height = c.clientHeight * dpr
    }
    onResize()
    window.addEventListener('resize', onResize)

    const onPointerMove = (e: PointerEvent) => {
      const rect = c.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) * dpr
      mouseY = (e.clientY - rect.top) * dpr
    }
    const onPointerEnd = () => { mouseX = -9999; mouseY = -9999 }
    
    // Use pointer events for both mouse and touch; passive to not block scrolling
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerEnd, { passive: true })
    window.addEventListener('pointercancel', onPointerEnd, { passive: true })
    window.addEventListener('mouseleave', onPointerEnd, { passive: true })

    const render = () => {
      const pad = (compact ? 56 : 40) * dpr
      const innerWidth = Math.max(0, c.width - pad * 2)
      const innerHeight = Math.max(0, c.height - pad * 2)
      const influence = (compact ? 120 : 140) * dpr  // Pointer repulsion radius
      const snap = 0.12                                 // Spring-back speed to home
      const friction = 0.80                              // Movement damping
      const t = performance.now() * 0.001

      ctx.clearRect(0, 0, c.width, c.height)
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(255, 255, 232, 0.85)'
      ctx.shadowBlur = 6 * dpr

      for (let p = 0; p < points.length; p++) {
        const pt = points[p]
        const hx = pad + pt.homeU * innerWidth
        const hy = pad + pt.homeV * innerHeight

        // spring towards home
        pt.vx += (hx - pt.x) * snap
        pt.vy += (hy - pt.y) * snap

        // gentle drift to feel alive (smaller in compact mode)
        const drift = compact ? 0.015 : 0.02
        pt.vx += Math.sin(t * 0.5 + pt.twinklePhase) * drift * dpr
        pt.vy += Math.cos(t * 0.4 + pt.twinklePhase) * drift * dpr

        // repel from cursor
        const mx = pt.x - mouseX
        const my = pt.y - mouseY
        const dist = Math.hypot(mx, my)
        if (dist < influence) {
          const force = (1 - dist / influence) * 6
          pt.vx += (mx / (dist + 0.0001)) * force
          pt.vy += (my / (dist + 0.0001)) * force
        }

        // integrate
        pt.vx *= friction
        pt.vy *= friction
        pt.x += pt.vx
        pt.y += pt.vy

        // twinkle
        const twinkle = 0.6 + 0.4 * Math.sin(t * 2.2 + pt.twinklePhase)
        ctx.globalAlpha = twinkle
        ctx.beginPath()
        const radius = (compact ? pt.size * 1.6 : pt.size * 2.0) * dpr
        ctx.arc(pt.x || hx, pt.y || hy, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      animation = requestAnimationFrame(render)
    }

    // init positions
    const init = () => {
      const pad = (compact ? 56 : 40) * dpr
      const innerWidth = Math.max(0, c.width - pad * 2)
      const innerHeight = Math.max(0, c.height - pad * 2)
      for (const pt of points) {
        pt.x = pad + pt.homeU * innerWidth
        pt.y = pad + pt.homeV * innerHeight
      }
    }
    init()
    animation = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animation)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerEnd)
      window.removeEventListener('pointercancel', onPointerEnd)
      window.removeEventListener('mouseleave', onPointerEnd)
    }
  }, [points, compact])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      aria-hidden 
    />
  )
}


