"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  published: boolean
  featuredImage?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id))
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  const togglePublished = async (post: Post) => {
    try {
      const response = await fetch(`/api/blog/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      })
      
      if (response.ok) {
        setPosts(posts.map(p => 
          p.id === post.id ? { ...p, published: !p.published } : p
        ))
      } else {
        alert('Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#22c55e] to-[#16a34a] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/20 rounded w-1/4"></div>
            <div className="h-64 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22c55e] to-[#16a34a] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Blog Admin</h1>
          <div className="space-x-4">
            <Link 
              href="/admin/blog/new"
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              New Post
            </Link>
            <Link 
              href="/"
              className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="text-left p-4 text-white font-medium">Title</th>
                  <th className="text-left p-4 text-white font-medium">Status</th>
                  <th className="text-left p-4 text-white font-medium">Tags</th>
                  <th className="text-left p-4 text-white font-medium">Created</th>
                  <th className="text-left p-4 text-white font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/70">
                      No posts yet. Create your first post!
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="text-white font-medium">{post.title}</div>
                          <div className="text-white/60 text-sm">{post.slug}</div>
                          {post.excerpt && (
                            <div className="text-white/50 text-sm mt-1 line-clamp-2">{post.excerpt}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePublished(post)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.published 
                              ? 'bg-green-500 text-white' 
                              : 'bg-yellow-500 text-black'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="text-white/70 text-sm">
                          {post.tags || 'No tags'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white/70 text-sm">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/blog/edit/${post.id}`}
                            className="text-sky-400 hover:text-sky-300 text-sm"
                          >
                            Edit
                          </Link>
                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-white/70 hover:text-white text-sm"
                              target="_blank"
                            >
                              View
                            </Link>
                          )}
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
