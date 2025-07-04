
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lxdmurqaenwhaisdxatl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4ZG11cnFhZW53aGFpc2R4YXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2OTk3OTMsImV4cCI6MjA2MzI3NTc5M30.0WjCG3ejmu-6Z9j2CNRA4TxZetu15mvXRX2xN_OgUbE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
