/**
 * Google OAuth Callback Handler
 * Receives auth code from Google and creates user session
 */

import { createClient } from '../../lib/supabase.js';

export default async function handler(req, res) {
    const { code, error } = req.query;

    if (error) {
        return res.status(400).send(`
            <html>
            <head><title>Auth Error</title></head>
            <body>
                <h1>Authentication Error</h1>
                <p>Error: ${error}</p>
                <p><a href="/">Back to Home</a></p>
            </body>
            </html>
        `);
    }

    if (!code) {
        return res.status(400).send('Missing authorization code');
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
                redirect_uri: `${req.headers.host?.includes('localhost') ? 'http' : 'https'}://${req.headers.host}/api/auth/callback`,
                grant_type: 'authorization_code'
            })
        });

        const tokens = await tokenResponse.json();

        if (tokens.error) {
            throw new Error(tokens.error_description || tokens.error);
        }

        // Get user info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${tokens.access_token}` }
        });

        const userInfo = await userResponse.json();

        // Create/update user in Supabase
        const supabase = createClient();
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', userInfo.email)
            .single();

        if (!existingUser) {
            // Create new user
            await supabase
                .from('users')
                .insert([{
                    user_id: userId,
                    email: userInfo.email,
                    google_id: userInfo.id,
                    name: userInfo.name
                }]);
        }

        // Return success page with token
        const finalUserId = existingUser ? existingUser.user_id : userId;

        res.send(`
            <html>
            <head>
                <title>Sign In Successful</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    .card {
                        background: rgba(255,255,255,0.1);
                        padding: 40px;
                        border-radius: 12px;
                        max-width: 400px;
                        margin: 0 auto;
                        backdrop-filter: blur(10px);
                    }
                    h1 { margin-bottom: 20px; }
                    button {
                        padding: 12px 24px;
                        background: white;
                        color: #667eea;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        margin-top: 20px;
                    }
                    button:hover {
                        opacity: 0.9;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>✅ Sign In Successful!</h1>
                    <p>Welcome, ${userInfo.name || userInfo.email}</p>
                    <p>Redirecting...</p>
                </div>
                <script>
                    // Save user info to localStorage
                    localStorage.setItem('google_token', '${tokens.access_token}');
                    localStorage.setItem('user_id', '${finalUserId}');
                    localStorage.setItem('user_email', '${userInfo.email}');
                    localStorage.setItem('user_name', '${userInfo.name || ''}');
                    localStorage.setItem('user_avatar', '${userInfo.picture || ''}');
                    
                    // Redirect to home after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                </script>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('[Auth] Callback error:', error);
        res.status(500).send(`
            <html>
            <head><title>Auth Error</title></head>
            <body>
                <h1>Authentication Failed</h1>
                <p>${error.message}</p>
                <p><a href="/">Try Again</a></p>
            </body>
            </html>
        `);
    }
}
