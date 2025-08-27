# Jeff's Website — Edgewise

A stunning Next.js website featuring a black-to-sunrise gradient hero with interactive dancing stars, an intelligent constellation visualization, auto-scrolling philosophy ticker, and a modern blog system. Built for deployment on Fly.io.

## ✨ Key Features

### 🌟 Interactive Star Field
- **Dancing stars** concentrated at the top that react to mouse and touch movement
- **Mobile-optimized** with reduced star count (24 vs 120) and smaller sizes for better performance
- **Twinkling animation** with smooth drift for organic feel
- **Scroll masking** so stars stay visually "stuck" at the top during transitions
- **Top-biased distribution** using squared random for realistic star field
- **Touch-responsive** stars react to finger movement on mobile devices

### 🌌 Interactive Constellation
- **Central philosophy hub** with "A Thriving World" at the center
- **8 orbital nodes**: Family, AI, Robotics, Writings, AR, Invention, Permaculture, Learning
- **Responsive cursor parallax** with smooth motion following mouse movement
- **Variable node sizes** with anti-overlap positioning system
- **Subtle drift animation** for organic, living feel
- **Color-coded nodes** with hover effects and glowing interactions
- **Even distribution** algorithm prevents large gaps between nodes
- **Full-width responsive** scaling that adapts to all screen sizes

### 📰 Philosophy Ticker
- **Full-width scrolling band** with 90s LED ticker aesthetic
- **Auto-starting animation** when entering viewport, pauses when off-screen
- **Seamless infinite loop** with readable scrolling speed
- **Large serif typography** for authority and gravitas
- **Semi-transparent black background** with subtle blur effects
- **Edge fade masking** for smooth text entrance/exit
- **Responsive sizing** with mobile and desktop optimizations

### 🌅 Scroll-Driven Color Transitions
- **Sunrise gradient**: Black → Dark Blue → Sky Blue → Green progression
- **Smooth fade overlays** with intersection observer tracking
- **Masked transitions** to eliminate hard visual seams
- **GPU-optimized** animations for smooth performance

### 📝 Content Management
- **WordPress headless CMS** with WPGraphQL API
- **Password-protected admin** redirects to WordPress wp-admin
- **Project showcase** with dynamic routing
- **Media gallery** for photos and videos

### 🚀 Performance & Deployment
- **Static-first** Next.js with optimized builds
- **Fly.io deployment** with Dockerfile included
- **Image optimization** with Next.js Image component
- **Responsive design** with Tailwind CSS
- **Mobile-first optimizations** with adaptive star field and layout stacking

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- flyctl CLI (for deployment)

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Serve production build locally
npm start
```

### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma db push
```

### WordPress (Headless) Setup

Use a self-hosted, open-source WordPress as the CMS while keeping this Next.js site as the frontend. As of Aug 2025 the standard free stack is:

- WPGraphQL (preferred API) with Gutenberg block editor
- REST API fallback if WPGraphQL is unavailable

Steps:

1) Provision WordPress (any host works)
- MySQL/MariaDB + PHP 8.1+
- Install plugins: WPGraphQL, WPGraphQL CORS (optional)
- Configure Permalinks → Post name

2) Configure this Next app
- Add to `.env.local`:
```env
WORDPRESS_GRAPHQL_ENDPOINT="https://your-wp-site.com/graphql"
WORDPRESS_SITE_URL="https://your-wp-site.com"
ADMIN_PASSWORD="your-strong-password"
WORDPRESS_ADMIN_URL="https://your-wp-site.com"
```
- Start dev server: `npm run dev`
- Visit `/blog` and individual posts at `/blog/[slug]`
- Click "Login" in top navigation, enter admin password to access WordPress wp-admin

3) Image domains
- If your WP media is hosted under your WP domain, add it to `images.remotePatterns` in `next.config.mjs`.

4) Theming
- Gutenberg output is rendered through `prose prose-invert` with Tailwind Typography for dark mode. Adjust styles in `app/globals.css` under “WordPress/Gutenberg content helpers”.

### Substack → WordPress Migration (free)

1) Export from Substack
- Substack → Settings → Exports → New export → download ZIP

