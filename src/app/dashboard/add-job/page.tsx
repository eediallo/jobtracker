"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';

const statusOptions = ['applied', 'interview', 'offer', 'rejected', 'accepted'];

export default function AddJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    position: '',
    company: '',
    city: '',
    application_date: '',
    status: 'applied',
    description: '',
    details: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to add a job.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.from('jobs').insert({
      ...form,
      user_id: user.id,
      title: form.position,
      location: form.city,
    });
    setLoading(false);
    if (error) setError(error.message);
    else router.push('/dashboard/my-jobs');
  }

  if (!user) return <div>Please log in.</div>;

  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Job</h1>
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
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Adding...' : 'Add Job'}</button>
      </form>
    </main>
  );
} 