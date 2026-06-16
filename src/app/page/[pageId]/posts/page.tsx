'use client';

import { useState, useEffect, useMemo, use } from 'react';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import SortBar from '@/components/posts/SortBar';
import PostCard from '@/components/posts/PostCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Post, SortOption, FilterOption } from '@/types';
import { sortPosts, filterPosts } from '@/lib/utils/virality';

interface PostsPageProps {
  params: Promise<{ pageId: string }>;
}

export default function PostsPage({ params }: PostsPageProps) {
  const { pageId } = use(params);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('virality');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/page/${pageId}/posts`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Failed to load posts');
        setPosts(data.posts ?? []);
        setFallback(!!data.fallback);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [pageId]);

  const displayedPosts = useMemo(() => {
    const filtered = filterPosts(posts, filterBy);
    return sortPosts(filtered, sortBy);
  }, [posts, sortBy, filterBy]);

  // Get page name from first post context — or fall back to ID
  const sortLabel = sortBy === 'shares'
    ? 'Sorted by: Content Diffusion (Shares) — shares measure how far this post travelled through the Facebook network beyond this page.'
    : null;

  return (
    <>
      {/* Tabs — need page name, use a generic label */}
      <DashboardTabs pageId={pageId} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Fallback notice */}
        {fallback && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>Displaying demo data — Facebook API unavailable or not configured.</span>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="py-12">
            <LoadingSpinner size="lg" message="Fetching recent posts..." />
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <ErrorMessage
            title="Could not load posts"
            message={error}
            onRetry={() => {
              setIsLoading(true);
              setError(null);
              fetch(`/api/page/${pageId}/posts`)
                .then((r) => r.json())
                .then((d) => { setPosts(d.posts ?? []); setFallback(!!d.fallback); })
                .catch((e) => setError(e.message))
                .finally(() => setIsLoading(false));
            }}
          />
        )}

        {/* Content */}
        {!isLoading && !error && (
          <>
            {/* Sort bar */}
            <SortBar
              sortBy={sortBy}
              filterBy={filterBy}
              onSortChange={setSortBy}
              onFilterChange={setFilterBy}
              totalPosts={displayedPosts.length}
            />

            {/* Sort contextual label */}
            {sortLabel && (
              <div className="text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <span className="font-medium text-blue-800">📊 </span>
                {sortLabel}
              </div>
            )}

            {/* Virality formula legend */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-600">
              <p className="font-semibold text-gray-800 mb-1">🔥 Virality Score Formula (SNA-weighted)</p>
              <p className="font-mono bg-gray-50 rounded p-2 text-gray-700">
                Score = (Reactions/Max × <span className="text-red-600 font-bold">1</span> + Shares/Max × <span className="text-blue-600 font-bold">3</span> + Comments/Max × <span className="text-green-600 font-bold">2</span>) ÷ 3 × 10
              </p>
              <p className="mt-1.5 text-gray-500">
                Shares × 3 (each share creates a new diffusion edge) · Comments × 2 (deeper engagement) · Reactions × 1 (passive edge)
              </p>
            </div>

            {/* Posts grid */}
            {displayedPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {displayedPosts.map((post, i) => (
                  <PostCard key={post.id} post={post} rank={i + 1} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-medium">No posts match the current filter.</p>
                <p className="text-sm mt-1">Try selecting &quot;All Types&quot; from the filter dropdown.</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
