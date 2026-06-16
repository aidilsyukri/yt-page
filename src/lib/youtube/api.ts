import type {
  YouTubeVideo,
  YouTubeChannel,
  YouTubePlaylist,
  YouTubePlaylistItem,
  YouTubeComment,
  YouTubeCommentThread,
  YouTubeSearchResult,
  YouTubeCategory,
  YouTubeRegion,
  SearchResponse,
} from '@/types/youtube';

const BASE = 'https://www.googleapis.com/youtube/v3';

function key(): string {
  return process.env.YOUTUBE_API_KEY ?? '';
}

interface RawSearchItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeSearchResult['snippet']['thumbnails'];
    channelTitle: string;
    liveBroadcastContent?: string;
  };
}

export interface SearchParams {
  q?: string;
  type?: string;
  category?: string;
  region?: string;
  order?: string;
  pageToken?: string;
}

export async function searchYouTube(params: SearchParams): Promise<SearchResponse> {
  const apiKey = key();
  const sp = new URLSearchParams({
    part: 'snippet',
    maxResults: '30',
    key: apiKey,
  });
  if (params.q) sp.set('q', params.q);
  if (params.type && params.type !== 'all') sp.set('type', params.type);
  else sp.set('type', 'video,channel,playlist');
  if (params.category) sp.set('videoCategoryId', params.category);
  if (params.region) sp.set('regionCode', params.region);
  if (params.order && params.order !== 'relevance') sp.set('order', params.order);
  if (params.pageToken) sp.set('pageToken', params.pageToken);

  const res = await fetch(`${BASE}/search?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message ?? 'YouTube search failed');
  }

  const rawItems: RawSearchItem[] = data.items ?? [];

  const videoIds = rawItems
    .filter((i) => i.id.kind === 'youtube#video')
    .map((i) => i.id.videoId!)
    .filter(Boolean);
  const channelIds = rawItems
    .filter((i) => i.id.kind === 'youtube#channel')
    .map((i) => i.id.channelId!)
    .filter(Boolean);
  const playlistIds = rawItems
    .filter((i) => i.id.kind === 'youtube#playlist')
    .map((i) => i.id.playlistId!)
    .filter(Boolean);

  const [videosMap, channelsMap, playlistsMap] = await Promise.all([
    videoIds.length ? fetchVideosMap(videoIds) : Promise.resolve(new Map<string, YouTubeVideo>()),
    channelIds.length
      ? fetchChannelsMap(channelIds)
      : Promise.resolve(new Map<string, YouTubeChannel>()),
    playlistIds.length
      ? fetchPlaylistsMap(playlistIds)
      : Promise.resolve(new Map<string, YouTubePlaylist>()),
  ]);

  const items: YouTubeSearchResult[] = rawItems.map((raw) => {
    const result: YouTubeSearchResult = {
      id: raw.id,
      kind: raw.kind,
      snippet: raw.snippet,
    };
    if (raw.id.videoId && videosMap.has(raw.id.videoId)) {
      result.videoDetails = videosMap.get(raw.id.videoId);
    }
    if (raw.id.channelId && channelsMap.has(raw.id.channelId)) {
      result.channelDetails = channelsMap.get(raw.id.channelId);
    }
    if (raw.id.playlistId && playlistsMap.has(raw.id.playlistId)) {
      result.playlistDetails = playlistsMap.get(raw.id.playlistId);
    }
    return result;
  });

  return {
    items,
    nextPageToken: data.nextPageToken,
    pageInfo: data.pageInfo,
  };
}

async function fetchVideosMap(ids: string[]): Promise<Map<string, YouTubeVideo>> {
  const sp = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: ids.join(','),
    key: key(),
  });
  const res = await fetch(`${BASE}/videos?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  const map = new Map<string, YouTubeVideo>();
  for (const item of data.items ?? []) {
    map.set(item.id, item as YouTubeVideo);
  }
  return map;
}

async function fetchChannelsMap(ids: string[]): Promise<Map<string, YouTubeChannel>> {
  const sp = new URLSearchParams({
    part: 'snippet,statistics,brandingSettings,contentDetails',
    id: ids.join(','),
    key: key(),
  });
  const res = await fetch(`${BASE}/channels?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  const map = new Map<string, YouTubeChannel>();
  for (const item of data.items ?? []) {
    map.set(item.id, item as YouTubeChannel);
  }
  return map;
}

async function fetchPlaylistsMap(ids: string[]): Promise<Map<string, YouTubePlaylist>> {
  const sp = new URLSearchParams({
    part: 'snippet,contentDetails',
    id: ids.join(','),
    key: key(),
  });
  const res = await fetch(`${BASE}/playlists?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  const map = new Map<string, YouTubePlaylist>();
  for (const item of data.items ?? []) {
    map.set(item.id, item as YouTubePlaylist);
  }
  return map;
}

export async function getVideoDetail(id: string): Promise<YouTubeVideo> {
  const sp = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id,
    key: key(),
  });
  const res = await fetch(`${BASE}/videos?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to fetch video');
  const video = data.items?.[0];
  if (!video) throw new Error('Video not found');
  return video as YouTubeVideo;
}

export interface CommentsResponse {
  items: YouTubeCommentThread[];
  nextPageToken?: string;
}

export async function getVideoComments(
  videoId: string,
  pageToken?: string
): Promise<CommentsResponse> {
  const sp = new URLSearchParams({
    part: 'snippet,replies',
    videoId,
    maxResults: '30',
    key: key(),
  });
  if (pageToken) sp.set('pageToken', pageToken);
  const res = await fetch(`${BASE}/commentThreads?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to fetch comments');
  return {
    items: (data.items ?? []) as YouTubeCommentThread[],
    nextPageToken: data.nextPageToken,
  };
}

export interface RepliesResponse {
  items: YouTubeComment[];
  nextPageToken?: string;
}

export async function getCommentReplies(parentId: string): Promise<RepliesResponse> {
  const sp = new URLSearchParams({
    part: 'snippet',
    parentId,
    maxResults: '30',
    key: key(),
  });
  const res = await fetch(`${BASE}/comments?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to fetch replies');
  return {
    items: (data.items ?? []) as YouTubeComment[],
    nextPageToken: data.nextPageToken,
  };
}

export async function getChannelDetail(id: string): Promise<YouTubeChannel> {
  const sp = new URLSearchParams({
    part: 'snippet,statistics,brandingSettings,contentDetails',
    id,
    key: key(),
  });
  const res = await fetch(`${BASE}/channels?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to fetch channel');
  const channel = data.items?.[0];
  if (!channel) throw new Error('Channel not found');
  return channel as YouTubeChannel;
}

export interface PlaylistItemsResponse {
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
  enrichedVideos?: YouTubeVideo[];
}

export async function getChannelVideos(
  uploadsPlaylistId: string,
  pageToken?: string
): Promise<PlaylistItemsResponse> {
  const sp = new URLSearchParams({
    part: 'snippet,contentDetails',
    playlistId: uploadsPlaylistId,
    maxResults: '30',
    key: key(),
  });
  if (pageToken) sp.set('pageToken', pageToken);
  const res = await fetch(`${BASE}/playlistItems?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to fetch channel videos');

  const items: YouTubePlaylistItem[] = data.items ?? [];
  const videoIds = items
    .map((i) => i.contentDetails?.videoId ?? i.snippet.resourceId.videoId)
    .filter(Boolean);

  let enrichedVideos: YouTubeVideo[] = [];
  if (videoIds.length) {
    const videosMap = await fetchVideosMap(videoIds);
    enrichedVideos = videoIds.map((vid) => videosMap.get(vid)!).filter(Boolean);
  }

  return {
    items,
    nextPageToken: data.nextPageToken,
    enrichedVideos,
  };
}

export interface PlaylistsResponse {
  items: YouTubePlaylist[];
  nextPageToken?: string;
}

export async function getChannelPlaylists(channelId: string): Promise<PlaylistsResponse> {
  const sp = new URLSearchParams({
    part: 'snippet,contentDetails',
    channelId,
    maxResults: '30',
    key: key(),
  });
  const res = await fetch(`${BASE}/playlists?${sp.toString()}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to fetch playlists');
  return {
    items: (data.items ?? []) as YouTubePlaylist[],
    nextPageToken: data.nextPageToken,
  };
}

export async function getVideoCategories(): Promise<YouTubeCategory[]> {
  const sp = new URLSearchParams({
    part: 'snippet',
    regionCode: 'US',
    key: key(),
  });
  const res = await fetch(`${BASE}/videoCategories?${sp.toString()}`, {
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to fetch categories');
  return (data.items ?? []) as YouTubeCategory[];
}

export async function getRegions(): Promise<YouTubeRegion[]> {
  const sp = new URLSearchParams({
    part: 'snippet',
    key: key(),
  });
  const res = await fetch(`${BASE}/i18nRegions?${sp.toString()}`, {
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to fetch regions');
  return (data.items ?? []) as YouTubeRegion[];
}
