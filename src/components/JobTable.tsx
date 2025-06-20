import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Job } from '@/lib/types';

interface JobTableProps {
  jobs: Job[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function JobTable({ jobs, onEdit, onDelete }: JobTableProps) {
  return (
    <table className="w-full border rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Position</th>
          <th className="p-2">Company</th>
          <th className="p-2">City</th>
          <th className="p-2">Date</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job, i) => (
          <tr key={job.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="p-2 font-medium">{job.position}</td>
            <td className="p-2">{job.company}</td>
            <td className="p-2">{job.city}</td>
            <td className="p-2">{job.application_date}</td>
            <td className="p-2"><StatusBadge status={job.status} /></td>
            <td className="p-2 flex gap-2">
              <button title="Edit" onClick={() => onEdit(job.id)} className="p-1 rounded hover:bg-blue-100 text-blue-600" aria-label="Edit job">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" /></svg>
              </button>
              <button title="Delete" onClick={() => onDelete(job.id)} className="p-1 rounded hover:bg-red-100 text-red-600" aria-label="Delete job">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 