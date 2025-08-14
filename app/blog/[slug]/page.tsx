import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

export default function BlogPost({ params }: { params: { slug: string } }) {
  const file = path.join(process.cwd(), 'content', 'blog', `${params.slug}.mdx`)
  if (!fs.existsSync(file)) return notFound()
  const raw = fs.readFileSync(file, 'utf8')
  const { content, data } = matter(raw)

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-invert">
      <h1>{(data as any).title || params.slug}</h1>
      <MDXRemote source={content} />
    </main>
  )
}


