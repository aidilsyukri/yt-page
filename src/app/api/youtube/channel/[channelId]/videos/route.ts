import { type NextRequest } from 'next/server';
import { getChannelDetail, getChannelVideos } from '@/lib/youtube/api';

export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;
  const pageToken = request.nextUrl.searchParams.get('pageToken') ?? undefined;
  try {
    const channel = await getChannelDetail(channelId);
    const uploadsId = channel.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) {
      return Response.json({ items: [], enrichedVideos: [] });
    }
    const data = await getChannelVideos(uploadsId, pageToken);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
