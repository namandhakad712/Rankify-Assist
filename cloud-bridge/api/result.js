import { supabase } from '../lib/supabase.js';

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

    const { commandId, result, status, accessId } = req.body;

    if (!commandId) {
        return res.status(400).json({ error: 'Command ID required' });
    }

    console.log(`[Result] Received result for command ${commandId} (Status: ${status})`);

    try {
        // 1. Update command status
        const { error: updateError } = await supabase
            .from('commands')
            .update({
                status: status || 'completed',
                updated_at: new Date().toISOString(),
            })
            .eq('command_id', commandId);

        if (updateError) {
            console.error('[Result] Error updating command status:', updateError);
            // Don't fail the request, try to insert result anyway
        }

        // 2. Insert result into results table
        const { error: insertError } = await supabase
            .from('results')
            .upsert([ // Using upsert just in case result already exists
                {
                    command_id: commandId,
                    result: result, // Can be JSON string or text
                    created_at: new Date().toISOString(),
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
