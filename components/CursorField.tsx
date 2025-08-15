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

export default function CursorField({ count = 120 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const points = useMemo<Point[]>(() => {
    const arr: Point[] = []
    for (let i = 0; i < count; i++) {
      // uniform X, top-biased Y (square the random), clamp to top ~60%
      const u = Math.random()
      const v = Math.pow(Math.random(), 2) * 0.8
      const size = 1.2 + Math.random() * 1.8
      const phase = Math.random() * Math.PI * 2
      arr.push({ x: 0, y: 0, homeU: u, homeV: v, vx: 0, vy: 0, twinklePhase: phase, size })
    }
    return arr
  }, [count])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!

    let animation = 0
    let mouseX = -9999, mouseY = -9999

    const onResize = () => {
      c.width = c.clientWidth * devicePixelRatio
      c.height = c.clientHeight * devicePixelRatio
    }
    onResize()
    window.addEventListener('resize', onResize)

    const onMove = (e: MouseEvent) => {
      const rect = c.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) * devicePixelRatio
      mouseY = (e.clientY - rect.top) * devicePixelRatio
    }
    const onLeave = () => { mouseX = -9999; mouseY = -9999 }
    
    // Use window events instead of canvas events for better coverage
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    const render = () => {
      const pad = 40 * devicePixelRatio
      const innerWidth = Math.max(0, c.width - pad * 2)
      const innerHeight = Math.max(0, c.height - pad * 2)
      const influence = 80 * devicePixelRatio
      const snap = 0.08
      const friction = 0.88
      const t = performance.now() * 0.001

      ctx.clearRect(0, 0, c.width, c.height)
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(255,255,255,0.85)'
      ctx.shadowBlur = 6 * devicePixelRatio

      for (let p = 0; p < points.length; p++) {
        const pt = points[p]
        const hx = pad + pt.homeU * innerWidth
        const hy = pad + pt.homeV * innerHeight

        // spring towards home
        pt.vx += (hx - pt.x) * snap
        pt.vy += (hy - pt.y) * snap

        // gentle drift to feel alive
        pt.vx += Math.sin(t * 0.5 + pt.twinklePhase) * 0.02 * devicePixelRatio
        pt.vy += Math.cos(t * 0.4 + pt.twinklePhase) * 0.02 * devicePixelRatio

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
        ctx.arc(pt.x || hx, pt.y || hy, pt.size * 2.0 * devicePixelRatio, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      animation = requestAnimationFrame(render)
    }

    // init positions
    const init = () => {
      const pad = 40 * devicePixelRatio
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
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [points])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      aria-hidden 
    />
  )
}


