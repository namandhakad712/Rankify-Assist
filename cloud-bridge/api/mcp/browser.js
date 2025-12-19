import { supabase } from '../lib/supabase.js';

/**
 * Browser Automation MCP Handler (Vercel Serverless)
 * Receives tool calls from Tuya AI Workflow
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { tool, arguments: args, userId } = req.body;

    console.log(`[MCP Browser] Tool: ${tool}, User: ${userId}`);

    if (tool === 'execute_browser_task') {
        return await handleBrowserTask(args, userId, res);
    }

    return res.status(400).json({ error: 'Unknown tool' });
}

async function handleBrowserTask(args, userId, res) {
    const { command, user_id } = args;
    const targetUserId = user_id || userId || 'default';

    console.log(`[Browser Task] Command: ${command}, User: ${targetUserId}`);

    try {
        // Generate command ID
        const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Insert command for extension to poll
        const { error: insertError } = await supabase
            .from('commands')
            .insert([{
                command_id: commandId,
                user_id: targetUserId,
                command,
                status: 'pending',
                created_at: new Date().toISOString(),
            }]);

        if (insertError) {
            console.error('[Browser Task] Insert error:', insertError);
            return res.status(500).json({
                success: false,
                error: 'Failed to queue command'
            });
        }

        // Wait for result (long-polling)
        const result = await waitForResult(commandId, 60000);

        if (result) {
            console.log(`[Browser Task] Success:`, result.result);
            return res.json({
                success: true,
                result: result.result,
                executionTime: result.execution_time,
            });
        } else {
            // Timeout
            await supabase
                .from('commands')
                .update({ status: 'timeout' })
                .eq('command_id', commandId);

            return res.status(408).json({
                success: false,
                error: 'Command timeout - extension may not be connected',
            });
        }
    } catch (error) {
        console.error('[Browser Task] Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

async function waitForResult(commandId, timeout) {
    const startTime = Date.now();
    const checkInterval = 500;

    while (Date.now() - startTime < timeout) {
        const { data: result, error } = await supabase
            .from('results')
            .select('*')
            .eq('command_id', commandId)
            .single();

        if (!error && result) {
            return result;
        }

        await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    return null;
}
