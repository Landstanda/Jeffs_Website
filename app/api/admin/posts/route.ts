import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

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
  updatedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const post: BlogPost = await request.json()
    
    // Add metadata
    const now = new Date().toISOString()
    const fullPost: BlogPost = {
      ...post,
      createdAt: now,
      updatedAt: now
    }

    // Ensure content directory exists
    const contentDir = join(process.cwd(), 'content', 'blog')
    await mkdir(contentDir, { recursive: true })

    // Create post file
    const postFile = join(contentDir, `${post.slug}.json`)
    await writeFile(postFile, JSON.stringify(fullPost, null, 2))

    // Create markdown content file
    const contentFile = join(contentDir, `${post.slug}.md`)
    await writeFile(contentFile, post.content)

    return NextResponse.json({ 
      success: true, 
      message: 'Post created successfully',
      slug: post.slug 
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create post' },
      { status: 500 }
    )
  }
}