2) Import into WordPress
- WordPress Admin → Tools → Import → Install “Substack Importer” → Run Importer
- Upload the Substack ZIP; check “Download and import file attachments”
- Assign authors

3) Verify
- Ensure posts, images, and comments appear in WP
- If you rely on tags/categories, validate they were created

4) Go-live checklist
- Confirm slugs match desired URL scheme (so `/blog/[slug]` works)
- Add redirects if you changed paths from Substack

## 🎨 Customization Guide

### Interactive Constellation
**File**: `components/Constellation.tsx`

**Content & Nodes**:
```typescript
// Lines 12-21: Add/remove/rename constellation nodes
const nodes: NodeDef[] = [
  { id: 'family', label: 'Family' },
  { id: 'ai', label: 'AI' },
  // ... add your own nodes here
]

// Lines 27-35: Customize node colors (any hex color)
const nodeColor: Record<string, string> = {
  family: '#f59e0b',      // Amber
  ai: '#38bdf8',          // Sky blue
  // ... match your node IDs
}
```

**Size & Layout**:
```typescript
// Lines 84: Constellation size - Math.max(560, w) = full width with minimum
// Lines 153-154: Orbital ring distance from center
const orbitMin = size * 0.20    // Inner orbit (20% from center)
const orbitMax = size * 0.38    // Outer orbit (38% from center)

// Lines 160-161: Node planet sizes
const nodeRMin = size * 0.04    // Smallest nodes (4% of constellation)
const nodeRMax = size * 0.08    // Largest nodes (8% of constellation)

// Line 146: Center planet size
const centerRadius = size * 0.12 // 12% of constellation width
```

**Motion & Interaction**:
```typescript
// Line 127: Cursor interaction strength
const PARALLAX_STRENGTH = 40    // 20=subtle, 60=dramatic, 0=none

// Lines 98-100: Animation smoothness
x: p.x + (targetParallax.x - p.x) * 0.12  // 0.12 = smooth, 0.5 = snappy

// Lines 194-195: Node drift animation
const amp = 5 + rand() * 8      // Drift distance (5-13 pixels)
const speed = 0.4 + rand() * 0.5 // Drift speed (0.4-0.9)
```

**Distribution**:
```typescript
// Lines 181-186: Even vs random distribution
const baseAngle = (idx / nodes.length) * Math.PI * 2     // Even spacing
const randomOffset = (rand() - 0.5) * 0.6               // ±17° variation
// For perfectly even: randomOffset = 0
// For more random: (rand() - 0.5) * 1.2  (±35°)
```

### Philosophy Ticker
**File**: `components/Ticker.tsx`

**Content & Speed**:
```typescript
// In app/page.tsx, line 23-28: Ticker configuration
<Ticker
  text="Your philosophy text here..."
  pixelsPerSecond={90}    // 60=slow, 120=fast, 200=very fast
  height={110}            // Band height in pixels
/>
```

**Typography**:
```typescript
// Lines 84-89: Text styling
className="text-2xl md:text-4xl font-serif font-medium tracking-wide"
// text-2xl md:text-4xl = 24px mobile, 36px desktop
// font-serif = Times New Roman family
// font-medium = slightly bold weight
// tracking-wide = letter spacing for readability
```

**Visual Style**:
```typescript
// Line 58: Background appearance
className="bg-black/45 backdrop-blur-[2px] ring-1 ring-white/10"
// bg-black/45 = 45% opacity black background
// backdrop-blur-[2px] = subtle background blur
// ring-white/10 = 10% opacity white border

// Lines 67-69: Edge fade masking
WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)"
// 6% and 94% control how much text fades at edges
```

### Star Field Behavior
**File**: `components/CursorField.tsx`

**Distribution & Count**:
```typescript
// Line 15: Adjust total number of stars (mobile vs desktop)
export default function CursorField({ count = 120, compact = false })

// Lines 22-24: Control star distribution (adaptive for mobile)
const u = Math.random()                    // Uniform across width
const v = (compact ? Math.pow(Math.random(), 1.4) * 1.0 : Math.pow(Math.random(), 2) * 0.8)
const size = compact ? 0.8 + Math.random() * 1.0 : 1.2 + Math.random() * 1.7
```

