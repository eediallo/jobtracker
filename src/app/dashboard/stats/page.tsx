"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import type { Job } from '@/lib/types';

const statusLabels = ['applied', 'interview', 'offer', 'rejected', 'accepted'];

export default function StatsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setJobs(data || []);
        setLoading(false);
      });
  }, [user]);

  if (!user) return <div>Please log in.</div>;
  if (loading) return <div>Loading...</div>;

  const total = jobs.length;
  const byStatus = Object.fromEntries(statusLabels.map(s => [s, 0]));
  jobs.forEach(job => {
    if (job.status && byStatus[job.status] !== undefined) byStatus[job.status]++;
  });
  const recent = jobs.slice().sort((a, b) => (b.application_date || '').localeCompare(a.application_date || '')).slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stats</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="p-4 bg-gray-100 rounded text-center">
          <div className="text-lg font-bold">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        {statusLabels.map(s => (
          <div key={s} className="p-4 bg-gray-100 rounded text-center">
            <div className="text-lg font-bold">{byStatus[s]}</div>
            <div className="text-xs text-gray-500">{s.charAt(0).toUpperCase() + s.slice(1)}</div>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-semibold mb-2">Recent Applications</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Position</th>
            <th className="p-2">Company</th>
            <th className="p-2">City</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {recent.map(job => (
            <tr key={job.id} className="border-t">
              <td className="p-2">{job.position}</td>
              <td className="p-2">{job.company}</td>
              <td className="p-2">{job.city}</td>
              <td className="p-2">{job.application_date}</td>
              <td className="p-2">{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 