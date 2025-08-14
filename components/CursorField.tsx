"use client"
import { useEffect, useMemo, useRef } from 'react'

type Point = { x: number; y: number; homeX: number; homeY: number; vx: number; vy: number }

export default function CursorField({ count = 120 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const points = useMemo<Point[]>(() => {
    const arr: Point[] = []
    const cols = Math.ceil(Math.sqrt(count))
    const rows = Math.ceil(count / cols)
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const idx = j * cols + i
        if (idx >= count) break
        arr.push({ x: 0, y: 0, homeX: i, homeY: j, vx: 0, vy: 0 })
      }
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
      const cols = Math.ceil(Math.sqrt(points.length))
      const rows = Math.ceil(points.length / cols)
      const dx = (c.width - pad * 2) / Math.max(1, cols - 1)
      const dy = (c.height - pad * 2) / Math.max(1, rows - 1)
      const influence = 80 * devicePixelRatio
      const snap = 0.08
      const friction = 0.88

      ctx.clearRect(0, 0, c.width, c.height)
      ctx.fillStyle = 'rgba(255,255,255,0.8)'

      for (let p = 0; p < points.length; p++) {
        const pt = points[p]
        const hx = pad + pt.homeX * dx
        const hy = pad + pt.homeY * dy

        // spring towards home
        pt.vx += (hx - pt.x) * snap
        pt.vy += (hy - pt.y) * snap

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

        ctx.beginPath()
        ctx.arc(pt.x || hx, pt.y || hy, 2.2 * devicePixelRatio, 0, Math.PI * 2)
        ctx.fill()
      }

      animation = requestAnimationFrame(render)
    }

    // init positions
    const init = () => {
      const cols = Math.ceil(Math.sqrt(points.length))
      const rows = Math.ceil(points.length / cols)
      const pad = 40 * devicePixelRatio
      const dx = (c.width - pad * 2) / Math.max(1, cols - 1)
      const dy = (c.height - pad * 2) / Math.max(1, rows - 1)
      for (const pt of points) {
        pt.x = pad + pt.homeX * dx
        pt.y = pad + pt.homeY * dy
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


