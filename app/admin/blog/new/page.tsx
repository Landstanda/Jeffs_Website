"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TiptapEditor from '@/components/TiptapEditor'

export default function NewPost() {
  const router = useRouter()
  const [post, setPost] = useState({
    title: '',
    slug: '',
    content: null,
    excerpt: '',
    published: false,
    featuredImage: '',
    tags: '',
  })
  const [saving, setSaving] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' ? generateSlug(title) : prev.slug
    }))
  }

  const handleSave = async (publish = false) => {
    if (!post.title.trim() || !post.slug.trim() || !post.content) {
      alert('Please fill in title, slug, and content')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          published: publish,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#15803d] to-[#16a34a] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">New Post</h1>
          <div className="space-x-4">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
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
              onChange={(e) => handleTitleChange(e.target.value)}
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
              onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
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
              value={post.excerpt}
              onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
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
              value={post.tags}
              onChange={(e) => setPost(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="AI, Permaculture, Automation (comma-separated)"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <label className="block text-white font-medium mb-2">Featured Image URL (Optional)</label>
            <input
              type="url"
              value={post.featuredImage}
              onChange={(e) => setPost(prev => ({ ...prev, featuredImage: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <label className="block text-white font-medium mb-4">Content</label>
            <TiptapEditor
              content={post.content}
              onChange={(content) => setPost(prev => ({ ...prev, content }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
