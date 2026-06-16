'use client';

import { PAGE_CATEGORIES } from '@/lib/facebook/types';

interface CategoryChipsProps {
  onSelect: (category: string) => void;
  disabled?: boolean;
}

const categoryEmojis: Record<string, string> = {
  'News': '📰',
  'Sports': '⚽',
  'Education': '🎓',
  'Entertainment': '🎬',
  'Science & Technology': '🔬',
  'NGO': '🌍',
  'Business': '💼',
  'Music': '🎵',
};

export default function CategoryChips({ onSelect, disabled }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      <span className="text-sm text-gray-500 self-center mr-1">Browse by category:</span>
      {PAGE_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-[#1877F2] hover:text-[#1877F2] text-gray-700 text-sm rounded-full transition-colors shadow-sm disabled:opacity-50"
        >
          <span>{categoryEmojis[cat] ?? '📌'}</span>
          {cat}
        </button>
      ))}
    </div>
  );
}
