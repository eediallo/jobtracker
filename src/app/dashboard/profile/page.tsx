"use client";
import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

function getInitials(email?: string | null) {
  if (!email) return '?';
  const [name] = email.split('@');
  return name.slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [notif, setNotif] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast.error('Failed to update password');
    } else {
      setMessage('Password updated!');
      toast.success('Password updated!');
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success('Signed out');
    window.location.href = '/';
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
      toast.success('Avatar updated!');
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    // Placeholder: implement actual delete logic
    toast.success('Account deleted (demo only)');
  }

  if (!user) return <div>Please log in.</div>;

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-8">
        {/* Left: Avatar & Info */}
        <div className="flex flex-col items-center md:w-1/3 gap-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 overflow-hidden shadow-lg cursor-pointer border-4 border-white group-hover:shadow-2xl transition-all" onClick={() => fileInput.current?.click()}>
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(user.email)
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 16v-4m0 0V8m0 4h4m-4 0H8" /></svg>
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInput} onChange={handleAvatarChange} />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.email}</div>
          <button onClick={() => setEdit(e => !e)} className="btn btn-secondary w-full mt-2">{edit ? 'Cancel' : 'Edit Profile'}</button>
        </div>
        {/* Right: Editable Fields & Settings */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Editable Fields */}
          <form onSubmit={handlePasswordChange} className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-end transition-all ${edit ? '' : 'pointer-events-none opacity-70'}`} style={{ pointerEvents: loading ? 'none' : undefined, opacity: loading ? 0.7 : undefined }}>
            <div className="col-span-2 font-semibold text-gray-700 dark:text-gray-200">Change Password</div>
            <div className="relative">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg border-gray-300 dark:border-gray-700 h-12"
                required
                disabled={loading || !edit}
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-white dark:bg-gray-900 px-1 pointer-events-none">New Password <span className="text-red-500">*</span></label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1" disabled={loading || !edit}>{loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : null}{loading ? 'Updating...' : 'Update Password'}</button>
              {edit && <button type="button" className="btn btn-secondary flex-1" onClick={() => { setEdit(false); setPassword(''); setError(''); setMessage(''); }}>Cancel</button>}
            </div>
            {error && <div className="col-span-2 flex items-center gap-2 text-red-500 text-sm mt-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>{error}</div>}
            {message && <div className="col-span-2 text-green-600 text-sm mt-1">{message}</div>}
          </form>
          {/* Settings */}
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Settings</div>
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <button type="button" className={`w-12 h-6 rounded-full transition-colors ${notif ? 'bg-[#007bff]' : 'bg-gray-300'} relative focus:outline-none`} onClick={() => setNotif(n => !n)}>
                <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${notif ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Private Profile</span>
              <button type="button" className={`w-12 h-6 rounded-full transition-colors ${privacy ? 'bg-[#28a745]' : 'bg-gray-300'} relative focus:outline-none`} onClick={() => setPrivacy(p => !p)}>
                <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${privacy ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
          </div>
          {/* Security Section */}
          <div className="border-t pt-6 mt-4 flex flex-col gap-4">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Security</div>
            <button onClick={handleSignOut} className="btn btn-secondary w-full">Sign Out</button>
          </div>
          {/* Danger Zone */}
          <div className="border-t pt-6 mt-4 flex flex-col gap-4">
            <div className="font-semibold text-red-600 mb-2">Danger Zone</div>
            <button onClick={handleDeleteAccount} className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-all">Delete Account</button>
          </div>
        </div>
      </div>
    </main>
  );
} 