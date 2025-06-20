import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqbvufyromcaizodepgn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYnZ1Znlyb21jYWl6b2RlcGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MjgyMTEsImV4cCI6MjA2NjAwNDIxMX0.IBfUuuBA4vwTw0BJgofKtD4LRqbVY3FrxpD3KpcB7zM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 