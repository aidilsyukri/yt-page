export interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface YouTubeThumbnails {
  default?: YouTubeThumbnail;
  medium?: YouTubeThumbnail;
  high?: YouTubeThumbnail;
  standard?: YouTubeThumbnail;
  maxres?: YouTubeThumbnail;
}

export interface YouTubeVideo {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    channelTitle: string;
    tags?: string[];
    categoryId?: string;
    liveBroadcastContent?: string;
    defaultLanguage?: string;
    localized?: {
      title: string;
      description: string;
    };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    dislikeCount?: string;
    favoriteCount?: string;
    commentCount?: string;
  };
  contentDetails?: {
    duration: string;
    dimension?: string;
    definition?: string;
    caption?: string;
    licensedContent?: boolean;
    regionRestriction?: {
      allowed?: string[];
      blocked?: string[];
    };
  };
}

export interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    thumbnails: YouTubeThumbnails;
    defaultLanguage?: string;
    localized?: {
      title: string;
      description: string;
    };
    country?: string;
  };
  statistics?: {
    viewCount?: string;
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
    videoCount?: string;
  };
  brandingSettings?: {
    channel?: {
      title?: string;
      description?: string;
      keywords?: string;
      country?: string;
    };
    image?: {
      bannerExternalUrl?: string;
    };
  };
  contentDetails?: {
    relatedPlaylists?: {
      likes?: string;
      uploads?: string;
    };
  };
}

export interface YouTubePlaylist {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    channelTitle: string;
    localized?: {
      title: string;
      description: string;
    };
  };
  contentDetails?: {
    itemCount?: number;
  };
}

export interface YouTubePlaylistItem {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails?: {
    videoId: string;
    videoPublishedAt?: string;
  };
}

export interface YouTubeComment {
  id: string;
  snippet: {
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl?: string;
    authorChannelId?: {
      value: string;
    };
    textDisplay: string;
    textOriginal?: string;
    likeCount: number;
    publishedAt: string;
    updatedAt: string;
    parentId?: string;
  };
}

export interface YouTubeCommentThread {
  id: string;
  snippet: {
    channelId?: string;
    videoId: string;
    topLevelComment: YouTubeComment;
    canReply: boolean;
    totalReplyCount: number;
    isPublic: boolean;
  };
  replies?: {
    comments: YouTubeComment[];
  };
}

export interface YouTubeSearchResult {
  id:
    | string
    | {
        kind: string;
        videoId?: string;
        channelId?: string;
        playlistId?: string;
      };
  kind: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    channelTitle: string;
    liveBroadcastContent?: string;
  };
  videoDetails?: YouTubeVideo;
  channelDetails?: YouTubeChannel;
  playlistDetails?: YouTubePlaylist;
}

export interface YouTubeCategory {
  id: string;
  snippet: {
    title: string;
    assignable: boolean;
    channelId: string;
  };
}

export interface YouTubeRegion {
  id: string;
  snippet: {
    gl: string;
    name: string;
  };
}

export interface SearchResponse {
  items: YouTubeSearchResult[];
  nextPageToken?: string;
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface VideoDetailResponse {
  video: YouTubeVideo;
  channel?: YouTubeChannel;
}

export interface ChannelDetailResponse {
  channel: YouTubeChannel;
  videos: YouTubePlaylistItem[];
  videosNextPageToken?: string;
  playlists: YouTubePlaylist[];
  playlistsNextPageToken?: string;
  enrichedVideos?: YouTubeVideo[];
}
