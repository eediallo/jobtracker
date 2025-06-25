"use client";
import Link from 'next/link';
import { useAuth } from '@/lib/auth-provider';
import Image from 'next/image';

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
    text: 'JobsTracker made my job search so much less stressful. I landed my dream job in 2 months!',
    avatar: '/vercel.svg',
  },
  {
    name: 'Samira K.',
    text: 'The analytics and reminders kept me on track. Highly recommend for any job seeker!',
    avatar: '/globe.svg',
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
            JobsTracker helps you organize, analyze, and win your job hunt.
          </p>
          <Link href="/auth/register" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 animate-bounce">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f) => (
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
          Why JobsTracker?
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b) => (
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
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 shadow-lg border border-white/20 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
              <Image src={t.avatar} alt={t.name} width={56} height={56} className="w-14 h-14 rounded-full mb-3 border-2 border-fuchsia-400 shadow" />
              <p className="text-gray-800 dark:text-gray-200 italic mb-2">&quot;{t.text}&quot;</p>
              <span className="font-bold text-gray-900 dark:text-white">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <footer className="w-full bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 dark:from-fuchsia-400 dark:via-blue-400 dark:to-emerald-400 text-white pt-12 pb-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:justify-between gap-8">
          {/* Brand and CTA */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-extrabold tracking-tight">JobsTracker</span>
            </div>
            <p className="text-white/80 text-sm max-w-xs text-center md:text-left">Effortlessly track, manage, and analyze your job search process.</p>
            <Link href="/auth/register" className="mt-3 inline-block px-6 py-2 rounded-full bg-white/90 text-blue-700 font-bold text-base shadow hover:bg-white transition-all duration-200">Get Started</Link>
          </div>
          {/* Navigation */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-2">
            <span className="font-semibold mb-1">Navigation</span>
            <div className="flex flex-col gap-1 text-white/90 text-sm">
              <Link href="/">Home</Link>
              <Link href="#features">Features</Link>
              <Link href="#benefits">Benefits</Link>
              <Link href="#testimonials">Testimonials</Link>
              <Link href="/auth/register">Sign Up</Link>
              <Link href="mailto:support@jobstracker.com">Contact</Link>
            </div>
          </div>
          {/* Legal & Social */}
          <div className="flex-1 flex flex-col items-center md:items-end gap-2">
            <span className="font-semibold mb-1">Connect</span>
            <div className="flex gap-3 mb-2">
              <a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter" className="hover:text-blue-200"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.39-.22-1.98-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.12 2.94 3.99 2.97A8.6 8.6 0 012 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 006.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022.46 6z"/></svg></a>
              <a href="https://github.com/" target="_blank" rel="noopener" aria-label="GitHub" className="hover:text-blue-200"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.11 2.51.32 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"/></svg></a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn" className="hover:text-blue-200"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg></a>
            </div>
            <div className="text-xs text-white/70">&copy; {new Date().getFullYear()} JobsTracker. All rights reserved.<br/>
              <Link href="/privacy-policy" className="underline hover:text-white ml-1">Privacy Policy</Link> &middot; <Link href="/terms-of-service" className="underline hover:text-white ml-1">Terms of Service</Link>
            </div>
            <div className="text-xs text-white/60 mt-2">Contact: <a href="mailto:support@jobstracker.com" className="underline hover:text-white">support@jobstracker.com</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
