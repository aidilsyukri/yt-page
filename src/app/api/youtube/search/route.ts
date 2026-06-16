import { type NextRequest } from 'next/server';
import { searchYouTube } from '@/lib/youtube/api';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get('q') ?? '';
  const type = sp.get('type') ?? 'all';
  const category = sp.get('category') ?? '';
  const region = sp.get('region') ?? '';
  const order = sp.get('order') ?? 'relevance';
  const pageToken = sp.get('pageToken') ?? '';

  try {
    const data = await searchYouTube({
      q: q || undefined,
      type: type !== 'all' ? type : undefined,
      category: category || undefined,
      region: region || undefined,
      order: order !== 'relevance' ? order : undefined,
      pageToken: pageToken || undefined,
    });
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
