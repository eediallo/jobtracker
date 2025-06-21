"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{email: boolean; password: boolean}>({email: false, password: false});
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const router = useRouter();

  const emailValid = email.length > 3 && email.includes('@');
  const passwordValid = password.length >= 6;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setTouched({email: true, password: true});
    if (!emailValid || !passwordValid) return;
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/confirm`,
      }
    });
    setLoading(false);
    if (error) {
      if (error.message.includes('User already registered')) {
        toast.info('An account with this email already exists. Redirecting to login...');
        supabase.auth.signOut();
        router.push('/auth/login');
      } else {
        toast.error(error.message);
      }
    } else {
      setShowConfirmationMessage(true);
    }
  }

  if (showConfirmationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Confirm your email</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We've sent a confirmation link to <strong>{email}</strong>. Please check your inbox and follow the link to complete your registration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-fuchsia-600 to-emerald-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-2">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/70 dark:bg-gray-900/80 backdrop-blur-md border border-white/20">
        <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 dark:from-fuchsia-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">Create your account</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-6 animate-fade-in">
          {/* Email */}
          <div className="relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(t => ({...t, email: true}))}
              className={`peer w-full px-4 pt-6 pb-2 rounded-lg border-2 bg-white/80 dark:bg-gray-800/80 outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-fuchsia-400 shadow-sm ${touched.email && !emailValid ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              required
              aria-invalid={touched.email && !emailValid}
              aria-describedby="email-error"
            />
            <label htmlFor="email" className="absolute left-4 top-2 text-gray-500 text-sm pointer-events-none transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-blue-600 dark:peer-focus:text-fuchsia-400 peer-valid:-translate-y-2 peer-valid:scale-90 bg-white/80 dark:bg-gray-800/80 px-1 rounded">
              Email
            </label>
            {touched.email && !emailValid && (
              <span id="email-error" className="text-xs text-red-500 mt-1 block">Enter a valid email address</span>
            )}
          </div>
          {/* Password */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={() => setTouched(t => ({...t, password: true}))}
              className={`peer w-full px-4 pt-6 pb-2 rounded-lg border-2 bg-white/80 dark:bg-gray-800/80 outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-fuchsia-400 shadow-sm ${touched.password && !passwordValid ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              required
              aria-invalid={touched.password && !passwordValid}
              aria-describedby="password-error"
            />
            <label htmlFor="password" className="absolute left-4 top-2 text-gray-500 text-sm pointer-events-none transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-blue-600 dark:peer-focus:text-fuchsia-400 peer-valid:-translate-y-2 peer-valid:scale-90 bg-white/80 dark:bg-gray-800/80 px-1 rounded">
              Password
            </label>
            <button type="button" tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 dark:hover:text-fuchsia-400 transition-colors">
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.13 0 2.21.19 3.22.54M19.07 4.93A9.97 9.97 0 0121 12c0 1.61-.39 3.13-1.08 4.44M9.88 9.88a3 3 0 104.24 4.24" /><path d="M3 3l18 18" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
            {touched.password && !passwordValid && (
              <span id="password-error" className="text-xs text-red-500 mt-1 block">Password must be at least 6 characters</span>
            )}
          </div>
          {/* Confirm Password */}
          <div className="relative">
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched(t => ({...t, password: true}))}
              className={`peer w-full px-4 pt-6 pb-2 rounded-lg border-2 bg-white/80 dark:bg-gray-800/80 outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-fuchsia-400 shadow-sm ${touched.password && password !== confirmPassword ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              required
              aria-invalid={touched.password && password !== confirmPassword}
              aria-describedby="confirm-password-error"
            />
            <label htmlFor="confirmPassword" className="absolute left-4 top-2 text-gray-500 text-sm pointer-events-none transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-blue-600 dark:peer-focus:text-fuchsia-400 peer-valid:-translate-y-2 peer-valid:scale-90 bg-white/80 dark:bg-gray-800/80 px-1 rounded">
              Confirm Password
            </label>
            {touched.password && password !== confirmPassword && (
              <span id="confirm-password-error" className="text-xs text-red-500 mt-1 block">Passwords do not match</span>
            )}
          </div>
          {error && <div className="text-red-500 text-sm animate-shake">{error}</div>}
          <button type="submit" className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading || !emailValid || !passwordValid || password !== confirmPassword}>
            {loading && <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>}
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 dark:text-fuchsia-400 font-bold hover:underline transition-colors">Login</a>
        </div>
      </div>
    </div>
  );
} 