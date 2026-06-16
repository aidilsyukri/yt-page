'use client';

import Link from 'next/link';
import { Network, Users, BarChart2, Share2, AlertCircle, ShieldCheck, Globe } from 'lucide-react';

interface LandingPageProps {
  error?: string;
}

const errorMessages: Record<string, string> = {
  access_denied: 'You cancelled the Facebook login. Please try again.',
  no_code: 'Facebook did not provide an authorisation code. Please try again.',
  invalid_state: 'Security validation failed. Please try again.',
  auth_failed: 'Authentication failed. Please check your app configuration.',
  misconfigured: 'The app is not properly configured. Please contact support.',
};

const features = [
  {
    icon: Users,
    title: 'In-Degree Centrality',
    desc: 'See follower counts as a real SNA metric — who holds the most network influence.',
  },
  {
    icon: BarChart2,
    title: 'Network Overview Dashboard',
    desc: 'Six key metrics visualised: fans, engagement rate, avg reactions, shares & comments.',
  },
  {
    icon: Share2,
    title: 'Post Engagement Explorer',
    desc: 'Sort posts by virality score, reactions, shares, or comments. Identify superspreader content.',
  },
  {
    icon: Network,
    title: 'Social Network Analysis',
    desc: 'Every metric linked to SNA theory: edge weights, network density, content diffusion.',
  },
];

export default function LandingPage({ error }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-2xl w-full mx-auto text-center">
          {/* Brand */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-[#1877F2] rounded-2xl flex items-center justify-center shadow-lg">
              <Network className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-bold text-gray-900">PageNet</span>
          </div>

          <p className="text-lg text-gray-500 mb-2 font-medium">
            Facebook Page Social Network Analyzer
          </p>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">
                {errorMessages[error] ?? 'An error occurred. Please try again.'}
              </p>
            </div>
          )}

          {/* Hero text */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mt-6 mb-8">
            <blockquote className="text-gray-700 text-base leading-relaxed italic mb-6">
              &ldquo;Explore the network structure of any Facebook Page. See who engages, how
              content spreads, and what your audience network looks like.&rdquo;
            </blockquote>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/api/auth/login"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Login with Facebook
              </a>

              <Link
                href="/dashboard?guest=true"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors border border-gray-200 text-base"
              >
                <Globe className="w-5 h-5 text-gray-500" />
                Continue as Guest
                <span className="text-xs font-normal text-gray-400">(Public pages only)</span>
              </Link>
            </div>

            {/* Privacy note */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              We never store your password. Your token is secured in an HTTP-only cookie.
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-gray-200 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            What PageNet analyses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-[#1877F2]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-4 text-center text-xs text-gray-400">
        CSC795 Assignment 2 — Universiti Teknologi MARA · Facebook Graph API v25.0 ·{' '}
        Built with Next.js &amp; TypeScript
      </footer>
    </div>
  );
}
