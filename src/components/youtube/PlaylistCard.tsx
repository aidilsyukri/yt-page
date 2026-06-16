import type { YouTubePlaylist } from '@/types/youtube';
import { getBestThumbnail } from '@/lib/youtube/format';

interface PlaylistCardProps {
  playlist: YouTubePlaylist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const thumb = getBestThumbnail(playlist.snippet.thumbnails);
  const itemCount = playlist.contentDetails?.itemCount ?? 0;
  const ytUrl = `https://www.youtube.com/playlist?list=${playlist.id}`;

  return (
    <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="group block">
      <div
        className="rounded-xl overflow-hidden transition-all duration-200 group-hover:border-zinc-600"
        style={{
          backgroundColor: '#1A1A1A',
          border: '1px solid #2A2A2A',
        }}
      >
        <div className="relative w-full aspect-video overflow-hidden bg-zinc-800">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={playlist.snippet.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#2A2A2A' }}>
              <svg viewBox="0 0 24 24" fill="#AAAAAA" className="w-12 h-12">
                <path d="M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-8 7.5v-5l4 2.5-4 2.5z" />
              </svg>
            </div>
          )}
          {itemCount > 0 && (
            <div
              className="absolute bottom-0 right-0 text-xs font-semibold px-3 py-2 flex flex-col items-center justify-center min-w-[60px]"
              style={{ backgroundColor: 'rgba(0,0,0,0.85)', color: '#F1F1F1' }}
            >
              <span className="text-base font-bold">{itemCount}</span>
              <span>videos</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p
            className="text-sm font-medium leading-snug line-clamp-2 mb-1"
            style={{ color: '#F1F1F1' }}
          >
            {playlist.snippet.title}
          </p>
          <p className="text-xs" style={{ color: '#AAAAAA' }}>
            {playlist.snippet.channelTitle}
          </p>
          <p className="text-xs mt-1" style={{ color: '#3EA6FF' }}>
            View playlist on YouTube ↗
          </p>
        </div>
      </div>
    </a>
  );
}
