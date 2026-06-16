'use client';

import { useState } from 'react';
import type { YouTubeVideo, YouTubePlaylist, YouTubeChannel } from '@/types/youtube';
import VideoCard from './VideoCard';
import PlaylistCard from './PlaylistCard';
import Pagination from './Pagination';
import { formatCount, formatAbsoluteDate } from '@/lib/youtube/format';

interface ChannelTabsProps {
  channel: YouTubeChannel;
  initialVideos: YouTubeVideo[];
  videosNextPageToken?: string;
  playlists: YouTubePlaylist[];
  playlistsNextPageToken?: string;
}

const PAGE_SIZE = 10;
type Tab = 'videos' | 'playlists' | 'about';

export default function ChannelTabs({
  channel,
  initialVideos,
  videosNextPageToken,
  playlists: initialPlaylists,
  playlistsNextPageToken,
}: ChannelTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('videos');
  const [videos, setVideos] = useState<YouTubeVideo[]>(initialVideos);
  const [nextVideoToken, setNextVideoToken] = useState<string | undefined>(videosNextPageToken);
  const [loadingMoreVideos, setLoadingMoreVideos] = useState(false);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>(initialPlaylists);
  const [nextPlaylistToken, setNextPlaylistToken] = useState<string | undefined>(playlistsNextPageToken);
  const [loadingMorePlaylists, setLoadingMorePlaylists] = useState(false);
  const [videoPage, setVideoPage] = useState(1);
  const [playlistPage, setPlaylistPage] = useState(1);

  const videoPages = Math.ceil(videos.length / PAGE_SIZE);
  const playlistPages = Math.ceil(playlists.length / PAGE_SIZE);
  const pageVideos = videos.slice((videoPage - 1) * PAGE_SIZE, videoPage * PAGE_SIZE);
  const pagePlaylists = playlists.slice((playlistPage - 1) * PAGE_SIZE, playlistPage * PAGE_SIZE);

  async function loadMoreVideos() {
    if (!nextVideoToken) return;
    setLoadingMoreVideos(true);
    try {
      const res = await fetch(
        `/api/youtube/channel/${channel.id}/videos?pageToken=${nextVideoToken}`
      );
      const data = await res.json();
      if (res.ok) {
        const newVideos: YouTubeVideo[] = data.enrichedVideos ?? [];
        setVideos((prev) => [...prev, ...newVideos]);
        setNextVideoToken(data.nextPageToken);
      }
    } finally {
      setLoadingMoreVideos(false);
    }
  }

  async function loadMorePlaylists() {
    if (!nextPlaylistToken) return;
    setLoadingMorePlaylists(true);
    try {
      const res = await fetch(
        `/api/youtube/channel/${channel.id}/playlists?pageToken=${nextPlaylistToken}`
      );
      const data = await res.json();
      if (res.ok) {
        setPlaylists((prev) => [...prev, ...(data.items ?? [])]);
        setNextPlaylistToken(data.nextPageToken);
      }
    } finally {
      setLoadingMorePlaylists(false);
    }
  }

  const tabs: { value: Tab; label: string }[] = [
    { value: 'videos', label: 'Videos' },
    { value: 'playlists', label: 'Playlists' },
    { value: 'about', label: 'About' },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: '#2A2A2A' }}>
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className="px-4 py-2.5 text-sm font-medium transition-colors relative"
            style={{
              color: activeTab === t.value ? '#F1F1F1' : '#AAAAAA',
              borderBottom: activeTab === t.value ? '2px solid #F1F1F1' : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'videos' && (
        <>
          {videos.length === 0 ? (
            <p className="text-center py-12" style={{ color: '#AAAAAA' }}>
              No videos available
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pageVideos.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
              <Pagination total={videoPages} currentPage={videoPage} onPageChange={setVideoPage} />
              {videoPage === videoPages && nextVideoToken && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={loadMoreVideos}
                    disabled={loadingMoreVideos}
                    className="px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                    style={{
                      backgroundColor: '#272727',
                      color: '#F1F1F1',
                      border: '1px solid #2A2A2A',
                    }}
                  >
                    {loadingMoreVideos ? 'Loading…' : 'Load more videos'}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'playlists' && (
        <>
          {playlists.length === 0 ? (
            <p className="text-center py-12" style={{ color: '#AAAAAA' }}>
              No playlists available
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pagePlaylists.map((p) => (
                  <PlaylistCard key={p.id} playlist={p} />
                ))}
              </div>
              <Pagination
                total={playlistPages}
                currentPage={playlistPage}
                onPageChange={setPlaylistPage}
              />
              {playlistPage === playlistPages && nextPlaylistToken && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={loadMorePlaylists}
                    disabled={loadingMorePlaylists}
                    className="px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                    style={{
                      backgroundColor: '#272727',
                      color: '#F1F1F1',
                      border: '1px solid #2A2A2A',
                    }}
                  >
                    {loadingMorePlaylists ? 'Loading…' : 'Load more playlists'}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'about' && (
        <div className="max-w-2xl space-y-6">
          {channel.snippet.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#F1F1F1' }}>
                Description
              </h3>
              <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: '#AAAAAA' }}>
                {channel.snippet.description}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#F1F1F1' }}>
              Stats
            </h3>
            <table className="text-sm w-full">
              <tbody>
                {channel.statistics?.subscriberCount && (
                  <tr>
                    <td className="py-1 pr-4 font-medium" style={{ color: '#AAAAAA' }}>
                      Subscribers
                    </td>
                    <td style={{ color: '#F1F1F1' }}>
                      {formatCount(channel.statistics.subscriberCount)}
                    </td>
                  </tr>
                )}
                {channel.statistics?.videoCount && (
                  <tr>
                    <td className="py-1 pr-4 font-medium" style={{ color: '#AAAAAA' }}>
                      Videos
                    </td>
                    <td style={{ color: '#F1F1F1' }}>
                      {formatCount(channel.statistics.videoCount)}
                    </td>
                  </tr>
                )}
                {channel.statistics?.viewCount && (
                  <tr>
                    <td className="py-1 pr-4 font-medium" style={{ color: '#AAAAAA' }}>
                      Total Views
                    </td>
                    <td style={{ color: '#F1F1F1' }}>
                      {formatCount(channel.statistics.viewCount)}
                    </td>
                  </tr>
                )}
                {channel.snippet.publishedAt && (
                  <tr>
                    <td className="py-1 pr-4 font-medium" style={{ color: '#AAAAAA' }}>
                      Joined
                    </td>
                    <td style={{ color: '#F1F1F1' }}>
                      {formatAbsoluteDate(channel.snippet.publishedAt)}
                    </td>
                  </tr>
                )}
                {channel.snippet.country && (
                  <tr>
                    <td className="py-1 pr-4 font-medium" style={{ color: '#AAAAAA' }}>
                      Country
                    </td>
                    <td style={{ color: '#F1F1F1' }}>{channel.snippet.country}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
