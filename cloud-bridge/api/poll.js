import { supabase } from '../lib/supabase.js';
import { verifyAuth } from '../lib/auth.js';

export default async function handler(req, res) {
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

    // Verify authentication
    const authHeader = req.headers.authorization;
    const user = await verifyAuth(authHeader);

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized - invalid credentials' });
    }

    console.log(`[Poll] User ${user.userId} polling for commands`);

    // Get oldest pending command for this user
    const { data: commands, error } = await supabase
        .from('commands')
        .select('*')
        .eq('user_id', user.userId)
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

    console.log(`[Poll] Command found for user ${user.userId}:`, command.command_id);

    return res.json({
        hasCommand: true,
        commandId: command.command_id,
        command: command.command,
        timestamp: command.created_at,
    });
}
