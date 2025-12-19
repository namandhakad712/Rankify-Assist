import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../lib/supabase.js';

/**
 * Google OAuth Callback Handler
 * After Google login, this receives the auth code and creates/updates user
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }

    try {
      // Verify Google ID token using Supabase Auth
      const { data: { user }, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        console.error('[Auth] Google sign-in error:', error);
        return res.status(401).json({ error: 'Invalid Google token' });
      }

      // User authenticated successfully
      console.log(`[Auth] User signed in: ${user.email}`);

      // Create or update user in our database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!existingUser) {
        // Create new user
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await supabase
          .from('users')
          .insert([{
            user_id: userId,
            email: user.email,
            google_id: user.id,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            created_at: new Date().toISOString(),
          }]);

        return res.json({
          success: true,
          userId,
          email: user.email,
          name: user.user_metadata?.full_name,
        });
      } else {
        // Return existing user
        return res.json({
          success: true,
          userId: existingUser.user_id,
          email: existingUser.email,
          name: existingUser.name,
        });
      }
    } catch (error) {
      console.error('[Auth] Error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
