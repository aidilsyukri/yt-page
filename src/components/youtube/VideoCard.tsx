'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { YouTubeVideo } from '@/types/youtube';
import { formatCount, formatRelativeDate, parseDuration, getBestThumbnail } from '@/lib/youtube/format';

interface VideoCardProps {
  video: YouTubeVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();
  const thumb = getBestThumbnail(video.snippet.thumbnails);
  const duration = video.contentDetails?.duration ? parseDuration(video.contentDetails.duration) : '';
  const views = video.statistics?.viewCount ? formatCount(video.statistics.viewCount) : '';
  const published = formatRelativeDate(video.snippet.publishedAt);

  return (
    <div
      className="group rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
      style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
      onClick={() => router.push(`/video/${video.id}`)}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-800">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={video.snippet.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#2A2A2A' }}>
            <svg viewBox="0 0 24 24" fill="#AAAAAA" className="w-12 h-12">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        {duration && (
          <span
            className="absolute bottom-2 right-2 text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)', color: '#F1F1F1' }}
          >
            {duration}
          </span>
        )}
      </div>
      <div className="p-3">
        <p
          className="text-sm font-medium leading-snug line-clamp-2 mb-1 group-hover:text-white transition-colors"
          style={{ color: '#F1F1F1' }}
        >
          {video.snippet.title}
        </p>
        <Link
          href={`/channel/${video.snippet.channelId}`}
          className="text-xs hover:underline block mb-1"
          style={{ color: '#AAAAAA' }}
          onClick={(e) => e.stopPropagation()}
        >
          {video.snippet.channelTitle}
        </Link>
        <p className="text-xs" style={{ color: '#AAAAAA' }}>
          {views && `${views} views`}
          {views && published && ' • '}
          {published}
        </p>
      </div>
    </div>
  );
}
