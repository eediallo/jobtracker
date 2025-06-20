export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  details: string | null;
  created_at: string | null;
} 