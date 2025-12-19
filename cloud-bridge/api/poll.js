import { supabase } from '../lib/supabase.js';
import { withLogging } from '../lib/logging.js';

async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get access_id from query parameter (no auth needed!)
    const { accessId } = req.query;

    if (!accessId) {
        return res.status(400).json({ error: 'Access ID required' });
    }

    console.log(`[Poll] Checking commands for Access ID: ${accessId}`);

    // Get oldest pending command for this access_id
    const { data: commands, error } = await supabase
        .from('commands')
        .select('*')
        .eq('access_id', accessId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1);

    if (error) {
        console.error('[Poll] Error fetching commands:', error);
        return res.status(500).json({ error: 'Database error' });
    }

    if (!commands || commands.length === 0) {
        return res.json({ hasCommand: false });
    }

    const command = commands[0];

    // Mark command as processing
    await supabase
        .from('commands')
        .update({ status: 'processing' })
        .eq('command_id', command.command_id);

    console.log(`[Poll] Command found for Access ID ${accessId}:`, command.command_id);

    return res.json({
        hasCommand: true,
        commandId: command.command_id,
        command: command.command,
        timestamp: command.created_at,
    });
}

export default withLogging(handler);
