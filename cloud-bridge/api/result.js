import { supabase } from '../lib/supabase.js';
import { verifyAuth } from '../lib/auth.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify authentication
    const authHeader = req.headers.authorization;
    const user = await verifyAuth(authHeader);

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { commandId, result, success, executionTime } = req.body;

    if (!commandId) {
        return res.status(400).json({ error: 'Missing commandId' });
    }

    console.log(`[Result] User ${user.userId} submitting result for command ${commandId}`);

    // Insert result into Supabase
    const { error: insertError } = await supabase
        .from('results')
        .insert([
            {
                command_id: commandId,
                user_id: user.userId,
                result: result || 'No result provided',
                success: success !== undefined ? success : true,
                execution_time: executionTime || 0,
                completed_at: new Date().toISOString(),
            },
        ]);

    if (insertError) {
        console.error('[Result] Error inserting result:', insertError);
        return res.status(500).json({ error: 'Failed to store result' });
    }

    // Update command status
    await supabase
        .from('commands')
        .update({ status: 'completed' })
        .eq('command_id', commandId);

    console.log(`[Result] Result stored for command ${commandId}`);

    return res.json({
        success: true,
        message: 'Result stored successfully',
    });
}
