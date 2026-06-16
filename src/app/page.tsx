import ExploreClient from '@/components/youtube/ExploreClient';
import type { YouTubeCategory, YouTubeRegion } from '@/types/youtube';
import { getVideoCategories, getRegions } from '@/lib/youtube/api';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    category?: string;
    region?: string;
    order?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { q, type, category, region, order } = await searchParams;

  const [categories, regions] = await Promise.all([
    getVideoCategories().catch((): YouTubeCategory[] => []),
    getRegions().catch((): YouTubeRegion[] => []),
  ]);

  const searchKey = `${q ?? ''}-${type ?? ''}-${category ?? ''}-${region ?? ''}-${order ?? ''}`;

  return (
    <ExploreClient
      key={searchKey}
      initialQuery={q ?? ''}
      initialType={type ?? 'all'}
      initialCategory={category ?? ''}
      initialRegion={region ?? ''}
      initialOrder={order ?? 'relevance'}
      categories={categories}
      regions={regions}
    />
  );
}
