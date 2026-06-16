// ─── Number Formatting ─────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatExact(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatPercent(n: number, decimals = 3): string {
  return `${n.toFixed(decimals)}%`;
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ─── Centrality Rank Labels ───────────────────────────────────────────────────

export function getCentralityLabel(fanCount: number): string {
  if (fanCount >= 50_000_000) return 'top 0.001% by in-degree centrality';
  if (fanCount >= 10_000_000) return 'top 0.01% by in-degree centrality';
  if (fanCount >= 1_000_000) return 'top 0.1% by in-degree centrality';
  if (fanCount >= 100_000) return 'top 1% by in-degree centrality';
  if (fanCount >= 10_000) return 'top 5% by in-degree centrality';
  return 'emerging node in the network';
}

// ─── Post Type Labels ─────────────────────────────────────────────────────────

export function formatPostType(type: string): string {
  const labels: Record<string, string> = {
    photo: 'Photo',
    video: 'Video',
    link: 'Link',
    status: 'Status',
    offer: 'Offer',
    reel: 'Reel',
  };
  return labels[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}
