'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { PageOverview } from '@/types';
import { formatNumber, formatPercent } from '@/lib/utils/format';

interface SNAExplanationProps {
  page: PageOverview;
}

export default function SNAExplanation({ page }: SNAExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { metrics } = page;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1877F2]" />
          <span className="text-sm font-semibold text-gray-900">
            What do these numbers mean? (SNA Theory Explained)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                👥 Followers ({formatNumber(metrics.fanCount)})
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                This is the <strong>in-degree centrality</strong> of this page node. It means{' '}
                {formatNumber(metrics.fanCount)} accounts have created a directed edge pointing at
                this page, making it one of the most connected nodes in the Facebook network.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-900 mb-1">
                📊 Engagement Rate ({formatPercent(metrics.engagementRate)})
              </h4>
              <p className="text-xs text-purple-800 leading-relaxed">
                Out of all followers, only {formatPercent(metrics.engagementRate)} interact with an
                average post. This is the <strong>edge density</strong> of the active audience
                sub-network — measuring what fraction of theoretically possible interaction edges
                actually exist.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-1">
                🔁 Avg Shares ({formatNumber(metrics.avgShares)})
              </h4>
              <p className="text-xs text-green-800 leading-relaxed">
                Each share extends content beyond the page&#39;s direct followers to the sharer&#39;s
                network. This measures <strong>content diffusion</strong> — how far information
                propagates through 2nd-degree and 3rd-degree connections.
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-orange-900 mb-1">
                💬 Avg Comments ({formatNumber(metrics.avgComments)})
              </h4>
              <p className="text-xs text-orange-800 leading-relaxed">
                Comments represent <strong>discussion depth</strong> — each comment thread creates
                a sub-network of reply interactions. High comment counts indicate the page generates
                meaningful two-way conversation edges.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              🔗 Core-Periphery Structure Insight
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              A page with {formatNumber(metrics.fanCount)} followers but only a{' '}
              {formatPercent(metrics.engagementRate)} engagement rate demonstrates the{' '}
              <strong>sparse nature of large-scale social networks</strong>. The vast majority of
              follower nodes are peripheral (weak ties), while a small core of highly engaged users
              form the dense inner community — a pattern consistent with Barabási-Albert scale-free
              network theory.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
