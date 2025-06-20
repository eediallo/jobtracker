"use client";
import Link from 'next/link';
import { useAuth } from '@/lib/auth-provider';

const features = [
  {
    title: 'Job Tracking',
    desc: 'Easily log and manage all your job applications in one place.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
    ),
  },
  {
    title: 'Statistics',
    desc: 'Visualize your progress with insightful analytics and charts.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" /></svg>
    ),
  },
  {
    title: 'Organization',
    desc: 'Stay organized with tags, notes, and custom statuses.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
    ),
  },
  {
    title: 'Profile Management',
    desc: 'Manage your account, privacy, and personal details securely.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
    ),
  },
];

const benefits = [
  'Never lose track of an application',
  'Visualize your job search progress',
  'Stay organized and focused',
  'Secure, private, and always accessible',
];

const testimonials = [
  {
    name: 'Alex J.',
    text: 'JobTracker made my job search so much less stressful. I landed my dream job in 2 months!',
    avatar: '/public/vercel.svg',
  },
  {
    name: 'Samira K.',
    text: 'The analytics and reminders kept me on track. Highly recommend for any job seeker!',
    avatar: '/public/globe.svg',
  },
];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-fuchsia-600 to-emerald-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-96 h-96 bg-white/10 rounded-full blur-3xl absolute -top-32 -left-32 animate-pulse" />
          <div className="w-96 h-96 bg-fuchsia-400/10 rounded-full blur-2xl absolute top-32 right-0 animate-pulse" />
        </div>
        <div className="relative z-10 max-w-2xl w-full text-center p-8 rounded-2xl bg-white/70 dark:bg-gray-900/70 shadow-xl backdrop-blur-md border border-white/20">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 dark:from-fuchsia-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4 animate-fade-in">
            Simplify Your Job Search. Track Every Opportunity.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 animate-fade-in delay-100">
            JobTracker helps you organize, analyze, and win your job hunt.
          </p>
          <Link href="/auth/register" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 animate-bounce">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <div key={f.title} className="group bg-white/60 dark:bg-gray-900/60 rounded-xl p-6 shadow-lg backdrop-blur-md border border-white/20 flex items-center gap-4 hover:scale-105 hover:shadow-2xl transition-all duration-200">
            <div className="flex-shrink-0 group-hover:rotate-6 transition-transform duration-200">
              {f.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-base">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Benefits Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 dark:from-fuchsia-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
          Why JobTracker?
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b, i) => (
            <li key={b} className="flex items-center gap-3 bg-white/60 dark:bg-gray-900/60 rounded-lg p-4 shadow backdrop-blur border border-white/20 hover:scale-105 transition-transform duration-200">
              <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 mr-2 animate-pulse" />
              <span className="text-gray-900 dark:text-white font-medium">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 dark:from-fuchsia-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={t.name} className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-lg border border-white/20 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
              <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full mb-3 border-2 border-fuchsia-400 shadow" />
              <p className="text-gray-800 dark:text-gray-200 italic mb-2">"{t.text}"</p>
              <span className="font-bold text-gray-900 dark:text-white">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <footer className="w-full py-8 flex flex-col items-center bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 dark:from-fuchsia-400 dark:via-blue-400 dark:to-emerald-400">
        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Ready to land your dream job?</h3>
        <Link href="/auth/register" className="px-8 py-3 rounded-full bg-white/90 text-blue-700 font-bold text-lg shadow-lg hover:bg-white transition-all duration-200">
          Sign Up Now
        </Link>
      </footer>
    </div>
  );
}
