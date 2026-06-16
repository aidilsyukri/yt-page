import { NextRequest, NextResponse } from 'next/server';
import { getPageOverviewBySerpApi } from '@/lib/serpapi/client';
import { MOCK_PAGE_OVERVIEW } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params;

  if (!pageId) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
  }

  if (process.env.USE_MOCK_DATA === 'true') {
    return NextResponse.json({ page: MOCK_PAGE_OVERVIEW });
  }

  try {
    const page = await getPageOverviewBySerpApi(pageId);
    return NextResponse.json({ page });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch page';
    console.error('SerpAPI page overview error:', message);

    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        page: { ...MOCK_PAGE_OVERVIEW, id: pageId },
        fallback: true,
        message: 'Using demo data — SerpAPI unavailable',
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
