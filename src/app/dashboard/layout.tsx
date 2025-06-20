"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const tabs = [
  { name: 'My Jobs', href: '/dashboard/my-jobs', icon: (
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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-fuchsia-50 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white/80 dark:bg-gray-900/80 shadow-xl border-r border-white/20 z-20">
        <div className="flex items-center justify-center h-20 font-extrabold text-xl bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 dark:from-fuchsia-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent select-none">JobTracker</div>
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
              {pathname.startsWith(tab.href) && <span className="ml-auto w-2 h-2 rounded-full bg-white/80 animate-pulse" />}
            </Link>
          ))}
        </nav>
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
        <div className={`absolute left-0 top-0 h-full w-64 bg-white/90 dark:bg-gray-900/90 shadow-xl border-r border-white/20 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-center h-20 font-extrabold text-xl bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 dark:from-fuchsia-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent select-none">JobTracker</div>
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
                {pathname.startsWith(tab.href) && <span className="ml-auto w-2 h-2 rounded-full bg-white/80 animate-pulse" />}
              </Link>
            ))}
          </nav>
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