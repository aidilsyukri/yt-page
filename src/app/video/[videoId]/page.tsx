import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { YouTubeVideo, YouTubeChannel, YouTubeCommentThread } from '@/types/youtube';
import { formatCount, formatAbsoluteDate, getBestThumbnail } from '@/lib/youtube/format';
import CommentsSection from '@/components/youtube/CommentsSection';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ videoId: string }>;
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

export default async function VideoPage({ params }: PageProps) {
  const { videoId } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const [videoData, commentsData] = await Promise.all([
    fetchJson<{ video: YouTubeVideo }>(`${baseUrl}/api/youtube/video/${videoId}`),
    fetchJson<{ items: YouTubeCommentThread[]; nextPageToken?: string }>(
      `${baseUrl}/api/youtube/video/${videoId}/comments`
    ),
  ]);

  if (!videoData?.video) notFound();

  const video = videoData.video;

  const channelData = await fetchJson<{ channel: YouTubeChannel }>(
    `${baseUrl}/api/youtube/channel/${video.snippet.channelId}`
  );
  const channel = channelData?.channel;

  const avatar =
    channel?.snippet.thumbnails.high?.url ??
    channel?.snippet.thumbnails.medium?.url ??
    channel?.snippet.thumbnails.default?.url ??
    '';
  const subs = channel?.statistics?.subscriberCount
    ? formatCount(channel.statistics.subscriberCount)
    : '';
  const views = video.statistics?.viewCount
    ? formatCount(video.statistics.viewCount)
    : '';
  const likes = video.statistics?.likeCount
    ? formatCount(video.statistics.likeCount)
    : '';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{ paddingTop: '56.25%', backgroundColor: '#000' }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={video.snippet.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="mt-4">
        <h1 className="text-xl font-bold leading-snug" style={{ color: '#F1F1F1' }}>
          {video.snippet.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
          <div className="flex items-center gap-3">
            {channel ? (
              <Link href={`/channel/${channel.id}`} className="flex items-center gap-2 group">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: '#2A2A2A' }}
                >
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt={channel.snippet.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="#AAAAAA" className="w-6 h-6">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold group-hover:underline" style={{ color: '#F1F1F1' }}>
                    {channel.snippet.title}
                  </p>
                  {subs && (
                    <p className="text-xs" style={{ color: '#AAAAAA' }}>
                      {subs} subscribers
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <p className="text-sm font-semibold" style={{ color: '#F1F1F1' }}>
                {video.snippet.channelTitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm" style={{ color: '#AAAAAA' }}>
            {views && (
              <span>
                <strong style={{ color: '#F1F1F1' }}>{views}</strong> views
              </span>
            )}
            {likes && (
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                {likes}
              </span>
            )}
            <span>{formatAbsoluteDate(video.snippet.publishedAt)}</span>
          </div>
        </div>

        <DescriptionBlock video={video} />
      </div>

      <div
        className="mt-8 pt-6"
        style={{ borderTop: '1px solid #2A2A2A' }}
      >
        <CommentsSection
          videoId={videoId}
          initialThreads={commentsData?.items ?? []}
          initialNextPageToken={commentsData?.nextPageToken}
        />
      </div>
    </div>
  );
}

function DescriptionBlock({ video }: { video: YouTubeVideo }) {
  const desc = video.snippet.description;
  const tags = video.snippet.tags ?? [];

  if (!desc && tags.length === 0) return null;

  return (
    <details
      className="mt-4 rounded-xl p-4 cursor-pointer"
      style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      <summary className="text-sm font-medium select-none" style={{ color: '#F1F1F1' }}>
        Description
      </summary>
      {desc && (
        <p
          className="mt-3 text-sm whitespace-pre-wrap leading-relaxed"
          style={{ color: '#AAAAAA' }}
        >
          {desc}
        </p>
      )}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.slice(0, 20).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs"
              style={{ backgroundColor: '#2A2A2A', color: '#3EA6FF' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </details>
  );
}
