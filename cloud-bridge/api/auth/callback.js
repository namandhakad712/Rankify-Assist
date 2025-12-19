/**
 * Google OAuth Callback - Supabase Auth
 * Receives session from Supabase Auth and saves user
 */

import { createClient } from '../../lib/supabase.js';

export default async function handler(req, res) {
    try {
        const supabase = createClient();

        // Get session from URL fragments (Supabase returns it in hash)
        // For server-side, we need to exchange the code
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            // Show error page
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Sign In Error</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: 'Segoe UI', sans-serif;
                            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                        }
                        .card {
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 24px;
                            padding: 60px;
                            backdrop-filter: blur(20px);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                            text-align: center;
                            max-width: 500px;
                        }
                        h1 { color: #ff4444; margin-bottom: 20px; }
                        p { color: rgba(255, 255, 255, 0.7); margin-bottom: 30px; }
                        a {
                            display: inline-block;
                            padding: 12px 32px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 12px;
                            transition: transform 0.3s;
                        }
                        a:hover { transform: translateY(-2px); }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>❌ Sign In Error</h1>
                        <p>${error?.message || 'Authentication failed'}</p>
                        <a href="/">← Back to Home</a>
                    </div>
                </body>
                </html>
            `);
        }

        const user = session.user;

        // Create/update user in our database
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

        if (!existingUser) {
            // Create new user
            await supabase
                .from('users')
                .insert([{
                    user_id: userId,
                    email: user.email,
                    google_id: user.user_metadata?.sub || user.id,
                    name: user.user_metadata?.name || user.email.split('@')[0]
                }]);
        }

        const finalUserId = existingUser ? existingUser.user_id : userId;

        // Show success page
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sign In Successful</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', sans-serif;
                        background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        overflow: hidden;
                        position: relative;
                    }
                    
                    /* Animated background */
                    body::before {
                        content: '';
                        position: absolute;
                        width: 200%;
                        height: 200%;
                        background: 
                            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(72, 126, 176, 0.3), transparent 50%);
                        animation: float 20s ease-in-out infinite;
                    }
                    
                    @keyframes float {
                        0%, 100% { transform: translate(0, 0); }
                        50% { transform: translate(30px, -30px); }
                    }
                    
                    .card {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 24px;
                        padding: 60px;
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                        text-align: center;
                        max-width: 500px;
                        position: relative;
                        z-index: 1;
                    }
                    
                    .success-icon {
                        font-size: 64px;
                        margin-bottom: 20px;
                        animation: bounce 1s ease;
                    }
                    
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    
                    h1 {
                        background: linear-gradient(135deg, #00ff88, #00ddff);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 20px;
                        font-size: 32px;
                    }
                    
                    .user-info {
                        margin: 30px 0;
                        padding: 20px;
                        background: rgba(255, 255, 255, 0.03);
                        border-radius: 12px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    
                    .user-email {
                        color: rgba(255, 255, 255, 0.9);
                        font-size: 18px;
                        margin-bottom: 10px;
                    }
                    
                    .user-id {
                        color: rgba(255, 255, 255, 0.5);
                        font-size: 12px;
                        font-family: monospace;
                    }
                    
                    .loading {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        margin-top: 30px;
                        color: rgba(255, 255, 255, 0.7);
                    }
                    
                    .spinner {
                        width: 20px;
                        height: 20px;
                        border: 3px solid rgba(255, 255, 255, 0.2);
                        border-top-color: #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="success-icon">✅</div>
                    <h1>Sign In Successful!</h1>
                    <div class="user-info">
                        <div class="user-email">${user.email}</div>
                        <div class="user-id">ID: ${finalUserId}</div>
                    </div>
                    <div class="loading">
                        <div class="spinner"></div>
                        <span>Redirecting to dashboard...</span>
                    </div>
                </div>
                <script>
                    // Save user info
                    localStorage.setItem('supabase_session', JSON.stringify(${JSON.stringify(session)}));
                    localStorage.setItem('user_id', '${finalUserId}');
                    localStorage.setItem('user_email', '${user.email}');
                    localStorage.setItem('user_name', '${user.user_metadata?.name || user.email.split('@')[0]}');
                    localStorage.setItem('user_avatar', '${user.user_metadata?.avatar_url || user.user_metadata?.picture || ''}');
                    
                    // Redirect after 2 seconds
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
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', sans-serif;
                        background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                    }
                    .card {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 24px;
                        padding: 60px;
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        text-align: center;
                        max-width: 500px;
                    }
                    h1 { color: #ff4444; margin-bottom: 20px; }
                    pre {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 15px;
                        border-radius: 8px;
                        margin: 20px 0;
                        text-align: left;
                        overflow-x: auto;
                        font-size: 12px;
                    }
                    a {
                        display: inline-block;
                        padding: 12px 32px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 12px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>❌ Error</h1>
                    <pre>${error.message}</pre>
                    <a href="/">← Back to Home</a>
                </div>
            </body>
            </html>
        `);
    }
}
