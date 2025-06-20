"use client";
import Link from 'next/link';
import { useAuth } from '@/lib/auth-provider';

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;
  if (user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return null;
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Job Tracker</h1>
      <div className="flex gap-4">
        <Link href="/auth/login" className="btn btn-primary">Login</Link>
        <Link href="/auth/register" className="btn btn-secondary">Register</Link>
      </div>
    </main>
  );
}
