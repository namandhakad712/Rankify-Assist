/**
 * Simple Google OAuth Handler
 * Redirects user to Google for authentication
 */

export default async function handler(req, res) {
  // For now, just redirect to admin page with instructions
  // Full OAuth requires Google Cloud Console setup

  if (req.method === 'GET') {
    // Check if we have Google Client ID in env
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      return res.status(500).send(`
                <html>
                <head>
                    <title>OAuth Not Configured</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: 100px auto;
                            padding: 20px;
                            background: #f5f5f5;
                        }
                        .card {
                            background: white;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        h1 { color: #e74c3c; }
                        code {
                            background: #f0f0f0;
                            padding: 2px 6px;
                            border-radius: 3px;
                            font-family: monospace;
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>⚠️ Google OAuth Not Configured</h1>
                        <p>To enable Google Sign-In, you need to:</p>
                        <ol>
                            <li>Go to <a href="https://console.cloud.google.com">Google Cloud Console</a></li>
                            <li>Create OAuth Client ID</li>
                            <li>Add to Vercel Environment Variables:
                                <ul>
                                    <li><code>GOOGLE_CLIENT_ID</code></li>
                                </ul>
                            </li>
                            <li>Redeploy</li>
                        </ol>
                        <p><a href="/">← Back to Home</a></p>
                    </div>
                </body>
                </html>
            `);
    }

    // Build Google OAuth URL
    const redirectUri = `${req.headers.host?.includes('localhost') ? 'http' : 'https'}://${req.headers.host}/api/auth/callback`;

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');

    // Redirect to Google
    res.redirect(302, googleAuthUrl.toString());
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
