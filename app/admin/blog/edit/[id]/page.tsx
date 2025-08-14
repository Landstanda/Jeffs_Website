"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TiptapEditor from '@/components/TiptapEditor'

interface Post {
  id: string
  title: string
  slug: string
  content: any
  excerpt?: string
  published: boolean
  featuredImage?: string
  tags?: string
}

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        router.push('/admin/blog')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      router.push('/admin/blog')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (publish?: boolean) => {
    if (!post || !post.title.trim() || !post.slug.trim() || !post.content) {
      alert('Please fill in title, slug, and content')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/blog/posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          published: publish !== undefined ? publish : post.published,
        }),
      })

      if (response.ok) {
        router.push('/admin/blog')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save post')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#22c55e] to-[#16a34a] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/20 rounded w-1/4"></div>
            <div className="h-64 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#22c55e] to-[#16a34a] p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white">Post not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22c55e] to-[#16a34a] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Edit Post</h1>
          <div className="space-x-4">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            {!post.published && (
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            )}
            {post.published && (
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                {saving ? 'Unpublishing...' : 'Unpublish'}
              </button>
            )}
            <button
              onClick={() => router.push('/admin/blog')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <label className="block text-white font-medium mb-2">Title</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost(prev => prev ? { ...prev, title: e.target.value } : null)}
              placeholder="Enter post title..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Slug */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <label className="block text-white font-medium mb-2">Slug (URL)</label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => setPost(prev => prev ? { ...prev, slug: e.target.value } : null)}
              placeholder="post-url-slug"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-sky-400"
            />
            <div className="text-white/60 text-sm mt-1">
              URL: {process.env.NEXT_PUBLIC_APP_URL || 'your-site.com'}/blog/{post.slug}
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <label className="block text-white font-medium mb-2">Excerpt (Optional)</label>
            <textarea
              value={post.excerpt || ''}
              onChange={(e) => setPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
              placeholder="Brief description of the post..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-sky-400 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <label className="block text-white font-medium mb-2">Tags</label>
            <input
              type="text"
              value={post.tags || ''}
              onChange={(e) => setPost(prev => prev ? { ...prev, tags: e.target.value } : null)}
              placeholder="AI, Permaculture, Automation (comma-separated)"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <label className="block text-white font-medium mb-2">Featured Image URL (Optional)</label>
            <input
              type="url"
              value={post.featuredImage || ''}
              onChange={(e) => setPost(prev => prev ? { ...prev, featuredImage: e.target.value } : null)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <label className="block text-white font-medium mb-4">Content</label>
            <TiptapEditor
              content={post.content}
              onChange={(content) => setPost(prev => prev ? { ...prev, content } : null)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
