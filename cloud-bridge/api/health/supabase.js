// Health check for Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    try {
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({
                connected: false,
                error: 'Missing Supabase environment variables'
            });
        }

        const start = Date.now();
        const supabase = createClient(supabaseUrl, supabaseKey);

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
