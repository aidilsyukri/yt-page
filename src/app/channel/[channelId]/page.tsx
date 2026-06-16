import { notFound } from 'next/navigation';
import type { YouTubeChannel, YouTubeVideo, YouTubePlaylist } from '@/types/youtube';
import { formatCount } from '@/lib/youtube/format';
import ChannelTabs from '@/components/youtube/ChannelTabs';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ channelId: string }>;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export default async function ChannelPage({ params }: PageProps) {
  const { channelId } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const [channelData, videosData, playlistsData] = await Promise.all([
    fetchJson<{ channel: YouTubeChannel }>(`${baseUrl}/api/youtube/channel/${channelId}`),
    fetchJson<{ enrichedVideos?: YouTubeVideo[]; nextPageToken?: string }>(
      `${baseUrl}/api/youtube/channel/${channelId}/videos`
    ),
    fetchJson<{ items: YouTubePlaylist[]; nextPageToken?: string }>(
      `${baseUrl}/api/youtube/channel/${channelId}/playlists`
    ),
  ]);

  if (!channelData?.channel) notFound();

  const channel = channelData.channel;
  const avatar =
    channel.snippet.thumbnails.high?.url ??
    channel.snippet.thumbnails.medium?.url ??
    channel.snippet.thumbnails.default?.url ??
    '';
  const banner = channel.brandingSettings?.image?.bannerExternalUrl ?? '';
  const subs = channel.statistics?.subscriberCount
    ? formatCount(channel.statistics.subscriberCount)
    : '';
  const videos = channel.statistics?.videoCount
    ? formatCount(channel.statistics.videoCount)
    : '';
  const views = channel.statistics?.viewCount
    ? formatCount(channel.statistics.viewCount)
    : '';

  return (
    <div>
      {banner && (
        <div className="w-full h-48 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner} alt="Channel banner" className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-4">
        <div
          className="flex items-end gap-5 py-6 border-b"
          style={{ borderColor: '#2A2A2A' }}
        >
          <div
            className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0"
            style={{ backgroundColor: '#2A2A2A' }}
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={channel.snippet.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="#AAAAAA" className="w-14 h-14">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold" style={{ color: '#F1F1F1' }}>
              {channel.snippet.title}
            </h1>
            {channel.snippet.customUrl && (
              <p className="text-sm mt-0.5" style={{ color: '#3EA6FF' }}>
                {channel.snippet.customUrl}
              </p>
            )}
            <div className="flex flex-wrap gap-4 mt-2 text-sm" style={{ color: '#AAAAAA' }}>
              {subs && (
                <span>
                  <strong style={{ color: '#F1F1F1' }}>{subs}</strong> subscribers
                </span>
              )}
              {videos && (
                <span>
                  <strong style={{ color: '#F1F1F1' }}>{videos}</strong> videos
                </span>
              )}
              {views && (
                <span>
                  <strong style={{ color: '#F1F1F1' }}>{views}</strong> views
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="py-6">
          <ChannelTabs
            channel={channel}
            initialVideos={videosData?.enrichedVideos ?? []}
            videosNextPageToken={videosData?.nextPageToken}
            playlists={playlistsData?.items ?? []}
            playlistsNextPageToken={playlistsData?.nextPageToken}
          />
        </div>
      </div>
    </div>
  );
}
