import { FACEBOOK_BASE_URL } from './types';
import { FacebookPage, FacebookPost, PageSearchResult, PageOverview, Post, PageMetrics } from '@/types';
import { getCache, setCache } from '@/lib/cache/memory-cache';

// ─── Token Helpers ─────────────────────────────────────────────────────────────

export function getAppAccessToken(): string {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appId || !appSecret) throw new Error('Facebook App ID and Secret are not configured');
  return `${appId}|${appSecret}`;
}

// ─── Core API Fetcher ──────────────────────────────────────────────────────────

async function fbFetch<T>(endpoint: string, token: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${FACEBOOK_BASE_URL}/${endpoint.replace(/^\//, '')}`);
  url.searchParams.set('access_token', token);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 0 }, // No Next.js cache — we handle caching ourselves
  });

  const json = await res.json();

  if (!res.ok || json.error) {
    const msg = json.error?.message ?? `Facebook API error ${res.status}`;
    throw new Error(msg);
  }

  return json as T;
}

// ─── Page Search ──────────────────────────────────────────────────────────────

export async function searchPages(query: string, token: string): Promise<PageSearchResult[]> {
  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = getCache<PageSearchResult[]>(cacheKey);
  if (cached) return cached;

  const data = await fbFetch<{ data: FacebookPage[] }>('search', token, {
    q: query,
    type: 'page',
    fields: 'id,name,category,category_list,fan_count,picture',
    limit: '12',
  });

  const results: PageSearchResult[] = (data.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category ?? p.category_list?.[0]?.name ?? 'Page',
    fanCount: p.fan_count ?? 0,
    pictureUrl: p.picture?.data?.url ?? '',
  }));

  setCache(cacheKey, results);
  return results;
}

// ─── Page Overview ────────────────────────────────────────────────────────────

export async function getPageOverview(pageId: string, token: string): Promise<PageOverview> {
  const cacheKey = `page:${pageId}:overview`;
  const cached = getCache<PageOverview>(cacheKey);
  if (cached) return cached;

  // Fetch page details
  const page = await fbFetch<FacebookPage>(pageId, token, {
    fields: 'id,name,about,description,category,category_list,fan_count,followers_count,picture,cover,website',
  });

  // Fetch recent posts for metrics calculation
  let posts: FacebookPost[] = [];
  try {
    const postsData = await fbFetch<{ data: FacebookPost[] }>(`${pageId}/posts`, token, {
      fields: 'id,reactions.summary(true),shares,comments.summary(true)',
      limit: '25',
    });
    posts = postsData.data ?? [];
  } catch {
    // Posts may not be accessible for all pages
  }

  const metrics = calculateMetrics(page.fan_count ?? page.followers_count ?? 0, posts);

  const overview: PageOverview = {
    id: page.id,
    name: page.name,
    category: page.category ?? page.category_list?.[0]?.name ?? 'Page',
    fanCount: page.fan_count ?? page.followers_count ?? 0,
    about: page.about ?? page.description ?? '',
    website: page.website ?? '',
    pictureUrl: page.picture?.data?.url ?? '',
    coverUrl: page.cover?.source ?? '',
    metrics,
  };

  setCache(cacheKey, overview, 3 * 60 * 1000); // 3 min cache
  return overview;
}

// ─── Page Posts ───────────────────────────────────────────────────────────────

export async function getPagePosts(pageId: string, token: string, limit = 25): Promise<Post[]> {
  const cacheKey = `page:${pageId}:posts:${limit}`;
  const cached = getCache<Post[]>(cacheKey);
  if (cached) return cached;

  const data = await fbFetch<{ data: FacebookPost[] }>(`${pageId}/posts`, token, {
    fields: 'id,message,story,created_time,type,full_picture,shares,reactions.summary(true),comments.summary(true)',
    limit: String(limit),
  });

  const rawPosts = data.data ?? [];
  const posts = transformPosts(rawPosts);

  setCache(cacheKey, posts, 3 * 60 * 1000);
  return posts;
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(token: string) {
  return fbFetch<{ id: string; name: string; picture: { data: { url: string } } }>('me', token, {
    fields: 'id,name,picture',
  });
}

// ─── Metrics Calculation ──────────────────────────────────────────────────────

function calculateMetrics(fanCount: number, posts: FacebookPost[]): PageMetrics {
  if (posts.length === 0) {
    return {
      fanCount,
      totalPosts: 0,
      avgReactions: 0,
      avgShares: 0,
      avgComments: 0,
      engagementRate: 0,
    };
  }

  const totalReactions = posts.reduce((s, p) => s + (p.reactions?.summary?.total_count ?? 0), 0);
  const totalShares = posts.reduce((s, p) => s + (p.shares?.count ?? 0), 0);
  const totalComments = posts.reduce((s, p) => s + (p.comments?.summary?.total_count ?? 0), 0);

  const avgReactions = Math.round(totalReactions / posts.length);
  const avgShares = Math.round(totalShares / posts.length);
  const avgComments = Math.round(totalComments / posts.length);

  const engagementRate = fanCount > 0
    ? ((avgReactions + avgShares + avgComments) / fanCount) * 100
    : 0;

  return {
    fanCount,
    totalPosts: posts.length,
    avgReactions,
    avgShares,
    avgComments,
    engagementRate: Math.round(engagementRate * 1000) / 1000,
  };
}

// ─── Post Transformation ──────────────────────────────────────────────────────

function transformPosts(rawPosts: FacebookPost[]): Post[] {
  if (rawPosts.length === 0) return [];

  const maxReactions = Math.max(...rawPosts.map(p => p.reactions?.summary?.total_count ?? 0), 1);
  const maxShares = Math.max(...rawPosts.map(p => p.shares?.count ?? 0), 1);
  const maxComments = Math.max(...rawPosts.map(p => p.comments?.summary?.total_count ?? 0), 1);

  return rawPosts.map((p) => {
    const reactions = p.reactions?.summary?.total_count ?? 0;
    const shares = p.shares?.count ?? 0;
    const comments = p.comments?.summary?.total_count ?? 0;

    const viralityRaw =
      ((reactions / maxReactions) * 1 + (shares / maxShares) * 3 + (comments / maxComments) * 2) / 3 * 10;
    const viralityScore = Math.round(viralityRaw * 10) / 10;

    return {
      id: p.id,
      message: p.message ?? p.story ?? '',
      createdTime: p.created_time,
      type: p.type ?? 'status',
      thumbnailUrl: p.full_picture ?? null,
      reactions,
      shares,
      comments,
      viralityScore,
      engagementBarPercent: Math.round(viralityScore * 10),
    };
  });
}
