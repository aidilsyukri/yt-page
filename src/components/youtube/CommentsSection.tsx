'use client';

import { useState } from 'react';
import type { YouTubeCommentThread, YouTubeComment } from '@/types/youtube';
import { formatCount, formatRelativeDate } from '@/lib/youtube/format';

interface CommentsSectionProps {
  videoId: string;
  initialThreads: YouTubeCommentThread[];
  initialNextPageToken?: string;
}

export default function CommentsSection({
  videoId,
  initialThreads,
  initialNextPageToken,
}: CommentsSectionProps) {
  const [threads, setThreads] = useState<YouTubeCommentThread[]>(initialThreads);
  const [nextToken, setNextToken] = useState<string | undefined>(initialNextPageToken);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [extraReplies, setExtraReplies] = useState<Map<string, YouTubeComment[]>>(new Map());
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());

  async function loadMore() {
    if (!nextToken) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/youtube/video/${videoId}/comments?pageToken=${nextToken}`);
      const data = await res.json();
      if (res.ok) {
        setThreads((prev) => [...prev, ...(data.items ?? [])]);
        setNextToken(data.nextPageToken);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  async function toggleReplies(thread: YouTubeCommentThread) {
    const id = thread.id;
    if (expandedReplies.has(id)) {
      setExpandedReplies((prev) => { const s = new Set(prev); s.delete(id); return s; });
      return;
    }
    setExpandedReplies((prev) => new Set([...prev, id]));
    if (!extraReplies.has(id) && thread.snippet.totalReplyCount > 0) {
      setLoadingReplies((prev) => new Set([...prev, id]));
      try {
        const res = await fetch(`/api/youtube/video/${videoId}/comments?parentId=${id}`);
        const data = await res.json();
        if (res.ok && data.items) {
          setExtraReplies((prev) => new Map([...prev, [id, data.items]]));
        }
      } finally {
        setLoadingReplies((prev) => { const s = new Set(prev); s.delete(id); return s; });
      }
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6" style={{ color: '#F1F1F1' }}>
        Comments
      </h2>

      <div className="space-y-6">
        {threads.map((thread) => {
          const top = thread.snippet.topLevelComment;
          const isExpanded = expandedReplies.has(thread.id);
          const replies = extraReplies.get(thread.id) ?? thread.replies?.comments ?? [];

          return (
            <div key={thread.id}>
              <CommentItem comment={top} />

              {thread.snippet.totalReplyCount > 0 && (
                <div className="ml-12 mt-2">
                  <button
                    onClick={() => toggleReplies(thread)}
                    className="text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
                    style={{ color: '#3EA6FF' }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                    {isExpanded
                      ? 'Hide replies'
                      : `${thread.snippet.totalReplyCount} repl${thread.snippet.totalReplyCount === 1 ? 'y' : 'ies'}`}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-4">
                      {loadingReplies.has(thread.id) ? (
                        <p className="text-sm" style={{ color: '#AAAAAA' }}>Loading replies…</p>
                      ) : (
                        replies.map((reply) => (
                          <CommentItem key={reply.id} comment={reply} isReply />
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {nextToken && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#272727', color: '#F1F1F1', border: '1px solid #2A2A2A' }}
          >
            {loadingMore ? 'Loading…' : 'Load more comments'}
          </button>
        </div>
      )}
    </div>
  );
}

function CommentAvatar({ url, name }: { url: string; name: string }) {
  const [broken, setBroken] = useState(false);

  const initial = name?.charAt(0)?.toUpperCase() ?? '?';
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const bg = `hsl(${hue}, 55%, 38%)`;

  if (!url || broken) {
    return (
      <div
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
        style={{ backgroundColor: bg, color: '#fff' }}
      >
        {initial}
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden" style={{ backgroundColor: '#2A2A2A' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={name}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    </div>
  );
}

function CommentItem({ comment, isReply = false }: { comment: YouTubeComment; isReply?: boolean }) {
  const s = comment.snippet;
  return (
    <div className={`flex gap-3 ${isReply ? 'pl-2' : ''}`}>
      <CommentAvatar url={s.authorProfileImageUrl ?? ''} name={s.authorDisplayName ?? '?'} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold" style={{ color: '#F1F1F1' }}>
            {s.authorDisplayName}
          </span>
          <span className="text-xs" style={{ color: '#AAAAAA' }}>
            {formatRelativeDate(s.publishedAt)}
          </span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: '#F1F1F1' }}
          dangerouslySetInnerHTML={{ __html: s.textDisplay }}
        />
        {s.likeCount > 0 && (
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#AAAAAA' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
            </svg>
            {formatCount(s.likeCount)}
          </p>
        )}
      </div>
    </div>
  );
}
