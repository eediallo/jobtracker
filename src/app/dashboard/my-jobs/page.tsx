"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import type { Job } from '@/lib/types';
import { toast } from 'sonner';
import { JobTable } from '@/components/JobTable';
import { JobCard } from '@/components/JobCard';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';

export default function MyJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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
    setConfirmDelete(id);
  }

  function confirmDeleteJob() {
    if (!confirmDelete) return;
    supabase.from('jobs').delete().eq('id', confirmDelete).then(({ error }) => {
      if (error) {
        toast.error('Failed to delete job');
      } else {
        setJobs(jobs => jobs.filter(j => j.id !== confirmDelete));
        toast.success('Job deleted');
      }
      setConfirmDelete(null);
    });
  }

  function handleEdit(id: number) {
    window.location.href = `/dashboard/my-jobs/edit/${id}`;
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
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left w-full block">My Applications</h1>
      <div className="flex flex-col md:flex-row gap-2 mb-4 mt-8 md:mt-0 justify-center items-center">
        <input
          type="text"
          placeholder="Search by position, company, or city"
          className="input input-bordered w-full max-w-xs md:w-1/3"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="input input-bordered w-full max-w-xs md:w-40"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
        {(search || status) && (
          <button
            className="btn btn-secondary"
            onClick={() => { setSearch(''); setStatus(''); }}
            aria-label="Clear search and filters"
          >
            Clear
          </button>
        )}
      </div>
      {/* Table view for desktop */}
      <div className="hidden md:block">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <JobTable jobs={filteredJobs} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <EmptyState
            message="No jobs found. Start tracking your applications!"
            ctaLabel="Add your first job"
            onCta={() => window.location.href = '/dashboard/add-job'}
          />
        )}
      </div>
      {/* Card view for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <EmptyState
            message="No jobs found. Start tracking your applications!"
            ctaLabel="Add your first job"
            onCta={() => window.location.href = '/dashboard/add-job'}
          />
        )}
      </div>
      {/* Confirmation dialog for delete */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <div className="font-semibold mb-2">Delete this job?</div>
            <div className="text-gray-600 mb-4">This action cannot be undone.</div>
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDeleteJob}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 