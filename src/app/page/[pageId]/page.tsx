import { notFound } from 'next/navigation';
import { getPageOverview, getAppAccessToken } from '@/lib/facebook/client';
import { getSession } from '@/lib/session';
import { MOCK_PAGE_OVERVIEW } from '@/lib/mock-data';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import MetricCard from '@/components/dashboard/MetricCard';
import SNAExplanation from '@/components/dashboard/SNAExplanation';
import { Users, FileText, Heart, Share2, MessageSquare, BarChart2 } from 'lucide-react';
import { formatNumber, formatPercent } from '@/lib/utils/format';

interface PageProps {
  params: Promise<{ pageId: string }>;
}

export default async function PageOverviewPage({ params }: PageProps) {
  const { pageId } = await params;

  let page = null;
  let fallbackUsed = false;

  try {
    const session = await getSession();
    const token = session?.accessToken ?? getAppAccessToken();

    if (process.env.USE_MOCK_DATA === 'true') {
      page = { ...MOCK_PAGE_OVERVIEW, id: pageId };
      fallbackUsed = true;
    } else {
      page = await getPageOverview(pageId, token);
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      page = { ...MOCK_PAGE_OVERVIEW, id: pageId };
      fallbackUsed = true;
    } else {
      notFound();
    }
  }

  if (!page) notFound();

  const { metrics } = page;

  return (
    <>
      <PageHeader page={page} />
      <DashboardTabs pageId={pageId} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Demo notice */}
        {fallbackUsed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>Displaying demo data — Facebook API unavailable or not configured.</span>
          </div>
        )}

        {/* 6 Metric Cards */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Network Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              icon={Users}
              label="Followers"
              value={formatNumber(metrics.fanCount)}
              snaLabel="In-Degree Centrality"
              snaDescription="Number of directed edges pointing at this page node"
              color="text-[#1877F2]"
            />
            <MetricCard
              icon={FileText}
              label="Total Posts"
              value={formatNumber(metrics.totalPosts)}
              snaLabel="Content Output (Out-Degree)"
              snaDescription="Number of content nodes this page has produced"
              color="text-purple-600"
            />
            <MetricCard
              icon={Heart}
              label="Avg Reactions / Post"
              value={formatNumber(metrics.avgReactions)}
              snaLabel="Avg Edge Weight per Post"
              snaDescription="Average strength of audience engagement ties"
              color="text-red-500"
            />
            <MetricCard
              icon={Share2}
              label="Avg Shares / Post"
              value={formatNumber(metrics.avgShares)}
              snaLabel="Avg Diffusion per Post"
              snaDescription="How far content travels beyond direct followers"
              color="text-green-600"
            />
            <MetricCard
              icon={MessageSquare}
              label="Avg Comments / Post"
              value={formatNumber(metrics.avgComments)}
              snaLabel="Avg Discussion Depth"
              snaDescription="Average number of conversation edges per post"
              color="text-orange-500"
            />
            <MetricCard
              icon={BarChart2}
              label="Engagement Rate"
              value={formatPercent(metrics.engagementRate)}
              snaLabel="Active Edge Density"
              snaDescription="Fraction of followers who form active interaction edges"
              color="text-teal-600"
            />
          </div>
        </div>

        {/* SNA Explanation Panel */}
        <SNAExplanation page={page} />

        {/* Navigation hint */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">🔭 Explore Deeper</h3>
          <p className="text-sm text-gray-600">
            Use the <strong>Posts</strong> tab above to explore individual post engagement,
            sort by virality score, and identify the highest-performing content nodes in this
            page&apos;s network.
          </p>
        </div>
      </div>
    </>
  );
}
