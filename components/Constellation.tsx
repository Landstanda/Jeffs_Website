"use client"
import { useEffect, useMemo, useRef, useState } from 'react'

type NodeDef = {
  id: string
  label: string
}

// ==================================================================================
// CONSTELLATION CONTENT: Add/remove/rename nodes here
// ==================================================================================
const nodes: NodeDef[] = [
  { id: 'family', label: 'Family' },
  { id: 'ai', label: 'AI' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'writings', label: 'Writings' },
  { id: 'ar', label: 'AR' },
  { id: 'invention', label: 'Invention' },
  { id: 'permaculture', label: 'Permaculture' },
  { id: 'learning', label: 'Learning' },
]

// ==================================================================================
// NODE COLORS: Customize the color of each orbital node's glow and border
// Use any hex color. These show on hover and as stroke colors.
// ==================================================================================
const nodeColor: Record<string, string> = {
  family: '#f59e0b',      // Amber
  ai: '#38bdf8',          // Sky blue
  robotics: '#818cf8',    // Indigo
  writings: '#e879f9',    // Fuchsia
  ar: '#22d3ee',          // Cyan
  invention: '#a78bfa',   // Violet
  permaculture: '#34d399', // Emerald
  learning: '#a3e635',    // Lime
}

// ==================================================================================
// DETERMINISTIC RANDOMIZATION: These functions ensure the constellation layout
// stays consistent across page reloads by using node IDs as seeds.
// Don't modify unless you want different random distribution patterns.
// ==================================================================================
function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return h >>> 0
}

function seededRandom(seed: number): () => number {
  let x = seed || 123456789
  return () => {
    // Xorshift32 algorithm for pseudo-random numbers
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return ((x >>> 0) % 10000) / 10000
  }
}

