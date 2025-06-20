import React from 'react';

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  applied: { label: 'Applied', bg: 'bg-[#007bff]', text: 'text-white' },
  interview: { label: 'Interview', bg: 'bg-[#28a745]', text: 'text-white' },
  offer: { label: 'Offer', bg: 'bg-purple-600', text: 'text-white' },
  rejected: { label: 'Rejected', bg: 'bg-[#dc3545]', text: 'text-white' },
  pending: { label: 'Pending', bg: 'bg-[#ffc107]', text: 'text-white' },
  accepted: { label: 'Accepted', bg: 'bg-emerald-600', text: 'text-white' },
};

export function StatusBadge({ status }: { status?: string | null }) {
  const s = status?.toLowerCase() || 'pending';
  const badge = statusMap[s] || { label: s, bg: 'bg-gray-400', text: 'text-white' };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} shadow-sm`} style={{letterSpacing: 0.2}}>{badge.label}</span>
  );
} 