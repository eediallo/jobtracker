import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 p-4 shadow-md flex gap-4 items-center bg-white">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
        {/* Placeholder for company logo or initials */}
        {job.company?.[0]?.toUpperCase() || <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-base text-gray-900 truncate mb-0.5">{job.position}</div>
        <div className="text-sm text-gray-600 truncate mb-0.5">{job.company} <span className="text-gray-400">- {job.city}</span></div>
        <div className="text-xs text-gray-400 mb-1">{job.application_date}</div>
        <StatusBadge status={job.status} />
      </div>
      <div className="flex flex-col gap-2 ml-2">
        <button title="Edit" onClick={() => onEdit(job.id)} className="p-2 rounded hover:bg-blue-100 text-blue-600 transition-colors" aria-label="Edit job">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" /></svg>
        </button>
        <button title="Delete" onClick={() => onDelete(job.id)} className="p-2 rounded hover:bg-red-100 text-red-600 transition-colors" aria-label="Delete job">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
} 