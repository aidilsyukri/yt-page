'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageOverview } from '@/types';
import { MapPin, Globe, ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  page: PageOverview;
}

export default function PageHeader({ page }: PageHeaderProps) {
  const [coverError, setCoverError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Cover photo */}
      {page.coverUrl && !coverError && (
        <div className="relative h-36 sm:h-48 overflow-hidden bg-gradient-to-r from-[#1877F2] to-[#0D65D9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.coverUrl}
            alt={`${page.name} cover`}
            className="w-full h-full object-cover opacity-80"
            onError={() => setCoverError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-14 mb-4">
          {/* Page avatar */}
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-md bg-white flex-shrink-0 overflow-hidden">
            {page.pictureUrl && !avatarError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={page.pictureUrl}
                alt={page.name}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1877F2] to-[#0D65D9] flex items-center justify-center">
                <span className="text-white font-bold text-3xl">{page.name[0]}</span>
              </div>
            )}
          </div>

          {/* Page details */}
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{page.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                {page.category}
              </span>
              {page.website && (
                <a
                  href={page.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-[#1877F2] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {page.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>

        {/* About text */}
        {page.about && (
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{page.about}</p>
        )}
      </div>
    </div>
  );
}
