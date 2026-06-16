// ─── User Types ───────────────────────────────────────────────────────────────

export interface FacebookUser {
  id: string;
  name: string;
  picture?: {
    data: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface SessionUser {
  id: string;
  name: string;
  pictureUrl?: string;
  accessToken: string;
}

// ─── Page Types ───────────────────────────────────────────────────────────────

export interface FacebookPage {
  id: string;
  name: string;
  category?: string;
  category_list?: Array<{ id: string; name: string }>;
  fan_count?: number;
  followers_count?: number;
  about?: string;
  description?: string;
  website?: string;
  picture?: {
    data: {
      url: string;
    };
  };
  cover?: {
    source: string;
  };
  posts?: {
    data: FacebookPost[];
    paging?: {
      cursors: { before: string; after: string };
      next?: string;
    };
  };
}

export interface PageSearchResult {
  id: string;
  name: string;
  category: string;
  fanCount: number;
  pictureUrl: string;
}

export interface PageOverview {
  id: string;
  name: string;
  category: string;
  fanCount: number;
  about: string;
  website: string;
  pictureUrl: string;
  coverUrl: string;
  metrics: PageMetrics;
}

export interface PageMetrics {
  fanCount: number;
  totalPosts: number;
  avgReactions: number;
  avgShares: number;
  avgComments: number;
  engagementRate: number;
}

// ─── Post Types ───────────────────────────────────────────────────────────────

export interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  type?: string;
  full_picture?: string;
  shares?: {
    count: number;
  };
  reactions?: {
    summary: {
      total_count: number;
      viewer_reaction: string;
    };
    data?: ReactionData[];
  };
  comments?: {
    summary: {
      total_count: number;
      can_comment: boolean;
    };
  };
  likes?: {
    summary: {
      total_count: number;
    };
  };
}

export interface ReactionData {
  id: string;
  name: string;
  type: ReactionType;
}

export type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

export interface Post {
  id: string;
  message: string;
  createdTime: string;
  type: string;
  thumbnailUrl: string | null;
  reactions: number;
  shares: number;
  comments: number;
  viralityScore: number;
  engagementBarPercent: number;
}

export type SortOption = 'virality' | 'reactions' | 'shares' | 'comments' | 'newest';
export type FilterOption = 'all' | 'photo' | 'video' | 'link' | 'status';

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FacebookApiError {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

// ─── Cache Types ──────────────────────────────────────────────────────────────

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
