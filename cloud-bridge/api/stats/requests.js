// Request statistics endpoint
import { createClient } from '../lib/supabase.js';

export default async function handler(req, res) {
    try {
        const supabase = createClient();

        // Count total requests from logs table
        const { count, error } = await supabase
            .from('request_logs')
            .select('*', { count: 'exact', head: true });

        if (error) {
            return res.status(500).json({ count: 0, error: error.message });
        }

        res.json({ count: count || 0 });
    } catch (error) {
        res.json({ count: 0 });
    }
}
