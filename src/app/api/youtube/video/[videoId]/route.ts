import { type NextRequest } from 'next/server';
import { getVideoDetail } from '@/lib/youtube/api';

export const revalidate = 60;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  try {
    const video = await getVideoDetail(videoId);
    return Response.json({ video });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
