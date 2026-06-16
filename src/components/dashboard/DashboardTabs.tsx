'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, MessageSquare, Heart, Users, TrendingUp, BarChart2 } from 'lucide-react';

interface Tab {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  implemented: boolean;
}

interface DashboardTabsProps {
  pageId: string;
}

export default function DashboardTabs({ pageId }: DashboardTabsProps) {
  const pathname = usePathname();

  const tabs: Tab[] = [
    {
      label: 'Overview',
      href: `/page/${pageId}`,
      icon: BarChart2,
      implemented: true,
    },
    {
      label: 'Posts',
      href: `/page/${pageId}/posts`,
      icon: FileText,
      implemented: true,
    },
    {
      label: 'Comments',
      href: `/page/${pageId}/comments`,
      icon: MessageSquare,
      implemented: false,
    },
    {
      label: 'Reactions',
      href: `/page/${pageId}/reactions`,
      icon: Heart,
      implemented: false,
    },
    {
      label: 'Top Users',
      href: `/page/${pageId}/top-users`,
      icon: Users,
      implemented: false,
    },
    {
      label: 'Timeline',
      href: `/page/${pageId}/timeline`,
      icon: TrendingUp,
      implemented: false,
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            if (!tab.implemented) {
              return (
                <div
                  key={tab.label}
                  className="flex items-center gap-1.5 px-4 py-3 text-sm text-gray-400 cursor-not-allowed whitespace-nowrap relative group"
                  title="Coming soon"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-gray-300 rounded-full" />
                </div>
              );
            }

            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'text-[#1877F2] border-[#1877F2]'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
