import React from 'react';

interface EmptyStateProps {
  message: string;
  ctaLabel: string;
  onCta: () => void;
}

export function EmptyState({ message, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg width="80" height="80" fill="none" viewBox="0 0 80 80" className="mb-4">
        <rect width="80" height="80" rx="16" fill="#F3F4F6" />
        <path d="M24 56V32a8 8 0 018-8h16a8 8 0 018 8v24" stroke="#A5B4FC" strokeWidth="2" />
        <rect x="28" y="40" width="24" height="16" rx="4" fill="#A5B4FC" />
        <circle cx="40" cy="48" r="2" fill="#6366F1" />
      </svg>
      <div className="text-lg font-semibold mb-2 text-gray-700 text-center">{message}</div>
      <button onClick={onCta} className="mt-2 btn btn-primary px-6 py-2 rounded-lg shadow">
        {ctaLabel}
      </button>
    </div>
  );
} 