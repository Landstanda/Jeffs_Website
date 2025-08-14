"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  published: boolean
  publishDate: string
  coverImage?: string
}

export default function AdminPanel() {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: [],
    published: false,
    publishDate: new Date().toISOString().split('T')[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })

      if (response.ok) {
        alert('Post created successfully!')
        router.push('/blog')
      } else {
        throw new Error('Failed to create post')
      }
    } catch (error) {
      alert('Error creating post: ' + error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22c55e] to-[#16a34a]">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-8">Blog Admin Panel</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => {
                    setPost({ ...post, title: e.target.value })
                    if (!post.slug) {
                      setPost(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
                    }
                  }}
                  className="w-full p-3 rounded bg-white/20 border border-white/30 text-white placeholder-white/50"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-white font-medium mb-2">URL Slug</label>
                <input
                  type="text"
                  value={post.slug}
                  onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  className="w-full p-3 rounded bg-white/20 border border-white/30 text-white placeholder-white/50"
                  placeholder="post-url-slug"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-white font-medium mb-2">Excerpt</label>
                <textarea
                  value={post.excerpt}
                  onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                  className="w-full p-3 rounded bg-white/20 border border-white/30 text-white placeholder-white/50"
                  placeholder="Brief description of the post..."
                  rows={3}
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-white font-medium mb-2">Content</label>
                <textarea
                  value={post.content}
                  onChange={(e) => setPost({ ...post, content: e.target.value })}
                  className="w-full p-4 rounded bg-white/20 border border-white/30 text-white placeholder-white/50 font-mono"
                  placeholder="Write your post content here... (Markdown supported)"
                  rows={15}
                  required
                />
                <p className="text-white/70 text-sm mt-2">
                  Supports Markdown: **bold**, *italic*, [links](url), ![images](url)
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={post.tags.join(', ')}
                  onChange={(e) => setPost({ ...post, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="w-full p-3 rounded bg-white/20 border border-white/30 text-white placeholder-white/50"
                  placeholder="AI, Permaculture, Automation"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-white font-medium mb-2">Cover Image URL</label>
                <input
                  type="url"
                  value={post.coverImage || ''}
                  onChange={(e) => setPost({ ...post, coverImage: e.target.value })}
                  className="w-full p-3 rounded bg-white/20 border border-white/30 text-white placeholder-white/50"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Publish Settings */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={post.published}
                    onChange={(e) => setPost({ ...post, published: e.target.checked })}
                    className="rounded"
                  />
                  Publish immediately
                </label>
                
                <div>
                  <label className="block text-white font-medium mb-2">Publish Date</label>
                  <input
                    type="date"
                    value={post.publishDate}
                    onChange={(e) => setPost({ ...post, publishDate: e.target.value })}
                    className="p-2 rounded bg-white/20 border border-white/30 text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-medium rounded transition-colors"
              >
                {isSubmitting ? 'Creating Post...' : 'Create Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
