"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import type { Job } from '@/lib/types';
import Link from 'next/link';

export default function MyJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('application_date', { ascending: false })
      .then(({ data }) => {
        setJobs(data || []);
        setLoading(false);
      });
  }, [user]);

  function handleDelete(id: number) {
    if (!confirm('Delete this job?')) return;
    supabase.from('jobs').delete().eq('id', id).then(() => {
      setJobs(jobs => jobs.filter(j => j.id !== id));
    });
  }

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
      {/* Table view for desktop */}
      <div className="hidden md:block">
        <table className="w-full border">
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
            {jobs.map(job => (
              <tr key={job.id} className="border-t">
                <td className="p-2">{job.position}</td>
                <td className="p-2">{job.company}</td>
                <td className="p-2">{job.city}</td>
                <td className="p-2">{job.application_date}</td>
                <td className="p-2">{job.status}</td>
                <td className="p-2 flex gap-2">
                  <Link href={`/dashboard/my-jobs/edit/${job.id}`} className="btn btn-xs btn-secondary">Edit</Link>
                  <button className="btn btn-xs btn-danger" onClick={() => handleDelete(job.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Card view for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {jobs.map(job => (
          <div key={job.id} className="rounded border p-4 shadow-sm">
            <div className="font-bold">{job.position}</div>
            <div className="text-sm text-gray-500">{job.company} - {job.city}</div>
            <div className="text-xs text-gray-400">{job.application_date}</div>
            <div className="mt-2">Status: <span className="font-semibold">{job.status}</span></div>
            <div className="flex gap-2 mt-2">
              <Link href={`/dashboard/my-jobs/edit/${job.id}`} className="btn btn-xs btn-secondary">Edit</Link>
              <button className="btn btn-xs btn-danger" onClick={() => handleDelete(job.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 