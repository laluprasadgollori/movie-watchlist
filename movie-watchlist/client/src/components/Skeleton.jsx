export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading movies">
      {Array.from({ length: count }, (_, index) => <div className="overflow-hidden rounded-2xl border border-white/10 bg-cinema-panel" key={index}><SkeletonBlock className="aspect-[2/3]" /><div className="space-y-3 p-4"><SkeletonBlock className="h-5 w-3/4" /><SkeletonBlock className="h-4 w-1/2" /><SkeletonBlock className="h-4 w-2/3" /></div></div>)}
    </div>
  )
}

export function SkeletonPage() {
  return <main className="mx-auto min-h-screen max-w-7xl px-6 pb-16 pt-32"><SkeletonBlock className="h-4 w-24" /><SkeletonBlock className="mt-5 h-14 w-3/4 max-w-2xl" /><SkeletonBlock className="mt-4 h-5 w-80 max-w-full" /><SkeletonGrid /></main>
}
