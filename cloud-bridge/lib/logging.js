// Logging middleware - logs ALL requests to Supabase
import { createClient } from './supabase.js';
import { randomBytes } from 'crypto';

export async function logRequest(req, res, responseData, error = null) {
    try {
        const supabase = createClient();

        const requestId = randomBytes(16).toString('hex');
        const endpoint = req.url || '/';
        const method = req.method || 'GET';

        // Extract user ID if available
        let userId = null;
        if (req.body && req.body.userId) {
            userId = req.body.userId;
        } else if (req.headers.authorization) {
            // Extract from token if available
            userId = 'from_token'; // You can decode JWT here
        }

        // Get IP and user agent
        const ipAddress = req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection?.remoteAddress ||
            'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';

        // Calculate duration if available
        const duration = req._startTime ? Date.now() - req._startTime : 0;

        // Log to Supabase
        const { error: logError } = await supabase
            .from('request_logs')
            .insert([{
                request_id: requestId,
                endpoint,
                method,
                user_id: userId,
                request_body: req.body ? JSON.parse(JSON.stringify(req.body)) : null,
                response_body: responseData ? JSON.parse(JSON.stringify(responseData)) : null,
                status_code: res.statusCode || 200,
                ip_address: ipAddress,
                user_agent: userAgent,
                duration_ms: duration,
                error: error ? error.message : null
            }]);

        if (logError) {
            console.error('[Logging] Failed to log request:', logError);
        }
    } catch (err) {
        console.error('[Logging] Error:', err);
    }
}

// Wrap API handler with logging
export function withLogging(handler) {
    return async (req, res) => {
        // Mark start time
        req._startTime = Date.now();

        try {
            // Call original handler
            await handler(req, res);

            // Log success (response already sent)
            // We assume handler sends response
            await logRequest(req, res, { success: true });
        } catch (error) {
            // Log error
            await logRequest(req, res, null, error);

            // Send error response if not already sent
            if (!res.headersSent) {
                res.status(500).json({ error: error.message });
            }
        }
    };
}
