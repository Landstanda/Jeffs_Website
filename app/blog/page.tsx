import Link from 'next/link'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

interface BlogPost {
  title: string
  slug: string
  excerpt: string
  tags: string[]
  published: boolean
  publishDate: string
  coverImage?: string
  createdAt: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const contentDir = join(process.cwd(), 'content', 'blog')
    const files = await readdir(contentDir)
    
    const posts: BlogPost[] = []
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = join(contentDir, file)
        const content = await readFile(filePath, 'utf-8')
        const post = JSON.parse(content) as BlogPost
        
        if (post.published) {
          posts.push(post)
        }
      }
    }
    
    // Sort by publish date (newest first)
    return posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export default async function BlogIndex() {
  const posts = await getBlogPosts()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#22c55e] to-[#16a34a]">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">
            Blog
          </h1>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70 text-xl mb-4">No published posts yet.</p>
              <Link 
                href="/admin" 
                className="inline-block px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded transition-colors"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.slug} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  {post.coverImage && (
                    <div className="mb-4">
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <h2 className="text-2xl font-semibold text-white mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-sky-200 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-white/80 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-white/60">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </span>
                      
                      {post.tags.length > 0 && (
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="px-2 py-1 bg-white/20 rounded text-white/80 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-sky-300 hover:text-sky-200 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link 
              href="/admin" 
              className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded border border-white/30 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}