**Animation Behavior**:
```typescript
// Lines 60-62: Interaction & movement (adaptive for mobile)
const influence = (compact ? 120 : 140) * dpr  // Pointer repulsion radius
const snap = 0.12                               // Spring-back speed to home
const friction = 0.80                           // Movement damping

// Lines 80-82: Drift animation (reduced on mobile)
const drift = compact ? 0.015 : 0.02
pt.vx += Math.sin(t * 0.5 + pt.twinklePhase) * drift * dpr
pt.vy += Math.cos(t * 0.4 + pt.twinklePhase) * drift * dpr

// Line 100: Twinkle animation
const twinkle = 0.6 + 0.4 * Math.sin(t * 2.2 + pt.twinklePhase)
```

**Visual Style**:
```typescript
// Lines 46-47: Star appearance
ctx.fillStyle = '#ffffff'                           // Star color
ctx.shadowColor = 'rgba(255,255,255,0.85)'         // Glow color
ctx.shadowBlur = 6 * devicePixelRatio               // Glow radius

// Line 84: Star size
ctx.arc(pt.x || hx, pt.y || hy, pt.size * 2.0 * devicePixelRatio, 0, Math.PI * 2)
```

### Gradient & Color Transitions
**File**: `app/globals.css`

**Background Gradient**:
```css
/* Lines 6-15: Global sunrise gradient */
.gradients {
  background: linear-gradient(
    to bottom,
    #000000 0%,    /* Pure black at top */
    #0b1220 15%,   /* Dark blue-black */
    #0ea5e9 35%,   /* Sky blue */
    #16a34a 65%,   /* Green */
    #15803d 100%   /* Dark green at bottom */
  );
}
```

**File**: `components/Hero.tsx`

**Responsive Layout**:
```typescript
// Mobile: Stacked layout with larger portrait
<div className="flex flex-col md:hidden p-6">
  <div className="relative w-64 h-96 mb-4">  // Larger mobile portrait
    <Image src="/jeff.png" ... />
  </div>
  // Text with backdrop for readability
</div>

// Desktop: Side-by-side grid layout
<div className="hidden md:grid md:grid-cols-2 h-full">
  // Original desktop layout preserved
</div>
```

**Hero Overlay Masking**:
```typescript
// Lines 39-41: Black overlay with soft bottom fade
style={{
  opacity: Math.max(0, 1 - phase),
  WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
}}

// Lines 47-48: Star field masking (tighter on mobile)
style={{ 
  WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' 
}}
```

**Scroll Animation**:
```typescript
// Lines 13-22: Intersection observer for scroll tracking
const obs = new IntersectionObserver(
  (entries) => {
    const r = entries[0]
    setPhase(1 - r.intersectionRatio)  // Convert scroll to 0-1 phase
  },
  { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }  // 21 steps for smooth animation
)
```

### Noise Texture
**File**: `app/globals.css`

```css
/* Lines 17-25: Subtle noise overlay */
.noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.06;                    /* Adjust visibility */
  background-image: radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px);
  background-size: 3px 3px;         /* Adjust grain size */
}
```

## 📁 Project Structure

```
jeffs-website/
├── app/                          # Next.js 13+ app directory
│   ├── (pages)/                  # Route groups
│   ├── admin/                    # Password-protected WordPress login
│   ├── api/                      # API routes
│   │   └── contact/              # Contact form
│   ├── blog/                     # WordPress-powered blog pages
│   ├── projects/                 # Project showcase
│   ├── globals.css               # Global styles & gradients
│   ├── layout.tsx                # Root layout with gradient
│   └── page.tsx                  # Homepage with constellation & ticker
├── components/                   # Reusable components
│   ├── AutoCarousel.tsx         # Auto-advancing project carousel
│   ├── Constellation.tsx        # Interactive philosophy constellation
│   ├── CursorField.tsx          # Interactive star field
│   ├── Hero.tsx                 # Hero section with scroll effects
│   ├── Navigation.tsx           # Site navigation
│   ├── Ticker.tsx               # Auto-scrolling philosophy ticker
│   └── TiptapEditor.tsx         # Rich text editor
├── content/                     # MDX content
│   ├── blog/                    # Blog posts
│   └── projects/                # Project case studies
├── lib/                         # Utilities
│   └── prisma.ts               # Database client
├── prisma/                      # Database schema
├── public/                      # Static assets
└── fly.toml                     # Fly.io deployment config
```

