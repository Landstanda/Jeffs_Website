import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import matter from 'gray-matter'

export default function BlogIndex() {
  const dir = path.join(process.cwd(), 'content', 'blog')
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.mdx')) : []
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data } = matter(raw)
    return { slug: file.replace(/\.mdx$/, ''), ...(data as any) }
  })

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <ul className="space-y-4">
        {posts.length === 0 && <li className="text-white/60">No posts yet. Coming soon.</li>}
        {posts.map((p) => (
          <li key={p.slug} className="p-4 bg-white/5 ring-1 ring-white/10 rounded">
            <Link href={`/blog/${p.slug}`} className="text-sky-300 hover:text-sky-200">
              {p.title || p.slug}
            </Link>
            {p.description && <p className="text-white/70">{p.description}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}


