import { type NextRequest } from 'next/server';
import { getChannelPlaylists } from '@/lib/youtube/api';

export const revalidate = 60;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;
  try {
    const data = await getChannelPlaylists(channelId);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
