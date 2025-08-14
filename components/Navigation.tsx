import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="fixed top-0 right-0 z-50 p-6">
      <div className="flex gap-4">
        <Link 
          href="/"
          className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
        >
          Home
        </Link>
        <Link 
          href="/blog"
          className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
        >
          Blog
        </Link>
        <Link 
          href="/admin/blog"
          className="bg-sky-500/20 backdrop-blur-sm text-sky-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-500/30 transition-colors"
        >
          Admin
        </Link>
      </div>
    </nav>
  )
}
