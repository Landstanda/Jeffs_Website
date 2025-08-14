import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TiptapEditor from '@/components/TiptapEditor'
import Image from 'next/image'
import Link from 'next/link'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { 
      slug: params.slug,
      published: true 
    }
  })
  
  if (!post) return notFound()
  
  const content = JSON.parse(post.content)

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Back to blog */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-sky-400 hover:text-sky-300 mb-8 transition-colors"
      >
        ← Back to Blog
      </Link>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-white/70 mb-6">{post.excerpt}</p>
        )}
        
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <time className="text-white/50">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          
          {post.tags && (
            <div className="flex flex-wrap gap-2">
              {post.tags.split(',').map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-sky-500/20 text-sky-300 text-sm rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-invert prose-lg max-w-none">
        <TiptapEditor content={content} editable={false} />
      </article>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-white/10">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors"
        >
          ← Back to all posts
        </Link>
      </footer>
    </main>
  )
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  })
  
  return posts.map(post => ({ slug: post.slug }))
}