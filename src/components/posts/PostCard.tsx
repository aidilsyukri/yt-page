'use client';

import { useState } from 'react';
import { Post } from '@/types';
import { formatNumber, formatDate, formatRelativeTime, formatPostType } from '@/lib/utils/format';
import { getViralityColor, getViralityLabel } from '@/lib/utils/virality';
import EngagementBar from './EngagementBar';
import { Calendar, ImageIcon, Flame, MessageSquare, Share2, Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface PostCardProps {
  post: Post;
  rank?: number;
}

const typeIconMap: Record<string, string> = {
  photo: '📷',
  video: '🎬',
  link: '🔗',
  status: '📝',
  offer: '🏷️',
  reel: '🎞️',
};

export default function PostCard({ post, rank }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const maxMessageLength = 200;
  const isLong = post.message.length > maxMessageLength;
  const displayMessage = expanded || !isLong
    ? post.message
    : post.message.slice(0, maxMessageLength) + '...';

  const viralityColor = getViralityColor(post.viralityScore);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Post thumbnail */}
      {post.thumbnailUrl && !imgError && (
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnailUrl}
            alt="Post image"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {rank && rank <= 3 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'} #{rank}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Rank badge (no thumbnail) */}
        {rank && rank <= 3 && !post.thumbnailUrl && (
          <span className="inline-block mb-2 text-xs font-bold">
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'} Rank #{rank}
          </span>
        )}

        {/* Post message */}
        {post.message ? (
          <div>
            <p className="text-sm text-gray-800 leading-relaxed">{displayMessage}</p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-[#1877F2] mt-1 hover:underline"
              >
                {expanded ? (
                  <>Show less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Read more <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No message text</p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatRelativeTime(post.createdTime)}
          </span>
          <span className="flex items-center gap-1" title={formatDate(post.createdTime)}>
            <ImageIcon className="w-3 h-3" />
            {typeIconMap[post.type] ?? '📄'} {formatPostType(post.type)}
          </span>
        </div>

        {/* Engagement stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Heart className="w-3.5 h-3.5 text-red-500" />
            </div>
            <p className="text-base font-bold text-gray-900">{formatNumber(post.reactions)}</p>
            <p className="text-xs text-gray-500">Reactions</p>
          </div>

          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Share2 className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-base font-bold text-gray-900">{formatNumber(post.shares)}</p>
            <p className="text-xs text-gray-500">Shares</p>
          </div>

          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <MessageSquare className="w-3.5 h-3.5 text-green-500" />
            </div>
            <p className="text-base font-bold text-gray-900">{formatNumber(post.comments)}</p>
            <p className="text-xs text-gray-500">Comments</p>
          </div>

          <div className={`text-center p-2 rounded-lg ${post.viralityScore >= 7 ? 'bg-green-50' : post.viralityScore >= 4 ? 'bg-yellow-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Flame className={`w-3.5 h-3.5 ${viralityColor}`} />
            </div>
            <p className={`text-base font-bold ${viralityColor}`}>{post.viralityScore}</p>
            <p className="text-xs text-gray-500">Score /10</p>
          </div>
        </div>

        {/* SNA tooltip */}
        <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          <span className="font-medium text-gray-700">SNA: </span>
          Shares × 3 (diffusion) + Comments × 2 (discussion) + Reactions × 1 (engagement) →{' '}
          <span className={`font-bold ${viralityColor}`}>
            {getViralityLabel(post.viralityScore)} ({post.viralityScore}/10)
          </span>
        </div>

        {/* Engagement bar */}
        <EngagementBar score={post.viralityScore} percent={post.engagementBarPercent} />
      </div>
    </div>
  );
}
