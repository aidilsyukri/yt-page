'use client';

import { useState, useRef, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function YouTubeNavbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: '#0F0F0F',
        borderColor: '#2A2A2A',
      }}
    >
      <div className="flex items-center gap-4 px-4 h-14 max-w-screen-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-6 rounded-md" style={{ backgroundColor: '#FF0000' }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-4">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold" style={{ color: '#F1F1F1' }}>
            PageNet
          </span>
        </Link>

        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto flex">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos, channels, playlists..."
            className="flex-1 px-4 py-2 text-sm rounded-l-full border outline-none transition-colors"
            style={{
              backgroundColor: '#121212',
              borderColor: '#303030',
              color: '#F1F1F1',
            }}
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-r-full border border-l-0 flex items-center justify-center transition-colors"
            style={{
              backgroundColor: '#272727',
              borderColor: '#303030',
              color: '#F1F1F1',
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </form>
      </div>
    </nav>
  );
}
