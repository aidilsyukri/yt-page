'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SearchResponse, YouTubeSearchResult, YouTubeCategory, YouTubeRegion } from '@/types/youtube';
import VideoCard from './VideoCard';
import ChannelCard from './ChannelCard';
import PlaylistCard from './PlaylistCard';
import Pagination from './Pagination';
import { ResultsGridSkeleton } from './Skeleton';

interface ExploreClientProps {
  initialQuery: string;
  initialType: string;
  initialCategory: string;
  initialRegion: string;
  initialOrder: string;
  categories: YouTubeCategory[];
  regions: YouTubeRegion[];
}

const PAGE_SIZE = 10;

export default function ExploreClient({
  initialQuery,
  initialType,
  initialCategory,
  initialRegion,
  initialOrder,
  categories,
  regions,
}: ExploreClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [query] = useState(initialQuery);
  const [type, setType] = useState(initialType || 'all');
  const [category, setCategory] = useState(initialCategory || '');
  const [region, setRegion] = useState(initialRegion || '');
  const [order, setOrder] = useState(initialOrder || 'relevance');

  const [allItems, setAllItems] = useState<YouTubeSearchResult[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialQuery) return;

    let cancelled = false;
    setIsFetching(true);
    setError(null);
    setAllItems([]);
    setCurrentPage(1);

    const sp = new URLSearchParams();
    sp.set('q', initialQuery);
    if (initialType && initialType !== 'all') sp.set('type', initialType);
    if (initialCategory) sp.set('category', initialCategory);
    if (initialRegion) sp.set('region', initialRegion);
    if (initialOrder && initialOrder !== 'relevance') sp.set('order', initialOrder);

    fetch(`/api/youtube/search?${sp.toString()}`)
      .then((r) => r.json())
      .then((data: SearchResponse) => {
        if (cancelled) return;
        setAllItems(data.items ?? []);
        setNextPageToken(data.nextPageToken);
      })
      .catch(() => {
        if (!cancelled) setError('Search failed. Check your API key or try again.');
      })
      .finally(() => {
        if (!cancelled) setIsFetching(false);
      });

    return () => { cancelled = true; };
  }, [initialQuery, initialType, initialCategory, initialRegion, initialOrder]);

  function navigateWithParams(overrides: Record<string, string>) {
    const params: Record<string, string> = {
      q: query,
      type,
      category,
      region,
      order,
      ...overrides,
    };
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (k === 'q' && v) sp.set(k, v);
      else if (v && v !== 'all' && v !== 'relevance' && v !== '') sp.set(k, v);
    });
    startTransition(() => {
      router.push(`/?${sp.toString()}`);
    });
  }

  function handleTypeChange(t: string) {
    setType(t);
    navigateWithParams({ type: t });
  }

  function handleOrderChange(o: string) {
    setOrder(o);
    navigateWithParams({ order: o });
  }

  function handleCategoryChange(c: string) {
    setCategory(c);
    navigateWithParams({ category: c });
  }

  function handleRegionChange(r: string) {
    setRegion(r);
    navigateWithParams({ region: r });
  }

  async function handleLoadMore() {
    if (!nextPageToken) return;
    setLoadingMore(true);
    setError(null);
    try {
      const sp = new URLSearchParams();
      if (query) sp.set('q', query);
      if (type !== 'all') sp.set('type', type);
      if (category) sp.set('category', category);
      if (region) sp.set('region', region);
      if (order !== 'relevance') sp.set('order', order);
      sp.set('pageToken', nextPageToken);

      const res = await fetch(`/api/youtube/search?${sp.toString()}`);
      const data: SearchResponse = await res.json();
      if (!res.ok) {
        setError((data as { error?: string }).error ?? 'Failed to load more');
        return;
      }
      setAllItems((prev) => [...prev, ...(data.items ?? [])]);
      setNextPageToken(data.nextPageToken);
    } catch {
      setError('Failed to load more results');
    } finally {
      setLoadingMore(false);
    }
  }

  const totalPages = Math.ceil(allItems.length / PAGE_SIZE);
  const pageItems = allItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handlePageChange(p: number) {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const types = [
    { value: 'all', label: 'All' },
    { value: 'video', label: 'Videos' },
    { value: 'channel', label: 'Channels' },
    { value: 'playlist', label: 'Playlists' },
  ];

  const orders = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'viewCount', label: 'View Count' },
    { value: 'rating', label: 'Rating' },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {initialQuery && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <div className="flex gap-1 flex-wrap">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => handleTypeChange(t.value)}
                className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: type === t.value ? '#F1F1F1' : '#1A1A1A',
                  color: type === t.value ? '#0F0F0F' : '#F1F1F1',
                  border: `1px solid ${type === t.value ? '#F1F1F1' : '#2A2A2A'}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto flex-wrap items-center">
            <select
              value={order}
              onChange={(e) => handleOrderChange(e.target.value)}
              className="px-3 py-1 rounded-lg text-sm border outline-none"
              style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', color: '#F1F1F1' }}
            >
              {orders.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {categories.length > 0 && (type === 'all' || type === 'video') && (
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3 py-1 rounded-lg text-sm border outline-none"
                style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', color: '#F1F1F1' }}
              >
                <option value="">All Categories</option>
                {categories
                  .filter((c) => c.snippet.assignable)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.snippet.title}</option>
                  ))}
              </select>
            )}

            {regions.length > 0 && (
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="px-3 py-1 rounded-lg text-sm border outline-none"
                style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', color: '#F1F1F1' }}
              >
                <option value="">All Regions</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.snippet.gl}>{r.snippet.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-lg text-sm"
          style={{ backgroundColor: '#2A1A1A', color: '#FF6666', border: '1px solid #4A2A2A' }}
        >
          {error}
        </div>
      )}

      {isFetching ? (
        <ResultsGridSkeleton type={type === 'channel' ? 'channel' : 'video'} />
      ) : !initialQuery ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div
            className="w-16 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#FF0000' }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-10 h-8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-lg font-medium" style={{ color: '#F1F1F1' }}>Search YouTube</p>
          <p className="text-sm" style={{ color: '#AAAAAA' }}>Discover videos, channels, and playlists</p>
        </div>
      ) : allItems.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-lg font-medium" style={{ color: '#F1F1F1' }}>No results found</p>
          <p className="text-sm mt-2" style={{ color: '#AAAAAA' }}>Try different keywords or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pageItems.map((item, idx) => {
              const rawId =
                typeof item.id === 'string'
                  ? item.id
                  : item.id.videoId ?? item.id.channelId ?? item.id.playlistId ?? String(idx);

              if (item.videoDetails) return <VideoCard key={rawId} video={item.videoDetails} />;
              if (item.channelDetails) return <ChannelCard key={rawId} channel={item.channelDetails} />;
              if (item.playlistDetails) return <PlaylistCard key={rawId} playlist={item.playlistDetails} />;

              const idObj = typeof item.id === 'object' ? item.id : null;
              if (idObj?.videoId) {
                const synth = {
                  id: idObj.videoId,
                  snippet: { ...item.snippet, tags: undefined, categoryId: undefined },
                } as import('@/types/youtube').YouTubeVideo;
                return <VideoCard key={rawId} video={synth} />;
              }
              return null;
            })}
          </div>

          <Pagination total={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

          {currentPage === totalPages && nextPageToken && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                style={{ backgroundColor: '#272727', color: '#F1F1F1', border: '1px solid #2A2A2A' }}
              >
                {loadingMore ? 'Loading…' : 'Load more from YouTube'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
