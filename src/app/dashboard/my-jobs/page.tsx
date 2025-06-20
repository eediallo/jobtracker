"use client";
import { useEffect, useState, useRef } from 'react';
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
  const [cv, setCv] = useState<{ name: string, url: string } | null>(null);
  const [coverLetter, setCoverLetter] = useState<{ name: string, url: string } | null>(null);
  const [uploading, setUploading] = useState<'cv' | 'cl' | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const clInputRef = useRef<HTMLInputElement>(null);

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

    if (user.user_metadata) {
      if (user.user_metadata.cv_url) {
        setCv({ name: user.user_metadata.cv_name || 'Curriculum Vitae', url: user.user_metadata.cv_url });
      }
      if (user.user_metadata.cl_url) {
        setCoverLetter({ name: user.user_metadata.cl_name || 'Cover Letter', url: user.user_metadata.cl_url });
      }
    }
  }, [user]);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'cl') {
    if (!user || !event.target.files?.length) return;
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${type}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    setUploading(type);

    const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) {
      toast.error(`Failed to upload ${type === 'cv' ? 'CV' : 'Cover Letter'}`);
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);

    const { error: updateUserError } = await supabase.auth.updateUser({
      data: {
        [`${type}_url`]: publicUrl,
        [`${type}_name`]: file.name,
      }
    });

    setUploading(null);

    if (updateUserError) {
      toast.error('Failed to update profile.');
    } else {
      if (type === 'cv') {
        setCv({ name: file.name, url: publicUrl });
      } else {
        setCoverLetter({ name: file.name, url: publicUrl });
      }
      toast.success(`${type === 'cv' ? 'CV' : 'Cover Letter'} uploaded successfully!`);
    }
  }

  async function handleFileRemove(type: 'cv' | 'cl') {
    if (!user) return;

    const key_url = `${type}_url`;
    const key_name = `${type}_name`;
    const fileUrl = user.user_metadata[key_url];
    if (!fileUrl) return;

    const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    const { error: removeError } = await supabase.storage.from('documents').remove([`${user.id}/${fileName}`]);

    if (removeError) {
      toast.error(`Failed to remove ${type === 'cv' ? 'CV' : 'Cover Letter'}`);
      return;
    }

    const { error: updateUserError } = await supabase.auth.updateUser({
      data: {
        [key_url]: null,
        [key_name]: null,
      }
    });

    if (updateUserError) {
      toast.error('Failed to update profile.');
    } else {
      if (type === 'cv') setCv(null);
      else setCoverLetter(null);
      toast.success(`${type === 'cv' ? 'CV' : 'Cover Letter'} removed.`);
    }
  }

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
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>

      {/* Documents Section */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">My Documents</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* CV */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Curriculum Vitae (CV)</h3>
            {cv ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <a href={cv.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <span>{cv.name}</span>
                </a>
                <button onClick={() => handleFileRemove('cv')} className="p-1 text-red-500 hover:text-red-700" title="Remove CV">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">No CV uploaded.</div>
            )}
            <button onClick={() => cvInputRef.current?.click()} className="btn btn-secondary btn-sm mt-1" disabled={uploading === 'cv'}>
              {uploading === 'cv' ? 'Uploading...' : cv ? 'Replace CV' : 'Upload CV'}
            </button>
            <input type="file" ref={cvInputRef} onChange={(e) => handleFileUpload(e, 'cv')} className="hidden" accept=".pdf,.doc,.docx" />
          </div>
          {/* Cover Letter */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Cover Letter</h3>
            {coverLetter ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <a href={coverLetter.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <span>{coverLetter.name}</span>
                </a>
                <button onClick={() => handleFileRemove('cl')} className="p-1 text-red-500 hover:text-red-700" title="Remove Cover Letter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">No Cover Letter uploaded.</div>
            )}
            <button onClick={() => clInputRef.current?.click()} className="btn btn-secondary btn-sm mt-1" disabled={uploading === 'cl'}>
              {uploading === 'cl' ? 'Uploading...' : coverLetter ? 'Replace Letter' : 'Upload Letter'}
            </button>
            <input type="file" ref={clInputRef} onChange={(e) => handleFileUpload(e, 'cl')} className="hidden" accept=".pdf,.doc,.docx" />
          </div>
        </div>
      </div>

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