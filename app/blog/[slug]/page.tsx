import { notFound } from 'next/navigation'
import { readFile } from 'fs/promises'
import { join } from 'path'
import Link from 'next/link'

interface BlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  published: boolean
  publishDate: string
  coverImage?: string
  createdAt: string
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const contentDir = join(process.cwd(), 'content', 'blog')
    const postFile = join(contentDir, `${slug}.json`)
    const contentFile = join(contentDir, `${slug}.md`)
    
    const [postData, markdownContent] = await Promise.all([
      readFile(postFile, 'utf-8'),
      readFile(contentFile, 'utf-8')
    ])
    
    const post = JSON.parse(postData) as BlogPost
    post.content = markdownContent
    
    if (!post.published) {
      return null
    }
    
    return post
  } catch (error) {
    console.error('Error reading blog post:', error)
    return null
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  if (!post) return notFound()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#22c55e] to-[#16a34a]">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Back to blog */}
          <div className="mb-8">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
          
          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-white/70 mb-4">
              <time dateTime={post.publishDate}>
                {new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              {post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {post.excerpt && (
              <p className="text-xl text-white/80 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>
          
          {/* Post Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-white/90 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-sky-300 hover:text-sky-200 underline">$1</a>')
                  .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full h-auto rounded my-4">')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^/, '<p>')
                  .replace(/$/, '</p>')
              }}
            />
          </article>
          
          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center justify-between">
              <Link 
                href="/admin" 
                className="text-white/70 hover:text-white transition-colors"
              >
                Admin Panel
              </Link>
              
              <Link 
                href="/blog"
                className="text-sky-300 hover:text-sky-200 transition-colors"
              >
                All Posts →
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}


