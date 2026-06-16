import { type NextRequest } from 'next/server';
import { getVideoComments } from '@/lib/youtube/api';

export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  const pageToken = request.nextUrl.searchParams.get('pageToken') ?? undefined;
  try {
    const data = await getVideoComments(videoId, pageToken);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
