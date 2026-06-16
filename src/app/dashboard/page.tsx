'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '@/components/search/SearchBar';
import CategoryChips from '@/components/search/CategoryChips';
import PageCard from '@/components/search/PageCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { PageSearchResult } from '@/types';
import { Search } from 'lucide-react';

interface SearchState {
  query: string;
  results: PageSearchResult[];
  isLoading: boolean;
  error: string | null;
  fallback?: boolean;
  fallbackMessage?: string;
}

const initialState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState<SearchState>(initialState);

  const handleSearch = useCallback(async (query: string) => {
    setSearch((s) => ({ ...s, query, isLoading: true, error: null, results: [], fallback: false }));

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Search failed');

      setSearch((s) => ({
        ...s,
        results: data.pages ?? [],
        isLoading: false,
        fallback: data.fallback,
        fallbackMessage: data.message,
      }));
    } catch (err: unknown) {
      setSearch((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Search failed',
      }));
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome message */}
      <div className="mb-8 text-center sm:text-left">
        {user ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              You&apos;re connected. Start by searching for a Facebook Page to analyse.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Explore Facebook Pages</h1>
            <p className="text-gray-500 mt-1">
              Search for any public Facebook Page to see its network analysis.{' '}
              <a href="/api/auth/login" className="text-[#1877F2] hover:underline">
                Login with Facebook
              </a>{' '}
              for full access.
            </p>
          </>
        )}
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} isLoading={search.isLoading} />
        <CategoryChips onSelect={handleSearch} disabled={search.isLoading} />
      </div>

      {/* Loading state */}
      {search.isLoading && (
        <div className="py-12">
          <LoadingSpinner
            size="lg"
            message={`Searching Facebook Pages for "${search.query}"...`}
          />
        </div>
      )}

      {/* Error state */}
      {!search.isLoading && search.error && (
        <ErrorMessage
          title="Search failed"
          message={search.error}
          onRetry={() => handleSearch(search.query)}
        />
      )}

      {/* Fallback notice */}
      {search.fallback && search.fallbackMessage && (
        <div className="mb-4 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
          <span>⚠️</span>
          <span>{search.fallbackMessage}</span>
        </div>
      )}

      {/* Results */}
      {!search.isLoading && !search.error && search.results.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              Results for{' '}
              <span className="font-semibold text-gray-900">&ldquo;{search.query}&rdquo;</span>
              <span className="text-gray-400 ml-1">({search.results.length} pages found)</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {search.results.map((page) => (
              <PageCard key={page.id} page={page} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!search.isLoading && !search.error && search.query && search.results.length === 0 && (
        <div className="text-center py-12">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No pages found</h3>
          <p className="text-sm text-gray-500">
            No Facebook Pages matched &ldquo;{search.query}&rdquo;. Try a different search term.
          </p>
        </div>
      )}

      {/* Initial state — no search yet */}
      {!search.isLoading && !search.query && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[#1877F2]" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            Search for a Facebook Page
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Type a page name like &ldquo;NASA&rdquo;, &ldquo;BBC News&rdquo;, or
            &ldquo;Harvard University&rdquo; and press Search to begin your analysis.
          </p>
        </div>
      )}
    </div>
  );
}
