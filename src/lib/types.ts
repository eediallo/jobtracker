import { Session, User } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Job {
  id: number;
  user_id: string;
  position: string;
  company: string;
  city: string;
  application_date: string;
  status: string;
  title: string;
  location: string;
  job_link?: string;
}

export interface PageProps {
  params: {
    id: string;
  };
} 