import { supabase } from '../lib/supabase.js';

/**
 * Device Controller MCP Handler (Vercel Serverless)
 * Receives tool calls from Tuya AI Workflow for IoT devices
 */

// Tuya OpenAPI credentials (from env)
const TUYA_CLIENT_ID = process.env.TUYA_CLIENT_ID;
const TUYA_CLIENT_SECRET = process.env.TUYA_CLIENT_SECRET;
const TUYA_API_URL = process.env.TUYA_API_URL || 'https://openapi.tuyain.com';

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

    const { tool, arguments: args } = req.body;

    console.log(`[MCP Device] Tool: ${tool}`);

    switch (tool) {
        case 'list_user_devices':
            return await listUserDevices(args, res);
        case 'query_device_status':
            return await queryDeviceStatus(args, res);
        case 'control_device':
            return await controlDevice(args, res);
        default:
            return res.status(400).json({ error: 'Unknown tool' });
    }
}

// Get Tuya API access token
async function getTuyaToken() {
    const crypto = require('crypto');
    const timestamp = Date.now().toString();
    const nonce = Math.random().toString(36).substring(2, 15);

    const stringToSign = TUYA_CLIENT_ID + timestamp + nonce;
    const sign = crypto
        .createHmac('sha256', TUYA_CLIENT_SECRET)
        .update(stringToSign)
        .digest('hex')
        .toUpperCase();

    const response = await fetch(`${TUYA_API_URL}/v1.0/token?grant_type=1`, {
        method: 'GET',
        headers: {
            'client_id': TUYA_CLIENT_ID,
            'sign': sign,
            'sign_method': 'HMAC-SHA256',
            't': timestamp,
            'nonce': nonce,
        },
    });

    const data = await response.json();

    if (data.success) {
        return data.result.access_token;
    }

    throw new Error('Failed to get Tuya token');
}

// Make authenticated Tuya API request
async function makeTuyaRequest(method, path, body = null) {
    const token = await getTuyaToken();
    const timestamp = Date.now().toString();

    const options = {
        method,
        headers: {
            'client_id': TUYA_CLIENT_ID,
            'access_token': token,
            't': timestamp,
            'sign_method': 'HMAC-SHA256',
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${TUYA_API_URL}${path}`, options);
    return await response.json();
}

async function listUserDevices(args, res) {
    try {
        const result = await makeTuyaRequest('GET', '/v1.0/devices');

        if (result.success) {
            const devices = result.result.map(d => ({
                name: d.name,
                id: d.id,
                online: d.online,
                product_name: d.product_name || '',
            }));

            return res.json({
                success: true,
                devices,
                count: devices.length,
            });
        }

        return res.status(500).json({
            success: false,
            error: result.msg || 'Failed to list devices',
        });
    } catch (error) {
        console.error('[Device] List error:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

async function queryDeviceStatus(args, res) {
    const { device_id } = args;

    try {
        const result = await makeTuyaRequest('GET', `/v1.0/devices/${device_id}/status`);

        if (result.success) {
            return res.json({
                success: true,
                status: result.result,
            });
        }

        return res.status(500).json({
            success: false,
            error: result.msg || 'Failed to query status',
        });
    } catch (error) {
        console.error('[Device] Status error:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

async function controlDevice(args, res) {
    const { device_id, command_code, command_value } = args;

    try {
        const result = await makeTuyaRequest('POST', `/v1.0/devices/${device_id}/commands`, {
            commands: [{
                code: command_code,
                value: command_value,
            }],
        });

        if (result.success) {
            return res.json({
                success: true,
                message: 'Device controlled successfully',
            });
        }

        return res.status(500).json({
            success: false,
            error: result.msg || 'Failed to control device',
        });
    } catch (error) {
        console.error('[Device] Control error:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
