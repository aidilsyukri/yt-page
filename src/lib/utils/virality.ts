import { Post, SortOption, FilterOption } from '@/types';

// Virality Score: shares weighted 3x (network diffusion), comments 2x (discussion depth), reactions 1x
export function calculateViralityScore(
  reactions: number,
  shares: number,
  comments: number,
  maxReactions: number,
  maxShares: number,
  maxComments: number,
): number {
  if (maxReactions === 0 && maxShares === 0 && maxComments === 0) return 0;
  const score =
    ((reactions / (maxReactions || 1)) * 1 +
      (shares / (maxShares || 1)) * 3 +
      (comments / (maxComments || 1)) * 2) /
    3 *
    10;
  return Math.round(score * 10) / 10;
}

export function getViralityColor(score: number): string {
  if (score >= 7) return 'text-green-600';
  if (score >= 4) return 'text-yellow-600';
  return 'text-red-500';
}

export function getViralityBarColor(score: number): string {
  if (score >= 7) return 'bg-green-500';
  if (score >= 4) return 'bg-yellow-500';
  return 'bg-red-400';
}

export function getViralityLabel(score: number): string {
  if (score >= 7) return 'High Virality';
  if (score >= 4) return 'Medium Virality';
  return 'Low Virality';
}

export function sortPosts(posts: Post[], sortBy: SortOption): Post[] {
  const sorted = [...posts];
  switch (sortBy) {
    case 'virality':
      return sorted.sort((a, b) => b.viralityScore - a.viralityScore);
    case 'reactions':
      return sorted.sort((a, b) => b.reactions - a.reactions);
    case 'shares':
      return sorted.sort((a, b) => b.shares - a.shares);
    case 'comments':
      return sorted.sort((a, b) => b.comments - a.comments);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
    default:
      return sorted;
  }
}

export function filterPosts(posts: Post[], filterBy: FilterOption): Post[] {
  if (filterBy === 'all') return posts;
  return posts.filter((p) => p.type === filterBy);
}
