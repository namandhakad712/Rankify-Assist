import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export function createClient() {
    return createSupabaseClient(supabaseUrl, supabaseKey);
}

// Also export a default instance for convenience
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
