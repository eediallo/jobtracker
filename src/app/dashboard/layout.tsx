"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { Toaster } from 'sonner';

const tabs = [
  { name: 'My Applications', href: '/dashboard/my-jobs', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
  ) },
  { name: 'Add Job', href: '/dashboard/add-job', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
  ) },
  { name: 'Stats', href: '/dashboard/stats', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" /></svg>
  ) },
  { name: 'Profile', href: '/dashboard/profile', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
  ) },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    // sign out and redirect
    import('@/lib/supabase').then(({ supabase }) => {
      supabase.auth.signOut().then(() => {
        router.push('/');
      });
    });
  }

  function getInitials(email?: string | null) {
    if (!email) return '?';
    const [name] = email.split('@');
    return name.slice(0, 2).toUpperCase();
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-fuchsia-50 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Toaster position="top-right" richColors closeButton />
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white/70 dark:bg-gray-900/70 shadow-2xl border-r border-white/20 z-20 backdrop-blur-lg">
        <div className="flex flex-col items-center justify-center h-28 gap-2 select-none">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-fuchsia-400 to-emerald-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {getInitials(user?.email)}
          </div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[90%]">{user?.email}</div>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-4">
          {tabs.map(tab => (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 group
                ${pathname.startsWith(tab.href) ? 'bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 text-white shadow-lg scale-105' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="transition-transform duration-200 group-hover:scale-110">{tab.icon}</span>
              <span>{tab.name}</span>
              {tab.name === 'Profile' && (
                <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
              )}
              {pathname.startsWith(tab.href) && <span className="ml-auto w-2 h-2 rounded-full bg-white/80 animate-pulse" />}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 flex flex-col gap-2">
          <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-blue-600 text-white font-semibold shadow hover:scale-105 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setSidebarOpen(v => !v)}
        aria-label="Open navigation"
      >
        <svg className="w-7 h-7 text-blue-600 dark:text-fuchsia-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Sidebar for mobile */}
      <aside className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      >
        <div className={`absolute left-0 top-0 h-full w-64 bg-white/90 dark:bg-gray-900/90 shadow-2xl border-r border-white/20 transform transition-transform duration-300 backdrop-blur-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center h-28 gap-2 select-none">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-fuchsia-400 to-emerald-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {getInitials(user?.email)}
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[90%]">{user?.email}</div>
          </div>
          <nav className="flex-1 flex flex-col gap-2 p-4">
            {tabs.map(tab => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 group
                  ${pathname.startsWith(tab.href) ? 'bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 text-white shadow-lg scale-105' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="transition-transform duration-200 group-hover:scale-110">{tab.icon}</span>
                <span>{tab.name}</span>
                {tab.name === 'Profile' && (
                  <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
                )}
                {pathname.startsWith(tab.href) && <span className="ml-auto w-2 h-2 rounded-full bg-white/80 animate-pulse" />}
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-4 flex flex-col gap-2">
            <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-blue-600 text-white font-semibold shadow hover:scale-105 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 bg-transparent">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 