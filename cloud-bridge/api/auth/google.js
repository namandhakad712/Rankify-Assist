/**
 * Google OAuth - Redirect to Supabase Auth
 */

export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL;

    if (!supabaseUrl) {
        return res.status(500).json({ error: 'Supabase URL not configured' });
    }

    // Build redirect URL back to our static callback page
    const redirectTo = `https://${req.headers.host}/callback.html`;

    // Redirect to Supabase Auth with Google provider
    const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;

    res.redirect(302, authUrl);
}
