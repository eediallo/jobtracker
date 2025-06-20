import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <nav className="bg-gray-100 md:w-64 w-full flex md:flex-col flex-row md:h-auto h-16 border-b md:border-b-0 md:border-r">
        <Link href="/dashboard/my-jobs" className="p-4 block hover:bg-gray-200">My Jobs</Link>
        <Link href="/dashboard/add-job" className="p-4 block hover:bg-gray-200">Add Job</Link>
        <Link href="/dashboard/stats" className="p-4 block hover:bg-gray-200">Stats</Link>
        <Link href="/dashboard/profile" className="p-4 block hover:bg-gray-200">Profile</Link>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
} 