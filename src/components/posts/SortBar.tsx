'use client';

import { SortOption, FilterOption } from '@/types';
import { ArrowUpDown, Filter } from 'lucide-react';

interface SortBarProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  totalPosts: number;
}

const sortOptions: { value: SortOption; label: string; description: string }[] = [
  { value: 'virality', label: '🔥 Virality Score', description: 'Weighted composite score' },
  { value: 'reactions', label: '❤️ Most Reactions', description: 'Total engagement edges' },
  { value: 'shares', label: '🔁 Most Shares', description: 'Content diffusion reach' },
  { value: 'comments', label: '💬 Most Comments', description: 'Discussion depth' },
  { value: 'newest', label: '🕒 Newest First', description: 'Chronological order' },
];

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'photo', label: '📷 Photo' },
  { value: 'video', label: '🎬 Video' },
  { value: 'link', label: '🔗 Link' },
  { value: 'status', label: '📝 Status' },
];

export default function SortBar({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
  totalPosts,
}: SortBarProps) {
  const activeSortDesc = sortOptions.find((o) => o.value === sortBy)?.description ?? '';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span>📄</span>
            Posts
            <span className="text-xs text-gray-500 font-normal">(showing last {totalPosts})</span>
          </h2>
          {sortBy !== 'newest' && (
            <p className="text-xs text-gray-500 mt-0.5">
              Sorted by: <span className="font-medium text-[#1877F2]">{activeSortDesc}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Sort select */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1877F2] bg-white cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter select */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterBy}
              onChange={(e) => onFilterChange(e.target.value as FilterOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1877F2] bg-white cursor-pointer"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
