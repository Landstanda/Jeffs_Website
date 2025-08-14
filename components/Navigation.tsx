"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home */}
          <Link 
            href="/" 
            className="text-xl font-bold text-white hover:text-sky-200 transition-colors"
          >
            Edgewise
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/blog"
              className={`text-sm font-medium transition-colors ${
                isActive('/blog') 
                  ? 'text-sky-300' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Blog
            </Link>
            <Link 
              href="/projects"
              className={`text-sm font-medium transition-colors ${
                isActive('/projects') 
                  ? 'text-sky-300' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Projects
            </Link>
            <Link 
              href="/media"
              className={`text-sm font-medium transition-colors ${
                isActive('/media') 
                  ? 'text-sky-300' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Media
            </Link>
          </div>
          
          {/* Admin Panel Link */}
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="text-sm px-3 py-2 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white rounded transition-colors border border-white/20"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
