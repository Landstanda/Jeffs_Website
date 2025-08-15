# Jeff's Website — Edgewise

A stunning Next.js website featuring a black-to-sunrise gradient hero with interactive dancing stars, scroll-triggered color transitions, and a modern blog system. Built for deployment on Fly.io.

## ✨ Key Features

### 🌟 Interactive Star Field
- **Dancing stars** concentrated at the top that react to mouse movement
- **Twinkling animation** with smooth drift for organic feel
- **Scroll masking** so stars stay visually "stuck" at the top during transitions
- **Top-biased distribution** using squared random for realistic star field

### 🌅 Scroll-Driven Color Transitions
- **Sunrise gradient**: Black → Dark Blue → Sky Blue → Green progression
- **Smooth fade overlays** with intersection observer tracking
- **Masked transitions** to eliminate hard visual seams
- **GPU-optimized** animations for smooth performance

### 📝 Content Management
- **MDX blog** with rich text editor (Tiptap)
- **Project showcase** with dynamic routing
- **Media gallery** for photos and videos
- **Admin dashboard** for content management

### 🚀 Performance & Deployment
- **Static-first** Next.js with optimized builds
- **Fly.io deployment** with Dockerfile included
- **Image optimization** with Next.js Image component
- **Responsive design** with Tailwind CSS

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

## 🎨 Customization Guide

### Star Field Behavior
**File**: `components/CursorField.tsx`

**Distribution & Count**:
```typescript
// Line 7: Adjust total number of stars
export default function CursorField({ count = 120 })

// Lines 24-26: Control star distribution
const u = Math.random()                    // Uniform across width
const v = Math.pow(Math.random(), 2) * 0.8 // Top-biased height (0.8 = 80% of screen)
const size = 1.2 + Math.random() * 1.8     // Star size variance
```

**Animation Behavior**:
```typescript
// Lines 54-56: Interaction & movement
const influence = 80 * devicePixelRatio  // Mouse repulsion radius
const snap = 0.08                        // Spring-back speed to home
const friction = 0.88                    // Movement damping

// Lines 65-66: Drift animation
pt.vx += Math.sin(t * 0.5 + pt.twinklePhase) * 0.02  // Horizontal drift
pt.vy += Math.cos(t * 0.4 + pt.twinklePhase) * 0.02  // Vertical drift

// Line 82: Twinkle animation
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

**Hero Overlay Masking**:
```typescript
// Lines 28-35: Black overlay with soft bottom fade
style={{
  opacity: Math.max(0, 1 - phase),
  WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
}}

// Lines 32-34: Star field masking
style={{ 
  WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' 
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
│   ├── admin/                    # Admin dashboard
│   │   └── blog/                 # Blog management
│   ├── api/                      # API routes
│   │   ├── blog/                 # Blog endpoints
│   │   └── contact/              # Contact form
│   ├── blog/                     # Blog pages
│   ├── projects/                 # Project showcase
│   ├── globals.css               # Global styles & gradients
│   ├── layout.tsx                # Root layout with gradient
│   └── page.tsx                  # Homepage
├── components/                   # Reusable components
│   ├── CursorField.tsx          # Interactive star field
│   ├── Hero.tsx                 # Hero section with scroll effects
│   ├── Navigation.tsx           # Site navigation
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

## 🚀 Deployment

### Fly.io Deployment
```bash
# Deploy to production
flyctl deploy --app jeff-edgewise

# View logs
flyctl logs --app jeff-edgewise

# Scale app
flyctl scale count 1 --app jeff-edgewise
```

### Environment Variables
Create `.env.local` for local development:
```env
DATABASE_URL="file:./dev.db"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 🎯 Performance Tips

### Star Field Optimization
- **Reduce count** for mobile: `count={60}` on smaller screens
- **Adjust devicePixelRatio** calculations for different displays
- **Use CSS transforms** instead of canvas for simple movements (if needed)

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
- Verify `devicePixelRatio` calculations
- Ensure WebGL context is available

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

**Built with ❤️ by Jeff** • [Live Site](https://jeff-edgewise.fly.dev) • [GitHub](https://github.com/your-username/jeffs-website)