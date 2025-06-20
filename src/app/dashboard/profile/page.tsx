"use client";
import { useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message);
    else setMessage('Password updated!');
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (!user) return <div>Please log in.</div>;

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <div className="font-semibold">Email:</div>
        <div>{user.email}</div>
      </div>
      <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 mb-6">
        <label className="font-semibold">Change Password</label>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input input-bordered"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
      <button onClick={handleSignOut} className="btn btn-secondary w-full">Sign Out</button>
    </main>
  );
} 