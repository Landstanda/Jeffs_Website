import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import matter from 'gray-matter'

export default function ProjectsIndex() {
  const dir = path.join(process.cwd(), 'content', 'projects')
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.mdx')) : []
  const projects = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data } = matter(raw)
    return { slug: file.replace(/\.mdx$/, ''), ...(data as any) }
  })

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-8">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="text-white/70">Timelines and case studies. Select a project to view details.</p>
      <ul className="grid md:grid-cols-2 gap-6">
        {projects.length === 0 && <li className="text-white/60">No projects yet. Coming soon.</li>}
        {projects.map((p) => (
          <li key={p.slug} className="p-6 bg-white/5 ring-1 ring-white/10 rounded">
            <h3 className="font-medium mb-1">{p.title || p.slug}</h3>
            {p.summary && <p className="text-white/70 mb-2">{p.summary}</p>}
            <Link href={`/projects/${p.slug}`} className="text-sky-300 hover:text-sky-200">Read more</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}


