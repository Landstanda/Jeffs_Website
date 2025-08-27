import Link from 'next/link'
import { fetchWordpressPosts, isWordpressConfigured } from '@/lib/wordpress'
// Using native <img> to avoid remote domain restrictions that can crash the page

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
  let posts: Array<any> = []
  if (isWordpressConfigured()) {
    try {
      const wpPosts = await fetchWordpressPosts(20)
      posts = wpPosts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        featuredImage: p.featuredImage,
        tags: p.tags,
        createdAt: new Date(p.createdAt),
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(p.createdAt),
      }))
    } catch (error) {
      console.error('Failed to load posts from WordPress:', error)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-white/70 text-lg">Thoughts on AI, permaculture, and building the future</p>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/60 text-lg">No posts yet. Coming soon.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-colors">
              <Link href={`/blog/${post.slug}`} className="block">
                {post.featuredImage && typeof post.featuredImage === 'string' && post.featuredImage.trim().length > 0 && (
                  <div className="w-full h-48 md:h-64 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
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
                        {post.tags.split(',').map((tag: string, index: number) => (
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


