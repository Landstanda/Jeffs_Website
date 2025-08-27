import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import React from 'react'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function validateAndRedirect(formData: FormData) {
  'use server'
  const inputPassword = String(formData.get('password') || '')
  const adminPassword = process.env.ADMIN_PASSWORD || ''
  const wpAdminUrl = (process.env.WORDPRESS_ADMIN_URL || process.env.WORDPRESS_SITE_URL || '').replace(/\/$/, '')

  if (!wpAdminUrl || wpAdminUrl === 'https://your-wp-site.com') {
    redirect('/admin?error=config')
  }

  if (!adminPassword || adminPassword === 'your-strong-password') {
    redirect('/admin?error=password_not_set')
  }

  if (inputPassword === adminPassword) {
    cookies().set('admin_auth', '1', { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
    redirect(`${wpAdminUrl}/wp-admin`)
  }

  // If password incorrect, reload with an error
  redirect('/admin?error=wrong_password')
}

export default async function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const errorType = searchParams?.error
  const wpAdminUrl = (process.env.WORDPRESS_ADMIN_URL || process.env.WORDPRESS_SITE_URL || '')

  const getErrorMessage = () => {
    switch (errorType) {
      case 'config':
        return 'WordPress URL is not configured. Please set WORDPRESS_ADMIN_URL or WORDPRESS_SITE_URL in your .env.local file.'
      case 'password_not_set':
        return 'Admin password is not set. Please set ADMIN_PASSWORD in your .env.local file.'
      case 'wrong_password':
        return 'Incorrect password. Try again.'
      default:
        return null
    }
  }

  const errorMessage = getErrorMessage()
  const isConfigured = wpAdminUrl && wpAdminUrl !== 'https://your-wp-site.com'

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white mb-4">Login</h1>
        
        {!isConfigured && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <h3 className="text-yellow-300 font-medium mb-2">Configuration Required</h3>
            <p className="text-yellow-200 text-sm">
              Please update your <code className="bg-black/30 px-1 rounded">.env.local</code> file with your WordPress site URL and admin password.
            </p>
          </div>
        )}

        <form action={validateAndRedirect} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-sky-400"
              placeholder="Enter admin password"
              required
              disabled={!isConfigured}
            />
          </div>
          
          {errorMessage && (
            <p className="text-red-300 text-sm">{errorMessage}</p>
          )}
          
          <button
            type="submit"
            disabled={!isConfigured}
            className="w-full bg-sky-500/20 text-sky-300 rounded-lg py-2 font-medium hover:bg-sky-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
        
        <p className="text-white/50 text-xs mt-4">
          {isConfigured 
            ? 'You will be redirected to WordPress wp-admin after login.' 
            : 'Configure your environment variables to enable login.'
          }
        </p>
      </div>
    </main>
  )
}


