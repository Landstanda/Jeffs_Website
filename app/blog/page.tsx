import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  tags?: string
  createdAt: Date
  updatedAt: Date
}

export default async function BlogIndex() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-white/70 text-lg">Thoughts on AI, permaculture, and building the future</p>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/60 text-lg">No posts yet. Coming soon.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-colors">
              <Link href={`/blog/${post.slug}`} className="block">
                {post.featuredImage && (
                  <div className="relative w-full h-48 md:h-64">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-white mb-2 hover:text-sky-300 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-white/70 mb-4 line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <time className="text-white/50 text-sm">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    {post.tags && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.split(',').map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-sky-500/20 text-sky-300 text-xs rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}