export default function Constellation() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState(700)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [targetParallax, setTargetParallax] = useState({ x: 0, y: 0 })
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [t, setT] = useState(0)

  // ==================================================================================
  // CONSTELLATION SIZE: Controls how big the constellation appears on screen
  // ==================================================================================
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new (window as any).ResizeObserver((entries: any) => {
      const w = entries[0].contentRect.width
      // TUNABLE: Constellation size relative to container width
      // Math.max(560, w) = full width with 560px minimum
      // Math.max(400, w * 0.8) = 80% of width with 400px minimum  
      // Math.min(w, 800) = full width but capped at 800px maximum
      setSize(Math.max(560, w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ==================================================================================
  // ANIMATION LOOP: Handles smooth parallax movement and node drift over time
  // ==================================================================================
  useEffect(() => {
    let raf = 0
    const loop = () => {
      setParallax((p) => ({
        // TUNABLE: Parallax smoothness (0.01 = very slow, 0.5 = very snappy)
        // 0.12 = smooth but responsive cursor following
        x: p.x + (targetParallax.x - p.x) * 0.12,
        y: p.y + (targetParallax.y - p.y) * 0.12,
      }))
      // TUNABLE: Animation speed for node drift (higher = faster orbital movement)
      // 0.016 ≈ 60 FPS animation speed
      setT((v) => v + 0.016)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [targetParallax.x, targetParallax.y])

  // ==================================================================================
  // MOUSE INTERACTION: Controls how much the constellation moves when cursor moves
  // ==================================================================================
  useEffect(() => {
    const handleMove = (ev: MouseEvent) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      
      // TUNABLE: Cursor interaction strength
      // 42 = very responsive movement that follows cursor closely
      // 20 = subtle movement that slightly follows cursor  
      // 60+ = dramatic movement that can make nodes go off-screen
      // 0 = no cursor interaction at all
      const PARALLAX_STRENGTH = 40
      const dx = ((ev.clientX - cx) / rect.width) * PARALLAX_STRENGTH
      const dy = ((ev.clientY - cy) / rect.height) * PARALLAX_STRENGTH
      setTargetParallax({ x: dx, y: dy })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // ==================================================================================
  // CONSTELLATION LAYOUT: Creates positions, sizes, and movement for all nodes
  // This runs whenever the constellation size changes (responsive)
  // ==================================================================================
  const positions = useMemo(() => {
    const rngs = nodes.map((n, i) => seededRandom(hashSeed(n.id) + i))
    
    // TUNABLE: Center node size (the "A Thriving World" circle)
    // Math.floor(size * 0.12) = 12% of constellation width
    // Change 0.12 to 0.15 for bigger center, 0.08 for smaller center
    const centerRadius = Math.max(78, Math.floor(size * 0.12))

    // TUNABLE: Orbital ring where satellite nodes live
    // size * 0.28 = inner edge at 28% from center
    // size * 0.44 = outer edge at 44% from center  
    // Increase both for nodes further from center: 0.35 and 0.55
    // Decrease both for nodes closer to center: 0.20 and 0.35
    const orbitMin = size * 0.20
    const orbitMax = size * 0.38

    // TUNABLE: Size range of satellite nodes (node "planets")
    // size * 0.045 = smallest node is 4.5% of constellation width
    // size * 0.07 = largest node is 7% of constellation width
    // For bigger nodes: change to 0.06 and 0.10
    // For smaller nodes: change to 0.03 and 0.05  
    const nodeRMin = Math.max(26, Math.floor(size * 0.04))
    const nodeRMax = Math.max(42, Math.floor(size * 0.08))

    type P = {
      id: string
      label: string
      x: number
      y: number
      r: number
      phase: number
      amp: number
      speed: number
    }

    // Generate initial positions and movement properties for each node
    const items: P[] = nodes.map((n, idx) => {
      const rand = rngs[idx]
      
      // TUNABLE: Even distribution with some randomness to avoid gaps
      // Base angle evenly spaced around circle + small random offset
      const baseAngle = (idx / nodes.length) * Math.PI * 2
      const randomOffset = (rand() - 0.5) * 0.6  // ±0.3 radians (~±17 degrees)
      // For perfectly even: use randomOffset = 0
      // For more randomness: use (rand() - 0.5) * 1.2 (±35 degrees)
      // For less randomness: use (rand() - 0.5) * 0.3 (±9 degrees)
      const angle = baseAngle + randomOffset
      
      // Random distance from center within the orbital ring
      const radius = orbitMin + (orbitMax - orbitMin) * rand()
      
      // Random size for this node within the defined range
      const r = nodeRMin + (nodeRMax - nodeRMin) * rand()
      
      // Convert polar coordinates (angle, radius) to x,y coordinates
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      // TUNABLE: Node drift/floating animation properties
      const phase = rand() * Math.PI * 2          // Starting point in animation cycle
      const amp = 5 + rand() * 8                  // How far nodes drift (5-13 pixels)
      const speed = 0.4 + rand() * 0.5            // How fast nodes drift (0.4-0.9)
      // For more dramatic drift: change to `10 + rand() * 15` and `0.6 + rand() * 0.8`
      // For less drift: change to `2 + rand() * 4` and `0.2 + rand() * 0.3`
      
      return { id: n.id, label: n.label, x, y, r, phase, amp, speed }
    })

    // ==================================================================================
    // OVERLAP PREVENTION: Pushes nodes apart so they don't overlap
    // ==================================================================================
    
    // TUNABLE: Minimum space between nodes 
    // Math.floor(size * 0.02) = 2% of constellation width as padding
    // Increase for more spacing: size * 0.04
    // Decrease for tighter packing: size * 0.01
    const margin = Math.max(10, Math.floor(size * 0.02))
    
    // TUNABLE: Relaxation iterations - more iterations = better separation
    // 80 = good balance of performance and spacing
    // 120 = more precise positioning but slower
    // 40 = faster but nodes might still overlap slightly
    for (let iter = 0; iter < 80; iter++) {
      // Check every pair of nodes for overlaps
      for (let a = 0; a < items.length; a++) {
        for (let b = a + 1; b < items.length; b++) {
          const pa = items[a]
          const pb = items[b]
          const dx = pb.x - pa.x
          const dy = pb.y - pa.y
          const d = Math.hypot(dx, dy) || 0.0001
          const minD = pa.r + pb.r + margin
          
          // If nodes are too close, push them apart
          if (d < minD) {
            const push = (minD - d) / 2
            const ux = dx / d
            const uy = dy / d
            pa.x -= ux * push
            pa.y -= uy * push
            pb.x += ux * push
            pb.y += uy * push
          }
        }
        
        // TUNABLE: Keep nodes within the orbital ring
        // 0.06 = gentle spring force to stay in orbit
        // 0.1 = stronger force (nodes snap back to orbit faster)
        // 0.02 = weaker force (nodes can drift further from orbit)
        const p = items[a]
        const dr = Math.hypot(p.x, p.y)
        const target = Math.min(orbitMax, Math.max(orbitMin, dr))
        const diff = target - dr
        p.x += (p.x / (dr || 1)) * diff * 0.06
        p.y += (p.y / (dr || 1)) * diff * 0.06
      }
    }

    // Attach centerRadius for render
    ;(items as any).centerRadius = centerRadius
    return items
  }, [size])

  const center = { x: size / 2 + parallax.x, y: size / 2 + parallax.y }

  return (
    <div ref={wrapRef} className="relative w-full flex items-center justify-center">
      <svg ref={svgRef} width={size} height={size} className="w-full h-auto" viewBox={`0 0 ${size} ${size}`}> 
        <defs>
          {positions.map((p) => (
            <filter key={`f-${p.id}`} id={`glow-${p.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={nodeColor[p.id]} floodOpacity="0.9" />
            </filter>
          ))}
          <filter id="center-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* ==================================================================================
             CONNECTING LINES: The lines from center to each orbital node
             ================================================================================== */}
        {positions.map((p: any) => {
          // TUNABLE: Node drift animation
          // p.amp * 0.6 = horizontal drift amount (0.6 = 60% of vertical drift)
          // Change to 1.0 for equal horizontal/vertical drift
          // Change to 0.2 for minimal horizontal drift
          const driftX = Math.cos(t * p.speed + p.phase) * (p.amp * 0.6)
          const driftY = Math.sin(t * p.speed + p.phase) * p.amp
          
          const x = center.x + p.x + driftX
          // TUNABLE: Hover lift effect - how much nodes float up when hovered
          // 8 = subtle lift, 15 = dramatic lift, 0 = no lift
          const y = center.y + p.y + driftY - (hoverId === p.id ? 8 : 0)
          
          return (
            <line
              key={`line-${p.id}`}
              x1={center.x}
              y1={center.y}
              x2={x}
              y2={y}
              // TUNABLE: Line appearance
              // "rgba(255,255,255,0.2)" = subtle white lines
              // "rgba(255,255,255,0.4)" = brighter lines
              // "rgba(100,200,255,0.3)" = blue-tinted lines
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1} // TUNABLE: Line thickness (1 = thin, 2 = thick)
            />
          )
        })}

        {/* ==================================================================================
             CENTER NODE: The main "A Thriving World" circle in the middle
             ================================================================================== */}
        <g filter="url(#center-glow)">
          <circle 
            cx={center.x} 
            cy={center.y} 
            r={(positions as any).centerRadius || 64} 
            // TUNABLE: Center node appearance
            fill="rgba(2,6,23,0.55)"           // Dark blue fill
            stroke="rgba(255,255,255,0.35)"   // White border
            // Change fill to "rgba(20,20,80,0.7)" for more blue
            // Change stroke to "rgba(255,255,255,0.6)" for brighter border
          />
          <text
            x={center.x}
            y={center.y + 8}
            textAnchor="middle"
            className="fill-white/90 font-semibold select-none"
            // TUNABLE: Center text size - Math.floor(size * 0.032) = 3.2% of constellation width
            style={{ fontSize: Math.max(18, Math.floor(size * 0.032)) }}
          >
            A Thriving World
          </text>
        </g>

        {/* ==================================================================================
             ORBITAL NODES: The satellite circles that float around the center
             ================================================================================== */}
        {positions.map((p: any) => {
          const driftX = Math.cos(t * p.speed + p.phase) * (p.amp * 0.6)
          const driftY = Math.sin(t * p.speed + p.phase) * p.amp
          const x = center.x + p.x + driftX
          let y = center.y + p.y + driftY
          if (hoverId === p.id) y -= 8
          
          return (
            <a key={`node-${p.id}`} href={`#${p.id}`}>
              <g
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId((h) => (h === p.id ? null : h))}
                className="cursor-pointer transition-transform duration-300"
                // TUNABLE: Hover scale effect
                // 1.12 = grow 12% on hover, 1.2 = grow 20%, 1.05 = grow 5%
                transform={`translate(${x}, ${y}) scale(${hoverId === p.id ? 1.12 : 1})`}
                filter={hoverId === p.id ? `url(#glow-${p.id})` : undefined}
              >
                <circle 
                  r={p.r} 
                  // TUNABLE: Node appearance
                  fill="rgba(2,6,23,0.6)"        // Dark fill (same as center)
                  stroke={nodeColor[p.id]}       // Colored border from nodeColor map
                  strokeOpacity="0.6"            // Border transparency
                  // Change fill to "rgba(10,10,40,0.8)" for darker nodes
                  // Change strokeOpacity to "0.9" for brighter colored borders
                />
                <text
                  x={0}
                  y={5}
                  textAnchor="middle"
                  className="fill-white/90 select-none"
                  // TUNABLE: Node text size - scales with node size
                  // Math.floor(p.r * 0.6) = 60% of node radius
                  style={{ fontSize: Math.max(12, Math.min(18, Math.floor(p.r * 0.6))) }}
                >
                  {p.label}
                </text>
              </g>
            </a>
          )
        })}
      </svg>
    </div>
  )
}


