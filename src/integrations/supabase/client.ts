// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://axgvrwzarfrcmkrwfacp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4Z3Zyd3phcmZyY21rcndmYWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNzM5OTcsImV4cCI6MjA1MDg0OTk5N30.3YfV6C_JmsvN6kY_uUrlO7FwBzKxuPkesEZTphK3CDk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);