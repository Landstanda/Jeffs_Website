# Personal Website on Fly.io — Build Plan

## Vision
- **Persona**: Inventive futurist and permaculture‑obsessed AI optimist. Show playful, tech‑savvy vibes while sharing blogs, videos, and projects.
- **Hero concept**: Start on a pure black intro that transforms with scroll; mouse/gesture‑reactive visuals; optional interactive 3D (GLB) that hints at AR.
- **Constraint**: Keep it thrifty. Operate as a single Fly.io app using features that minimize cost while still feeling cutting‑edge.

## What Fly.io excels at (practical takeaways)
- **Fly Machines (Firecracker microVMs)**: Fast‑booting VMs with autostart on inbound traffic and autostop on idle for cost savings.
- **Global anycast networking**: One anycast IP. Requests hit the nearest region; great for low‑latency WebSockets/SSE and snappy SSR.
- **Full server features**: Long‑lived connections, background jobs, cron, custom runtimes (Dockerfile). TLS certs managed for your domain.
- **Persistent storage**: **Volumes** for per‑region disk; **LiteFS** (SQLite replication) for simple DB needs with a single write‑primary and global read replicas.
- **Managed Postgres (MPG)**: Optional Postgres cluster when you outgrow SQLite. Start small; scale later.
- **Observability**: App logs, metrics, regions. Straightforward scale controls (CPU/RAM, concurrency, regions).

Notes for thriftiness:
- Prefer a single small Machine with **autostart/autostop** to reduce idle cost.
- Keep most pages **static or SSG** and cache aggressively; do SSR only where it adds value.
- Store content as files (Markdown/MDX) initially; add DB later if needed.

## Architecture options (choose one)
1) **Static‑first Next.js** (recommended)
   - Next.js (App Router) with SSG/ISR for Home/Blog/Projects; a few API routes for contact form and tiny realtime demos.
   - SQLite for optional lightweight data; start file‑based content to keep infra minimal.
   - Pros: great DX, image optimization, MDX support, one deploy. Lowest operational complexity.

2) **SSR‑heavy Next.js**
   - Render everything at request time to showcase global latency benefits. Add WebSockets/SSE demos.
   - Pros: flashy dynamic feel. Cons: more runtime cost and complexity.

3) **Astro/Eleventy static + micro API**
   - Fully static site with a tiny Node/Bun service for forms/websockets.
   - Pros: ultra‑cheap. Cons: juggling two build systems.

→ Recommendation: Start with Option 1. You can still add realtime and 3D.

## Content model
- **Blog**: MDX files in repo. Syntax‑highlighting, footnotes, embeds. Tags like AI, Permaculture, Automation, Futures.
- **Videos**: YouTube/Vimeo embeds; host thumbnails locally for speed.
- **Projects/Experiments**: JSON/YAML frontmatter + MDX pages.
- **Images**: In `public/` and optimized by Next Image.
- Optional later: headless CMS (Notion via sync, Sanity/Contentful) if you prefer editing online.

## Data storage strategy
- Phase 0: **No DB**. Files only. Contact form hits an API route and emails via Resend (or stores a JSON file).
- Phase 1: **SQLite + Prisma** for small dynamic bits (likes, counters, submissions). Single primary region.
- Phase 2 (optional): **LiteFS** to replicate SQLite for read‑heavy pages globally; keep writes in one region. Useful for realtime counters/leaderboards.
- Future: **Managed Postgres** if you outgrow SQLite.

## Pages and features
- **Home / Intro**
  - Black canvas that morphs with scroll into color gradients; reveal headline: “Automating better futures.”
  - Mouse‑/touch‑reactive effects: shader particles or parallax. Subtle, performant.
  - Optional GLB hero: a “seed → forest” 3D micro scene that reacts to scroll, hinting at permaculture and growth.

- **About**
  - Short narrative: inventor/futurist, AI optimist, permaculture advocate. Quick timeline and links.

- **Blog**
  - MDX posts with cover images, tags, reading time, deep‑linkable headings, TOC.
  - Category filters (AI, Permaculture, Automation, Field notes).

- **Projects**
  - Case‑study cards. Optional interactive GLB or short clips. Link to repos/videos.

- **Media**
  - Video gallery (embeds). Photo essays. Lightbox.

- **Experiments** (playful lab)
  - Three.js/WebGPU sketches, AR tryouts with `<model-viewer>`.
  - “Remote beach cleanup counter” demo with live updates via SSE/WebSockets.

- **Contact**
  - API route + hCaptcha. Emails via Resend. Social links.

## Interaction design details
- **Scroll‑driven color**: CSS custom properties + IntersectionObserver to transition from black → accent gradients. GPU‑friendly.
- **Pointer‑reactive visuals**: Canvas or Three.js particles following velocity; degrade gracefully on mobile.
- **3D GLB/AR**: Start with `<model-viewer>` for easy GLB + AR; upgrade to Three.js or `@react-three/fiber` if you need custom shaders.
- **Realtime**: Minimal Node ws/SSE endpoint to broadcast counters or visitor pings. Runs fine on one Machine.

