import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Job } from '@/lib/types';

export default async function Page() {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Failed to load jobs: {error.message}</div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Job Board</h1>
      <div className="grid gap-6">
        {jobs && jobs.length > 0 ? (
          jobs.map((job: Job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6 group"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">{job.title}</h2>
                <p className="text-gray-600 line-clamp-2">{job.description}</p>
                <span className="text-sm text-gray-400 mt-2">{job.location}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-500">No jobs found.</div>
        )}
      </div>
    </main>
  );
}
