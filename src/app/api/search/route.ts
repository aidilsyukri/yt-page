import { NextRequest, NextResponse } from 'next/server';
import { searchPagesBySerpApi } from '@/lib/serpapi/client';
import { MOCK_PAGES } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
  }

  if (process.env.USE_MOCK_DATA === 'true') {
    const filtered = MOCK_PAGES.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    return NextResponse.json({ pages: filtered.length > 0 ? filtered : MOCK_PAGES });
  }

  try {
    const pages = await searchPagesBySerpApi(query);
    return NextResponse.json({ pages });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed';
    console.error('SerpAPI search error:', message);

    if (process.env.NODE_ENV === 'development') {
      const filtered = MOCK_PAGES.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      return NextResponse.json({
        pages: filtered.length > 0 ? filtered : MOCK_PAGES,
        fallback: true,
        message: 'Using demo data — SerpAPI unavailable',
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
