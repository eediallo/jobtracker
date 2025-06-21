"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  loading: boolean;
  updateUser: (data: object) => Promise<void>;
}>({
  user: null,
  session: null,
  loading: true,
  updateUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function updateUser(data: object) {
    if (!user) return;
    const { data: { user: updatedUser }, error } = await supabase.auth.updateUser({ data });
    if (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user data.");
    } else if (updatedUser) {
      setUser(updatedUser);
    }
  }

  useEffect(() => {
    async function getSession() {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
    }

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user;
        // Only set user if email is confirmed
        if (currentUser && currentUser.email_confirmed_at) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
} 