## ✅ Recent Updates (Aug 2025)

- Switched to a WordPress-only blog
  - Removed legacy Prisma blog admin/UI and API routes
    - Removed: `app/admin/blog/**`, `app/api/blog/**`
  - Refactored `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` to fetch from WordPress only
- Navigation and login
  - Top-right button renamed to “Login” and points to `/admin`
  - `/admin` shows a password form and redirects to WordPress `wp-admin`
  - Required env: `ADMIN_PASSWORD`, plus either `WORDPRESS_ADMIN_URL` or `WORDPRESS_SITE_URL`
- Fly.io auth and deployment
  - Resolved flyctl double-auth issue by clearing `FLY_API_TOKEN` and re-authenticating
  - Deployed site to Fly (`jeff-edgewise`) and set secrets:
    - `WORDPRESS_SITE_URL`, `WORDPRESS_GRAPHQL_ENDPOINT`, `ADMIN_PASSWORD`
- WordPress app hardening (`jeff-edgewise-wp`)
  - Ensured a single running Machine (removed duplicate)
  - Increased RAM to 1 GB to prevent OOM kills
  - Cleared a malformed `WORDPRESS_CONFIG_EXTRA` that caused `wp-admin` 500s
  - Recommendation: set WordPress Address and Site Address in the WP Admin UI (Settings → General)
- Cloudinary media delivery (recommended)
  - Install “Cloudinary – Media Plugin”, connect account, enable “Automatically upload media” + “Deliver media via Cloudinary”, then run a bulk sync from Media Library

### Troubleshooting: wp-admin 500 after deploy

- Symptom: `PHP Parse error … unexpected identifier "FORCE_SSL_ADMIN" in wp-config.php(…): eval()'d code`
- Cause: malformed PHP injected via `WORDPRESS_CONFIG_EXTRA` (quoting in shell produced invalid PHP)
- Fix: set `WORDPRESS_CONFIG_EXTRA` to a safe no-op (or leave unset) and configure URLs in WP Admin UI
  - WP Admin → Settings → General → set both URLs to `https://jeff-edgewise-wp.fly.dev`

## 🚀 Deployment

### Fly.io Deployment

**Finding flyctl on Windows:**
If `flyctl` command isn't recognized, it's likely installed but not in your PATH. Find it with:
```powershell
# Search for flyctl installation
Get-ChildItem -Path C:\Users\$env:USERNAME -Recurse -Filter flyctl.exe -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
```

**Common install locations:**
- `C:\Users\[username]\.fly\bin\flyctl.exe` (PowerShell installer)
- `C:\ProgramData\chocolatey\bin\flyctl.exe` (Chocolatey)
- `C:\Program Files\flyctl\flyctl.exe` (Manual install)

**Deploy commands:**
```bash
# If flyctl is in PATH:
flyctl auth login
flyctl deploy --app jeff-edgewise --remote-only --detach

# If flyctl is NOT in PATH (use full path):
& "C:\Users\[username]\.fly\bin\flyctl.exe" auth login
& "C:\Users\[username]\.fly\bin\flyctl.exe" deploy --app jeff-edgewise --remote-only --detach

# View logs
flyctl logs --app jeff-edgewise
# or with full path:
& "C:\Users\[username]\.fly\bin\flyctl.exe" logs --app jeff-edgewise

# Scale app
flyctl scale count 1 --app jeff-edgewise
```

**Deploy flags explained:**
- `--remote-only`: Build in Fly's cloud (faster, handles large files better)
- `--detach`: Don't wait for deployment to complete (optional)

### Custom domain on Fly.io (Namecheap)

Serve the site at `https://jeff-edge.com` and `https://www.jeff-edge.com`.

1) DNS at Namecheap
- ALIAS (flattened CNAME) at apex:
  - Host: `@`
  - Value: `jeff-edgewise.fly.dev`
  - TTL: 5 minutes or Automatic
- CNAME for `www`:
  - Host: `www`
  - Value: `jeff-edgewise.fly.dev`
  - TTL: Automatic

That setup matches the screenshot and is correct. Alternatively you can point `@` to A/AAAA from `flyctl ips list`, but ALIAS → `appname.fly.dev` is simplest.

