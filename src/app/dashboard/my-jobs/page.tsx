"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import type { Job } from '@/lib/types';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MyJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
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
    supabase.from('jobs').delete().eq('id', id).then(({ error }) => {
      if (error) {
        toast.error('Failed to delete job');
      } else {
        setJobs(jobs => jobs.filter(j => j.id !== id));
        toast.success('Job deleted');
      }
    });
  }

  function filterJobs(jobs: Job[]) {
    return jobs.filter(job => {
      const matchesSearch =
        !search ||
        job.position?.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase()) ||
        job.city?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || job.status === status;
      return matchesSearch && matchesStatus;
    });
  }

  const statusOptions = ['applied', 'interview', 'offer', 'rejected', 'accepted'];
  const filteredJobs = filterJobs(jobs);

  if (!user) return <div>Please log in.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by position, company, or city"
          className="input input-bordered w-full md:w-1/3"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="input input-bordered w-full md:w-40"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
      </div>
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
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t animate-pulse">
                    <td className="p-2"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                    <td className="p-2"><div className="h-8 bg-gray-200 rounded w-20" /></td>
                  </tr>
                ))
              : filteredJobs.map(job => (
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
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center text-gray-500 py-8">No jobs found.</div>
        )}
      </div>
      {/* Card view for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded border p-4 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
                <div className="flex gap-2 mt-2">
                  <div className="h-8 bg-gray-200 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))
          : filteredJobs.map(job => (
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
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center text-gray-500 py-8">No jobs found.</div>
        )}
      </div>
    </div>
  );
} 