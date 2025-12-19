import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcrypt';

// Verify JWT token from Google OAuth (NO users table needed!)
export async function verifyJWT(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    try {
        const token = authHeader.split(' ')[1];

        // Verify JWT token with Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('[Auth] JWT verification failed:', error);
            return null;
        }

        // Return user info directly from JWT (no users table needed!)
        return {
            userId: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0],
        };
    } catch (error) {
        console.error('[Auth] Error verifying JWT:', error);
        return null;
    }
}

// OLD: Basic Auth verification (for backward compatibility)
export async function verifyAuth(authHeader) {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return null;
    }

    try {
        // Decode Base64 credentials
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');

        if (!username || !password) {
            return null;
        }

        // Get user from Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (isValid) {
            return {
                userId: user.user_id,
                username: user.username,
            };
        }

        return null;
    } catch (error) {
        console.error('[Auth] Error verifying credentials:', error);
        return null;
    }
}

export async function createUser(username, password, email) {
    // Check if user exists
    const { data: existing } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

    if (existing) {
        throw new Error('User already exists');
    }

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const { data: user, error } = await supabase
        .from('users')
        .insert([
            {
                user_id: userId,
                username,
                password_hash: passwordHash,
                email,
                created_at: new Date().toISOString(),
            },
        ])
        .select()
        .single();

    if (error) {
        console.error('[Auth] Error creating user:', error);
        throw new Error('Failed to create user');
    }

    console.log(`[Auth] User created: ${username} (${userId})`);

    return {
        userId: user.user_id,
        username: user.username,
        email: user.email,
    };
}

export async function getUserByUsername(username) {
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error) {
        return null;
    }

    return user;
}
