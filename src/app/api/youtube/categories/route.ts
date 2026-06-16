import { getVideoCategories } from '@/lib/youtube/api';

export const revalidate = 86400;

export async function GET() {
  try {
    const categories = await getVideoCategories();
    return Response.json({ items: categories });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
