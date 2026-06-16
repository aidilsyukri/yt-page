import Link from 'next/link';
import type { YouTubeChannel } from '@/types/youtube';
import { formatCount } from '@/lib/youtube/format';

interface ChannelCardProps {
  channel: YouTubeChannel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const avatar =
    channel.snippet.thumbnails.high?.url ??
    channel.snippet.thumbnails.medium?.url ??
    channel.snippet.thumbnails.default?.url ??
    '';
  const subs = channel.statistics?.subscriberCount
    ? formatCount(channel.statistics.subscriberCount)
    : '';
  const videos = channel.statistics?.videoCount
    ? formatCount(channel.statistics.videoCount)
    : '';

  return (
    <Link href={`/channel/${channel.id}`} className="group block h-full">
      <div
        className="h-full rounded-xl overflow-hidden p-5 flex flex-col items-center gap-3 text-center transition-all duration-200 group-hover:border-zinc-600"
        style={{
          backgroundColor: '#1A1A1A',
          border: '1px solid #2A2A2A',
        }}
      >
        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#2A2A2A' }}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={channel.snippet.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="#AAAAAA" className="w-10 h-10">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold line-clamp-1" style={{ color: '#F1F1F1' }}>
            {channel.snippet.title}
          </p>
          {channel.snippet.customUrl && (
            <p className="text-xs mt-0.5" style={{ color: '#3EA6FF' }}>
              {channel.snippet.customUrl}
            </p>
          )}
        </div>

        <div className="flex gap-3 text-xs" style={{ color: '#AAAAAA' }}>
          {subs && (
            <span>
              <strong style={{ color: '#F1F1F1' }}>{subs}</strong> subs
            </span>
          )}
          {videos && (
            <span>
              <strong style={{ color: '#F1F1F1' }}>{videos}</strong> videos
            </span>
          )}
        </div>

        <p className="text-xs mt-auto" style={{ color: '#AAAAAA', minHeight: '1.25rem' }}>
          {channel.snippet.description
            ? channel.snippet.description.length > 70
              ? channel.snippet.description.slice(0, 70).trimEnd() + '…..'
              : channel.snippet.description
            : ''}
        </p>
      </div>
    </Link>
  );
}
