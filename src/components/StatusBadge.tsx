import React from 'react';

const statusMap: Record<string, { label: string; color: string }> = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  interview: { label: 'Interview', color: 'bg-green-100 text-green-700' },
  offer: { label: 'Offer', color: 'bg-purple-100 text-purple-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' },
};

export function StatusBadge({ status }: { status?: string | null }) {
  const s = status?.toLowerCase() || 'pending';
  const badge = statusMap[s] || { label: s, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>
  );
} 