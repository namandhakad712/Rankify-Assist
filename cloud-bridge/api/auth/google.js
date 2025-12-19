/**
 * Google OAuth using Supabase Auth
 * Redirects to Supabase Auth which handles Google OAuth
 */

export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL;

    if (!supabaseUrl) {
        return res.status(500).json({ error: 'Supabase not configured' });
    }

    // Redirect to Supabase Auth with Google provider
    const redirectUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`https://${req.headers.host}/api/auth/callback`)}`;

    res.redirect(302, redirectUrl);
}
