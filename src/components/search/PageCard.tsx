'use client';

import Link from 'next/link';
import { Users, ArrowRight, Info } from 'lucide-react';
import { PageSearchResult } from '@/types';
import { formatNumber, formatExact, getCentralityLabel } from '@/lib/utils/format';
import { useState } from 'react';

interface PageCardProps {
  page: PageSearchResult;
}

function PageAvatar({ pictureUrl, name }: { pictureUrl: string; name: string }) {
  const [imgError, setImgError] = useState(false);

  if (pictureUrl && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pictureUrl}
        alt={name}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="w-14 h-14 bg-gradient-to-br from-[#1877F2] to-[#0D65D9] rounded-xl flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-xl">{name[0]}</span>
    </div>
  );
}

export default function PageCard({ page }: PageCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1877F2]/30 transition-all duration-200 overflow-hidden group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Card body */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Page avatar */}
          <PageAvatar pictureUrl={page.pictureUrl} name={page.name} />

          {/* Page info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-base leading-tight group-hover:text-[#1877F2] transition-colors">
              {page.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{page.category}</p>

            {/* Fan count */}
            <div className="flex items-center gap-1.5 mt-2 relative">
              <Users className="w-3.5 h-3.5 text-[#1877F2]" />
              <span className="text-sm font-semibold text-gray-800">
                {formatNumber(page.fanCount)}
              </span>
              <span className="text-xs text-gray-400">followers</span>

              {/* Tooltip trigger */}
              <button
                className="ml-1 text-gray-400 hover:text-[#1877F2]"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="SNA info"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && page.fanCount > 0 && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
            <p className="font-semibold">{formatExact(page.fanCount)} followers</p>
            <p className="mt-0.5 text-blue-600">
              This page ranks in the {getCentralityLabel(page.fanCount)} on Facebook.
            </p>
          </div>
        )}
      </div>

      {/* Analyse button */}
      <Link
        href={`/page/${page.id}`}
        className="flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-[#1877F2] group/btn transition-colors border-t border-gray-100"
      >
        <span className="text-sm font-medium text-gray-700 group-hover/btn:text-white transition-colors">
          Analyse Network
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
      </Link>
    </div>
  );
}
