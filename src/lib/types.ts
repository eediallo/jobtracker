export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Job {
  id: number;
  user_id: string | null;
  position: string | null;
  company: string | null;
  city: string | null;
  application_date: string | null;
  status: string | null;
  title: string;
  description: string;
  location: string;
  details: string | null;
  created_at: string | null;
} 