// Health check for Supabase connection
import { createClient } from '../lib/supabase.js';

export default async function handler(req, res) {
    try {
        const start = Date.now();
        const supabase = createClient();

        // Try to query database
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        const latency = Date.now() - start;

        if (error) {
            return res.status(500).json({
                connected: false,
                error: error.message,
                latency
            });
        }

        res.json({
            connected: true,
            latency,
            message: 'Supabase connection healthy'
        });
    } catch (error) {
        res.status(500).json({
            connected: false,
            error: error.message
        });
    }
}
