import { supabase } from '../../lib/supabase.js';
import { verifyAuth } from '../../lib/auth.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Verify authentication
    const authHeader = req.headers.authorization;
    const user = await verifyAuth(authHeader);

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized - please login' });
    }

    // GET: List user's MCP configs
    if (req.method === 'GET') {
        const { data: configs, error } = await supabase
            .from('mcp_configs')
            .select('*')
            .eq('user_id', user.userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[MCP Config] Error fetching configs:', error);
            return res.status(500).json({ error: 'Failed to fetch configurations' });
        }

        return res.json({ configs });
    }

    // POST: Add new MCP config
    if (req.method === 'POST') {
        const { accessId, name } = req.body;

        if (!accessId) {
            return res.status(400).json({ error: 'Access ID is required' });
        }

        // Check if this access_id already exists for this user
        const { data: existing } = await supabase
            .from('mcp_configs')
            .select('*')
            .eq('user_id', user.userId)
            .eq('access_id', accessId)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'This Access ID is already registered' });
        }

        // Insert new config
        const configId = `cfg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const { error: insertError } = await supabase
            .from('mcp_configs')
            .insert([
                {
                    config_id: configId,
                    user_id: user.userId,
                    name: name || 'Tuya MCP',
                    type: 'browser',
                    access_id: accessId,
                    enabled: true,
                },
            ]);

        if (insertError) {
            console.error('[MCP Config] Error inserting config:', insertError);
            return res.status(500).json({ error: 'Failed to save configuration' });
        }

        console.log(`[MCP Config] User ${user.userId} added Access ID: ${accessId}`);

        return res.json({
            success: true,
            message: 'Access ID registered successfully!',
            configId
        });
    }

    // DELETE: Remove MCP config
    if (req.method === 'DELETE') {
        const { configId } = req.query;

        if (!configId) {
            return res.status(400).json({ error: 'Config ID is required' });
        }

        // Delete only if it belongs to this user
        const { error: deleteError } = await supabase
            .from('mcp_configs')
            .delete()
            .eq('config_id', configId)
            .eq('user_id', user.userId);

        if (deleteError) {
            console.error('[MCP Config] Error deleting config:', deleteError);
            return res.status(500).json({ error: 'Failed to delete configuration' });
        }

        return res.json({ success: true, message: 'Configuration deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
