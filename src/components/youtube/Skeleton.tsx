export function VideoCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden animate-pulse"
      style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      <div className="w-full aspect-video" style={{ backgroundColor: '#2A2A2A' }} />
      <div className="p-3 space-y-2">
        <div className="h-4 rounded" style={{ backgroundColor: '#2A2A2A', width: '90%' }} />
        <div className="h-4 rounded" style={{ backgroundColor: '#2A2A2A', width: '70%' }} />
        <div className="h-3 rounded" style={{ backgroundColor: '#2A2A2A', width: '50%' }} />
        <div className="h-3 rounded" style={{ backgroundColor: '#2A2A2A', width: '40%' }} />
      </div>
    </div>
  );
}

export function ChannelCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden animate-pulse p-5 flex flex-col items-center gap-3"
      style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      <div className="w-20 h-20 rounded-full" style={{ backgroundColor: '#2A2A2A' }} />
      <div className="h-4 rounded w-32" style={{ backgroundColor: '#2A2A2A' }} />
      <div className="h-3 rounded w-24" style={{ backgroundColor: '#2A2A2A' }} />
      <div className="h-3 rounded w-full" style={{ backgroundColor: '#2A2A2A' }} />
      <div className="h-3 rounded w-4/5" style={{ backgroundColor: '#2A2A2A' }} />
    </div>
  );
}

export function ResultsGridSkeleton({ type = 'video' }: { type?: 'video' | 'channel' }) {
  const count = 12;
  return (
    <div
      className={
        type === 'channel'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      }
    >
      {Array.from({ length: count }).map((_, i) =>
        type === 'channel' ? (
          <ChannelCardSkeleton key={i} />
        ) : (
          <VideoCardSkeleton key={i} />
        )
      )}
    </div>
  );
}
