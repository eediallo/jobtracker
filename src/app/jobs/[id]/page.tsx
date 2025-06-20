import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const { data: jobs } = await supabase.from('jobs').select('id');
  return (
    jobs?.map(job => ({ id: job.id.toString() })) || []
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to jobs</Link>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        <div className="text-gray-500 mb-4">{job.location}</div>
        <div className="mb-4">
          <h2 className="font-semibold mb-1">Description</h2>
          <p>{job.description}</p>
        </div>
        {job.details && (
          <div className="mb-4">
            <h2 className="font-semibold mb-1">Details</h2>
            <p>{job.details}</p>
          </div>
        )}
        <div className="text-xs text-gray-400 mt-6">Posted: {job.created_at ? new Date(job.created_at).toLocaleString() : 'Unknown'}</div>
      </div>
    </main>
  );
} 