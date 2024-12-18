import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://uhyniesjgmhokapdrjnk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeW5pZXNqZ21ob2thcGRyam5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NDk0NDUsImV4cCI6MjA0NzMyNTQ0NX0.TtMG3zj4OgMlBKueB0vSjO_0A4E6iOY44trOC6Gie5c";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});