2) Authenticate `flyctl` on Windows
```powershell
# If flyctl is in PATH
flyctl auth login

# If not in PATH, use full path (adjust if different on your machine)
$FLY = "C:\\Users\\$env:USERNAME\\.fly\\bin\\flyctl.exe"
& $FLY auth login
```

3) Request certificates
```powershell
# Use either flyctl (on PATH) or $FLY (full path)
flyctl certs add jeff-edge.com --app jeff-edgewise
flyctl certs add www.jeff-edge.com --app jeff-edgewise
```

4) Add the ACME challenge CNAMEs printed by the commands
- Create CNAME: `_acme-challenge.jeff-edge.com` → `_acme-challenge.jeff-edgewise.fly.dev`
- Create CNAME: `_acme-challenge.www.jeff-edge.com` → `_acme-challenge.jeff-edgewise.fly.dev`

5) Verify issuance
```powershell
flyctl certs show jeff-edge.com --app jeff-edgewise
flyctl certs show www.jeff-edge.com --app jeff-edgewise
# or all
flyctl certs list --app jeff-edgewise
```

Notes
- No changes are required in `fly.toml`; Fly will route based on the certificate.
- For a single canonical host, you can redirect `www` → apex (or vice versa) in your app or with a small middleware.

### Environment Variables
Create `.env.local` for local development:
```env
# Database (for Prisma, if needed for projects/other features)
DATABASE_URL="file:./dev.db"

# WordPress Configuration (Required)
WORDPRESS_GRAPHQL_ENDPOINT="https://your-wp-site.com/graphql"
WORDPRESS_SITE_URL="https://your-wp-site.com"

# Admin Access (Required)
ADMIN_PASSWORD="your-strong-password"
WORDPRESS_ADMIN_URL="https://your-wp-site.com"

# Cloudinary (Optional - for media)
CLOUDINARY_CLOUD_NAME="your-cloud-name" 
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

For production deployment on Fly.io, set these as secrets:
```bash
flyctl secrets set ADMIN_PASSWORD="your-password" --app your-app-name
flyctl secrets set WORDPRESS_SITE_URL="https://your-wp-site.com" --app your-app-name
flyctl secrets set WORDPRESS_GRAPHQL_ENDPOINT="https://your-wp-site.com/graphql" --app your-app-name
```

## 🎯 Performance Tips

### Star Field Optimization
- **Adaptive count**: `count={24}` on mobile, `count={120}` on desktop
- **Performance tuning**: Clamped devicePixelRatio and reduced drift on mobile
- **Touch responsiveness**: Pointer events for both mouse and touch interaction
- **Layout separation**: Dedicated mobile (stacked) and desktop (grid) layouts

### Gradient Performance
- **Use CSS custom properties** for dynamic color changes
- **Leverage CSS containment** for heavy scroll animations
- **Implement intersection observer** with appropriate thresholds

### Build Optimization
```bash
# Analyze bundle size
npm run build

# Enable experimental features in next.config.mjs
experimental: {
  optimizeCss: true,
  optimizePackageImports: ['lucide-react']
}
```

## 🔧 Troubleshooting

### Common Issues

**Stars not appearing**:
- Check canvas dimensions in browser DevTools
- Verify `devicePixelRatio` calculations (clamped for performance)
- Ensure WebGL context is available
- On mobile: Verify `compact` mode is enabled with reduced star count

**Gradient seams**:
- Adjust mask percentages in `Hero.tsx`
- Check CSS gradient stop positions
- Verify sticky positioning works correctly

**Scroll performance**:
- Reduce intersection observer thresholds
- Use `will-change: transform` on animated elements
- Consider `transform3d()` for hardware acceleration

## 📦 Dependencies

### Core
- **Next.js 14+**: React framework with app directory
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first styling
- **Prisma**: Database ORM

### Content & Editor
- **@tiptap/react**: Rich text editor
- **next-mdx-remote**: MDX processing
- **gray-matter**: Frontmatter parsing

### Deployment
- **Fly.io**: Platform-as-a-service hosting
- **Cloudinary**: Image and media management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ by Jeff** • [Live Site](https://jeff-edge.com) • [GitHub](https://github.com/your-username/jeffs-website)