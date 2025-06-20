import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { Job } from '@/lib/types';

interface JobTableProps {
  jobs: Job[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const columns = [
  { key: 'position', label: 'Position' },
  { key: 'company', label: 'Company' },
  { key: 'city', label: 'City' },
  { key: 'application_date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

export function JobTable({ jobs, onEdit, onDelete }: JobTableProps) {
  // For now, just UI for sortable headers
  const [sortCol, setSortCol] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  return (
    <table className="w-full border rounded-xl overflow-hidden text-sm">
      <thead>
        <tr className="bg-[#f8f9fa] text-gray-700">
          {columns.map(col => (
            <th
              key={col.key}
              className="p-3 font-semibold text-left select-none cursor-pointer transition-colors hover:bg-blue-50 group"
              onClick={() => handleSort(col.key)}
            >
              <span className="flex items-center gap-1">
                {col.label}
                <span className="opacity-60 group-hover:opacity-100 transition">
                  {sortCol === col.key ? (
                    sortDir === 'asc' ? (
                      <svg className="w-3 h-3 inline" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6l-4 4h8l-4-4z" /></svg>
                    ) : (
                      <svg className="w-3 h-3 inline" viewBox="0 0 20 20" fill="currentColor"><path d="M10 14l4-4H6l4 4z" /></svg>
                    )
                  ) : (
                    <svg className="w-3 h-3 inline opacity-0 group-hover:opacity-40" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6l-4 4h8l-4-4z" /></svg>
                  )}
                </span>
              </span>
            </th>
          ))}
          <th className="p-3 font-semibold text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job, i) => (
          <tr
            key={job.id}
            className={`transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'} hover:bg-blue-50`}
            style={{ borderBottom: '1px solid #e5e7eb' }}
          >
            <td className="p-3 font-medium text-gray-900" style={{fontSize:'1rem'}}>{job.position}</td>
            <td className="p-3 text-gray-700">{job.company}</td>
            <td className="p-3 text-gray-700">{job.city}</td>
            <td className="p-3 text-gray-700">{job.application_date}</td>
            <td className="p-3"><StatusBadge status={job.status} /></td>
            <td className="p-3 flex gap-2">
              <button title="Edit" onClick={() => onEdit(job.id)} className="p-2 rounded hover:bg-blue-100 text-blue-600 transition-colors" aria-label="Edit job">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" /></svg>
              </button>
              <button title="Delete" onClick={() => onDelete(job.id)} className="p-2 rounded hover:bg-red-100 text-red-600 transition-colors" aria-label="Delete job">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 