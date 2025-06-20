"use client";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function getInitials(email?: string | null) {
  if (!email) return '?';
  const [name] = email.split('@');
  return name.slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [notif, setNotif] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [cv, setCv] = useState<{ name: string, url: string } | null>(null);
  const [coverLetter, setCoverLetter] = useState<{ name: string, url: string } | null>(null);
  const [uploading, setUploading] = useState<'cv' | 'cl' | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const clInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && user.user_metadata) {
      if (user.user_metadata.cv_url) {
        setCv({ name: user.user_metadata.cv_name || 'Curriculum Vitae', url: user.user_metadata.cv_url });
      }
      if (user.user_metadata.cl_url) {
        setCoverLetter({ name: user.user_metadata.cl_name || 'Cover Letter', url: user.user_metadata.cl_url });
      }
    }
  }, [user]);

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
    router.push('/');
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
        setAvatarLoading(false);
        toast.success('Avatar updated!');
      };
      reader.readAsDataURL(file);
    }
  }

  function handleDeleteAccount() {
    setShowDeleteModal(true);
  }

  function confirmDeleteAccount() {
    setShowDeleteModal(false);
    toast.success('Account deleted (demo only)');
    // Implement actual delete logic here
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'cl') {
    if (!user || !event.target.files?.length) return;
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${type}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    setUploading(type);

    const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) {
      toast.error(`Failed to upload ${type === 'cv' ? 'CV' : 'Cover Letter'}`);
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);

    const { error: updateUserError } = await supabase.auth.updateUser({
      data: {
        [`${type}_url`]: publicUrl,
        [`${type}_name`]: file.name,
      }
    });

    setUploading(null);

    if (updateUserError) {
      toast.error('Failed to update profile.');
    } else {
      if (type === 'cv') {
        setCv({ name: file.name, url: publicUrl });
      } else {
        setCoverLetter({ name: file.name, url: publicUrl });
      }
      toast.success(`${type === 'cv' ? 'CV' : 'Cover Letter'} uploaded successfully!`);
    }
  }

  async function handleFileRemove(type: 'cv' | 'cl') {
    if (!user) return;

    const key_url = `${type}_url`;
    const key_name = `${type}_name`;
    const fileUrl = user.user_metadata[key_url];
    if (!fileUrl) return;

    const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    const { error: removeError } = await supabase.storage.from('documents').remove([`${user.id}/${fileName}`]);

    if (removeError) {
      toast.error(`Failed to remove ${type === 'cv' ? 'CV' : 'Cover Letter'}`);
      return;
    }

    const { error: updateUserError } = await supabase.auth.updateUser({
      data: {
        [key_url]: null,
        [key_name]: null,
      }
    });

    if (updateUserError) {
      toast.error('Failed to update profile.');
    } else {
      if (type === 'cv') setCv(null);
      else setCoverLetter(null);
      toast.success(`${type === 'cv' ? 'CV' : 'Cover Letter'} removed.`);
    }
  }

  if (!user) return <div>Please log in.</div>;

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Profile</h1>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-10">
        {/* Left: Avatar & Info */}
        <div className="flex flex-col items-center md:w-1/3 gap-5">
          <div className="relative group">
            <div
              className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center text-4xl font-bold text-white overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 ring-2 ring-blue-200 dark:ring-blue-700 transition-all cursor-pointer group-hover:ring-4 group-hover:shadow-2xl"
              onClick={() => edit && fileInput.current?.click()}
              tabIndex={0}
              aria-label="Upload avatar"
              role="button"
            >
              {avatarLoading ? (
                <span className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(user.email)}</span>
              )}
              {edit && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0 0V8m0 4h4m-4 0H8" /><path d="M9 15l6-6" /></svg>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInput} onChange={handleAvatarChange} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.user_metadata?.name || 'User'}</span>
            <span className="text-base text-gray-500 dark:text-gray-400">{user.email}</span>
          </div>
          <button
            onClick={() => setEdit(e => !e)}
            className={`w-full mt-2 px-4 py-2 rounded-lg font-semibold transition-all shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ${edit ? 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            aria-pressed={edit}
          >
            {edit ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        {/* Right: Editable Fields & Settings */}
        <div className="flex-1 flex flex-col gap-10">
          {/* Documents Section */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">My Documents</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* CV */}
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Curriculum Vitae (CV)</h3>
                {cv ? (
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <a href={cv.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline truncate">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <span className="truncate">{cv.name}</span>
                    </a>
                    <button onClick={() => handleFileRemove('cv')} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" title="Remove CV">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-white dark:bg-gray-700 rounded-lg border border-dashed">No CV uploaded.</div>
                )}
                <button onClick={() => cvInputRef.current?.click()} className="btn btn-secondary btn-sm mt-1 w-full" disabled={uploading === 'cv'}>
                  {uploading === 'cv' ? 'Uploading...' : cv ? 'Replace CV' : 'Upload CV'}
                </button>
                <input type="file" ref={cvInputRef} onChange={(e) => handleFileUpload(e, 'cv')} className="hidden" accept=".pdf,.doc,.docx"/>
              </div>
              {/* Cover Letter */}
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Cover Letter</h3>
                {coverLetter ? (
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <a href={coverLetter.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline truncate">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <span className="truncate">{coverLetter.name}</span>
                    </a>
                    <button onClick={() => handleFileRemove('cl')} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" title="Remove Cover Letter">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-white dark:bg-gray-700 rounded-lg border border-dashed">No Cover Letter uploaded.</div>
                )}
                <button onClick={() => clInputRef.current?.click()} className="btn btn-secondary btn-sm mt-1 w-full" disabled={uploading === 'cl'}>
                  {uploading === 'cl' ? 'Uploading...' : coverLetter ? 'Replace Letter' : 'Upload Letter'}
                </button>
                <input type="file" ref={clInputRef} onChange={(e) => handleFileUpload(e, 'cl')} className="hidden" accept=".pdf,.doc,.docx"/>
              </div>
            </div>
          </div>
          {/* Editable Fields */}
          <form
            onSubmit={handlePasswordChange}
            className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-end transition-all duration-300 ${edit ? 'opacity-100' : 'pointer-events-none opacity-60'}`}
            style={{ pointerEvents: loading ? 'none' : undefined, opacity: loading ? 0.7 : undefined }}
            aria-disabled={!edit}
          >
            <div className="col-span-2 font-semibold text-gray-700 dark:text-gray-200 mb-2">Change Password</div>
            <div className="relative">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg border-gray-300 dark:border-gray-700 h-12 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                required
                disabled={loading || !edit}
                aria-invalid={!!error}
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-white dark:bg-gray-900 px-1 pointer-events-none">New Password <span className="text-red-500">*</span></label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-1 transition-all duration-200"
                disabled={loading || !edit}
              >
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : null}
                {loading ? 'Updating...' : 'Update Password'}
              </button>
              {edit && (
                <button
                  type="button"
                  className="btn btn-secondary flex-1 transition-all duration-200"
                  onClick={() => { setEdit(false); setPassword(''); setError(''); setMessage(''); }}
                >
                  Cancel
                </button>
              )}
            </div>
            {error && <div className="col-span-2 flex items-center gap-2 text-red-500 text-sm mt-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>{error}</div>}
            {message && <div className="col-span-2 text-green-600 text-sm mt-1">{message}</div>}
          </form>
          {/* Settings */}
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Settings</div>
            <div className="flex items-center justify-between group">
              <span className="flex items-center gap-2">Email Notifications
                <span className="text-xs text-gray-400 ml-1">(Job updates)</span>
              </span>
              <button
                type="button"
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${notif ? 'bg-[#007bff]' : 'bg-gray-300'} relative focus:outline-none focus:ring-2 focus:ring-blue-400`}
                onClick={() => edit && setNotif(n => !n)}
                aria-pressed={notif}
                tabIndex={edit ? 0 : -1}
                disabled={!edit}
              >
                <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${notif ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
            <div className="flex items-center justify-between group">
              <span className="flex items-center gap-2">Private Profile
                <span className="text-xs text-gray-400 ml-1">(Hide from search)</span>
              </span>
              <button
                type="button"
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${privacy ? 'bg-[#28a745]' : 'bg-gray-300'} relative focus:outline-none focus:ring-2 focus:ring-green-400`}
                onClick={() => edit && setPrivacy(p => !p)}
                aria-pressed={privacy}
                tabIndex={edit ? 0 : -1}
                disabled={!edit}
              >
                <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${privacy ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
          </div>
          {/* Security Section */}
          <div className="border-t pt-6 mt-4 flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 pb-4">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
              Security
            </div>
            <button onClick={handleSignOut} className="btn btn-secondary w-full">Sign Out</button>
          </div>
          {/* Danger Zone */}
          <div className="border-t-2 border-red-200 pt-6 mt-4 flex flex-col gap-4 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 pb-4">
            <div className="font-semibold text-red-600 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
              Danger Zone
            </div>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-all border-2 border-red-700/30 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 border-2 border-red-200">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
            <div className="text-lg font-bold text-red-700 mb-2">Delete Account</div>
            <div className="text-gray-700 dark:text-gray-200 text-center mb-4">Are you sure you want to delete your account? This action cannot be undone.</div>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all border-2 border-red-700/30 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 