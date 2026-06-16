import { NextRequest, NextResponse } from 'next/server';
import { getPagePostsBySerpApi } from '@/lib/serpapi/client';
import { MOCK_POSTS } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params;

  if (!pageId) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
  }

  if (process.env.USE_MOCK_DATA === 'true') {
    return NextResponse.json({ posts: MOCK_POSTS });
  }

  try {
    const posts = await getPagePostsBySerpApi(pageId);
    return NextResponse.json({ posts });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch posts';
    console.error('SerpAPI posts error:', message);

    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        posts: MOCK_POSTS,
        fallback: true,
        message: 'Using demo data — SerpAPI unavailable',
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
