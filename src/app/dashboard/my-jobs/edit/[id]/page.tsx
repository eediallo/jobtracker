"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';

const statusOptions = ['applied', 'interview', 'offer', 'rejected', 'accepted'];

export default function EditJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [form, setForm] = useState({
    position: '',
    company: '',
    city: '',
    application_date: '',
    status: 'applied',
    description: '',
    details: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError('Job not found');
        } else {
          setForm({
            position: data.position || '',
            company: data.company || '',
            city: data.city || '',
            application_date: data.application_date || '',
            status: data.status || 'applied',
            description: data.description || '',
            details: data.details || '',
          });
        }
        setLoading(false);
      });
  }, [user, id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.from('jobs').update(form).eq('id', id).eq('user_id', user.id);
    setLoading(false);
    if (error) setError(error.message);
    else router.push('/dashboard/my-jobs');
  }

  if (!user) return <div>Please log in.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="position" value={form.position} onChange={handleChange} placeholder="Position" className="input input-bordered" required />
        <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="input input-bordered" required />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input input-bordered" required />
        <input name="application_date" value={form.application_date} onChange={handleChange} type="date" className="input input-bordered" required />
        <select name="status" value={form.status} onChange={handleChange} className="input input-bordered">
          {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input input-bordered" rows={2} />
        <textarea name="details" value={form.details} onChange={handleChange} placeholder="Details" className="input input-bordered" rows={3} />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </main>
  );
} 