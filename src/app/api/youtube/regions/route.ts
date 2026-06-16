import { getRegions } from '@/lib/youtube/api';

export const revalidate = 86400;

export async function GET() {
  try {
    const regions = await getRegions();
    return Response.json({ items: regions });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
