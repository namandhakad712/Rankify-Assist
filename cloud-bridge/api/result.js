import { supabase } from '../lib/supabase.js';
import { withLogging } from '../lib/logging.js';

async function handler(req, res) {
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

    const { commandId, result, status, accessId } = req.body;

    if (!commandId) {
        return res.status(400).json({ error: 'Command ID required' });
    }

    console.log(`[Result] Received result for command ${commandId} (Status: ${status})`);

    try {
        // 1. Fetch command to get user_id
        const { data: commandData, error: fetchError } = await supabase
            .from('commands')
            .select('user_id')
            .eq('command_id', commandId)
            .single();

        if (fetchError || !commandData) {
            console.error('[Result] Command not found:', commandId);
            return res.status(404).json({ error: 'Command not found' });
        }

        const userId = commandData.user_id;

        // 2. Update command status
        const { error: updateError } = await supabase
            .from('commands')
            .update({
                status: status || 'completed',
                updated_at: new Date().toISOString(),
            })
            .eq('command_id', commandId);

        if (updateError) {
            console.error('[Result] Error updating command status:', updateError);
        }

        // 3. Insert result into results table
        const { error: insertError } = await supabase
            .from('results')
            .upsert([
                {
                    command_id: commandId,
                    user_id: userId,        // REQUIRED by schema
                    result: result,
                    success: status !== 'failed', // derive success boolean
                    completed_at: new Date().toISOString(), // Matches schema (created_at doesn't exist)
                },
            ], { onConflict: 'command_id' });

        if (insertError) {
            console.error('[Result] Error inserting result:', insertError);
            return res.status(500).json({ error: 'Failed to save result', details: insertError.message });
        }

        console.log(`[Result] Command ${commandId} completed successfully`);
        return res.json({ success: true });

    } catch (error) {
        console.error('[Result] Server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withLogging(handler);
