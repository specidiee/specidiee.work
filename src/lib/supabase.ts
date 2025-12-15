import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
// Use SUPABASE_SECRET_API_KEY for server-side operations (bypassing RLS if needed)
// or SUPABASE_PUBLISHABLE_API_KEY for client-side valid operations.
// For this admin prototype, we'll use the Secret Key if available to ensure we can
// manage all data easily, assuming this code runs on the server (API Routes).
// If running on Client Components, you must use the Publishable Key.

const supabaseKey = process.env.SUPABASE_SECRET_API_KEY || process.env.SUPABASE_PUBLISHABLE_API_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
