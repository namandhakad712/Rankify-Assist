import { supabase } from '../lib/supabase.js';
import { withLogging } from '../lib/logging.js';

const MCP_API_KEY = process.env.MCP_API_KEY;

async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, apiKey, command, accessId } = req.body;

    // Validate MCP API key
    if (apiKey !== MCP_API_KEY) {
        return res.status(401).json({ error: 'Invalid API key' });
    }

    if (!command || !accessId) {
        return res.status(400).json({ error: 'Missing required fields: command, accessId' });
    }

    // Lookup user from access_id
    const { data: mcpConfig, error: configError } = await supabase
        .from('mcp_configs')
        .select('user_id')
        .eq('access_id', accessId)
        .eq('enabled', true)
        .single();

    if (configError || !mcpConfig) {
        console.error('[Execute] No user found for access_id:', accessId, configError);
        return res.status(404).json({
            error: 'Access ID not registered. Please add your Tuya Access ID in the extension settings.'
        });
    }

    const actualUserId = mcpConfig.user_id;
    console.log(`[Execute] Access ID ${accessId} belongs to user ${actualUserId}`);

    // Generate command ID
    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[Execute] Queueing command for user ${actualUserId}:`, commandId);

    // Ensure user exists (create if not - use actualUserId from lookup)
    const { error: userError } = await supabase
        .from('users')
        .upsert([
            {
                user_id: actualUserId,
                email: `${actualUserId}@system.local`,
                name: actualUserId,
            },
        ], { onConflict: 'user_id' });

    if (userError) {
        console.error('[Execute] Error ensuring user exists:', userError);
        // Continue anyway - maybe user already exists
    }

    // Insert command into Supabase with access_id
    const { error: insertError } = await supabase
        .from('commands')
        .insert([
            {
                command_id: commandId,
                user_id: actualUserId,  // Use the looked-up user ID
                access_id: accessId,    // Store the access ID for tracking
                command,
                status: 'pending',
                created_at: new Date().toISOString(),
            },
        ]);

    if (insertError) {
        console.error('[Execute] Error inserting command:', insertError);
        return res.status(500).json({ error: 'Failed to queue command', details: insertError.message });
    }

    console.log(`[Execute] Command ${commandId} queued successfully`);

    // Return immediately - don't wait for result (to avoid Vercel timeout)
    return res.json({
        success: true,
        commandId,
        message: 'Command queued successfully. Extension will execute it.',
        status: 'pending'
    });
}

async function waitForResult(commandId, timeout) {
    const startTime = Date.now();
    const checkInterval = 500; // Check every 500ms

    while (Date.now() - startTime < timeout) {
        // Check if result exists
        const { data: result, error } = await supabase
            .from('results')
            .select('*')
            .eq('command_id', commandId)
            .single();

        if (!error && result) {
            return result;
        }

        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    return null;
}

export default withLogging(handler);
