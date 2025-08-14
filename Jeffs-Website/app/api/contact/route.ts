import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const data = await req.json().catch(() => null) as { name?: string; email?: string; message?: string }
  if (!data || !data.message) {
    return NextResponse.json({ ok: false, error: 'Invalid' }, { status: 400 })
  }
  // For now, just log. Later wire to Resend/SMTP.
  console.log('CONTACT_SUBMISSION', data)
  return NextResponse.json({ ok: true })
}


