export default function Media() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-8">
      <h1 className="text-3xl font-semibold">Media</h1>
      <p className="text-white/70">Lightweight gallery. Add embeds or local clips later.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="aspect-video bg-white/5 ring-1 ring-white/10 rounded grid place-items-center text-white/60">Placeholder video</div>
        <div className="aspect-video bg-white/5 ring-1 ring-white/10 rounded grid place-items-center text-white/60">Placeholder video</div>
      </div>
    </main>
  )
}


