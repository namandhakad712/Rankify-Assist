import { createUser } from '../lib/auth.js';

export default async function handler(req, res) {
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

    const { username, password, email } = req.body;

    // Validate inputs
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
        const user = await createUser(username, password, email);

        return res.json({
            success: true,
            userId: user.userId,
            username: user.username,
            message: 'Registration successful! Save your userId for MCP configuration.',
        });
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ error: 'Username already taken' });
        }

        console.error('[Register] Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