## Performance & cost controls
- Use Next Image, prefetch critical fonts, compress GLBs (Draco/Basis), lazy‑load non‑critical 3D.
- Send `Cache-Control` for static assets so Fly’s proxy and browsers cache aggressively.
- Keep Machine size small (shared CPU, low RAM); enable **autostop** on idle and **autostart** on request.
- Scope WebSockets to just the experiment page; close idle sockets.

## Tech stack
- **Framework**: Next.js (App Router), React, TypeScript.
- **Styling**: Tailwind CSS + CSS variables; Framer Motion for tasteful motion.
- **3D/AR**: `<model-viewer>` initially; Three.js/`@react-three/fiber` for custom scenes if needed.
- **Forms/Email**: Next API route + Resend (or EmailJS) + hCaptcha.
- **DB**: None → SQLite (+ LiteFS optional) → Postgres later.
- **Deploy**: Dockerfile + `fly.toml` on Fly Machines.

## Inspirations to visit
- **Bruno Simon** — 3D/Three.js driving school portfolio: `https://bruno-simon.com`
- **Brittany Chiang** — Modern, tasteful portfolio: `https://brittanychiang.com`
- **Robby Leonardi** — Interactive resume/game: `https://www.rleonardi.com/interactive-resume/`
- **Tim Holman** — Playful experiments: `https://tholman.com`
- **Josh Comeau** — Polished blog UX: `https://www.joshwcomeau.com`
- **Lynn Fisher** — Creative micro‑sites: `https://lynnandtonic.com`
- **Guillermo Rauch** — Minimal tech leader site: `https://rauchg.com`
- **Cassie Evans** — SVG/animation gems: `https://www.cassie.codes`

## Deployment plan (single app, thrifty)
1) Initialize Next.js app (App Router, TypeScript, Tailwind). Add MDX for blog.
2) Build Dockerfile and `fly.toml` with small shared‑CPU Machine, one region (closest to you or your audience), **autostart/autostop** enabled.
3) Add domain + TLS via Fly.
4) Add minimal API routes (contact, realtime demo). Keep everything else static/SSG.

### Commands (reference)
```bash
# Install CLI
winget install flyctl

# In repo root
fly launch --no-deploy --name <your-app-name>

# Review fly.toml; set primary region (e.g., iad, sjc, cdg)
fly deploy

# Basic scaling (example small shared CPU)
fly scale vm shared-cpu-1x --memory 256

# Enable autostop/autostart (machines apps)
fly machines update --app <your-app-name> --autostop --autostart
```

## Milestones
- [ ] M0 — Repo scaffolding: Next.js + Tailwind + MDX, baseline pages/routes.
- [ ] M1 — Hero interactions: black→color scroll, pointer‑reactive layer.
- [ ] M2 — 3D/AR: GLB hero via `<model-viewer>`; optional R3F scene.
- [ ] M3 — Content: import first 5 blog posts, projects, media gallery.
- [ ] M4 — Contact form: API route, hCaptcha, email delivery.
- [ ] M5 — Realtime experiment: SSE/WebSocket counter demo.
- [ ] M6 — Fly deploy: autostart/autostop, domain + TLS, cache headers.
- [ ] M7 — Polish: accessibility pass, Lighthouse >90, analytics.

## Decisions to make
- [ ] Hero style: particles vs GLB micro‑scene vs both (fallbacks on mobile).
- [ ] 3D stack: `<model-viewer>` only vs Three.js/`@react-three/fiber`.
- [ ] Content source: MDX in repo (now) vs headless CMS (later).
- [ ] Primary region: nearest to you vs nearest to audience.
- [ ] Analytics: Plausible vs Umami vs PostHog (self‑host later).
- [ ] Contact delivery: Resend vs EmailJS vs SMTP.
- [ ] Realtime transport: SSE (simpler) vs WebSocket (bi‑directional).
- [ ] DB path: stay file‑based vs add SQLite (+ LiteFS) vs move to Postgres later.

## Risk/complexity notes
- Heavy Three.js can balloon bundle size. Keep hero minimal; lazy‑load bigger scenes.
- LiteFS is great but introduces topology concerns (single‑writer). Only add when needed.
- WebGPU adoption varies; stick to WebGL2 for broad support; progressive enhancement.

## Next step (proposed)
If you agree with Option 1 (Static‑first Next.js):
1) I’ll scaffold the Next.js app with Tailwind + MDX.
2) Implement the black→color scroll hero and basic pages.
3) Add Dockerfile and `fly.toml`, then deploy to your Fly.io account.


