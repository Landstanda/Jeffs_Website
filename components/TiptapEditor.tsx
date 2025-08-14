"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { useCallback, useRef } from 'react'

interface TiptapEditorProps {
  content?: any
  onChange?: (content: any) => void
  editable?: boolean
}

export default function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-lg shadow-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-400 underline hover:text-sky-300',
        },
      }),
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200 text-black px-1 rounded',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON())
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] p-4 focus:outline-none bg-white/5 rounded-lg border border-white/10',
      },
    },
  })

  const addImage = useCallback(async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file || !editor) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', '')

    try {
      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        editor.chain().focus().setImage({ src: url }).run()
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return <div className="animate-pulse bg-white/5 rounded-lg h-[400px]" />
  }

  if (!editable) {
    return <EditorContent editor={editor} />
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-white/20 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 ${
              editor.isActive('bold') ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 italic ${
              editor.isActive('italic') ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 line-through ${
              editor.isActive('strike') ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            S
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-white/20 pr-2">
          {[1, 2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
              className={`px-2 py-1 text-sm rounded hover:bg-white/10 ${
                editor.isActive('heading', { level }) ? 'bg-sky-500 text-white' : 'text-white/70'
              }`}
            >
              H{level}
            </button>
          ))}
        </div>

        {/* Lists & Quotes */}
        <div className="flex gap-1 border-r border-white/20 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 ${
              editor.isActive('bulletList') ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 ${
              editor.isActive('orderedList') ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            1.
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 ${
              editor.isActive('blockquote') ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            "
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-white/20 pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            ←
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            ↔
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            →
          </button>
        </div>

        {/* Media & Links */}
        <div className="flex gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 text-sm rounded hover:bg-white/10 text-white/70"
          >
            📷
          </button>
          <button
            onClick={setLink}
            className={`px-2 py-1 text-sm rounded hover:bg-white/10 ${
              editor.isActive('link') ? 'bg-sky-500 text-white' : 'text-white/70'
            }`}
          >
            🔗
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={addImage}
        className="hidden"
      />

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
