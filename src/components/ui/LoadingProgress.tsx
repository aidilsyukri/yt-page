'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ProgressStep {
  label: string;
  done: boolean;
}

interface LoadingProgressProps {
  pageName: string;
  steps: ProgressStep[];
}

export default function LoadingProgress({ pageName, steps }: LoadingProgressProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-[#1877F2] animate-spin" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Loading {pageName} network data...
          </h2>
          <p className="text-sm text-gray-500 mt-1">This may take a moment</p>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              {step.done ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 text-[#1877F2] flex-shrink-0 animate-spin" />
              )}
              <span className={`text-sm ${step.done ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                {step.label}
                {step.done && <span className="ml-1 text-green-600">✓</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
