import { notFound } from 'next/navigation'
import TiptapEditor from '@/components/TiptapEditor'
// Use native <img> to avoid crashes from remote domain/image config
import Link from 'next/link'
import { fetchWordpressPostBySlug, isWordpressConfigured } from '@/lib/wordpress'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  let post: any = null
  let content: any = null

  if (isWordpressConfigured()) {
    try {
      const wp = await fetchWordpressPostBySlug(params.slug)
      if (wp) {
        post = {
          title: wp.title,
          excerpt: wp.excerpt,
          featuredImage: wp.featuredImage,
          tags: wp.tags,
          createdAt: new Date(wp.createdAt),
        }
        content = { type: 'html', html: wp.contentHtml }
      }
    } catch (e) {
      console.error('Failed to fetch WordPress post:', e)
    }
  }

  if (!post) return notFound()

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
      {post.featuredImage && typeof post.featuredImage === 'string' && post.featuredImage.trim().length > 0 && (
        <div className="w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
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
              {post.tags.split(',').map((tag: string, index: number) => (
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
        {content ? (
          content?.type === 'html' ? (
            <div
              className="prose prose-invert prose-sky max-w-none"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          ) : (
            <TiptapEditor content={content} editable={false} />
          )
        ) : (
          <p className="text-white/70">No content available.</p>
        )}
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

 