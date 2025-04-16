import { createClient } from '@supabase/supabase-js'
import { config } from './config.js'
import { supabase } from './supabase.js'

export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

export async function signUp(email, password, username) {
    try {
        console.log('Starting signup process for:', email);
        
        // Sign up the user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        })

        console.log('Signup response:', { data, error });

        if (error) {
            console.error('Signup error:', error);
            throw error
        }

        // Check if email confirmation was sent
        if (data?.user?.identities?.length === 0) {
            console.log('No new identity created - user might already exist');
            return {
                success: false,
                message: 'An account with this email already exists.'
            }
        }

        console.log('Signup successful, confirmation email should be sent');
        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('Signup failed:', error);
        return {
            success: false,
            error: error.message
        }
    }
}

export async function signIn(email, password) {
    try {
        console.log('Attempting login for:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        console.log('Login response:', { data, error });

        if (error) throw error

        // Store session in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('session', JSON.stringify(data.session));
        
        // Check if email is confirmed
        if (data.user && !data.user.email_confirmed_at) {
            console.log('User email not confirmed');
            return {
                success: false,
                message: 'Please confirm your email before logging in.'
            }
        }

        console.log('Login successful, redirecting to home page');
        // Redirect to home page after successful login
        window.location.href = 'index.html'

        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('Login failed:', error);
        return {
            success: false,
            error: error.message
        }
    }
}

export async function signOut() {
    try {
        console.log('Attempting logout');
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        // Clear stored session
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        
        console.log('Logout successful, redirecting to login page');
        // Redirect to login page after successful logout
        window.location.href = 'index.html'

        return {
            success: true,
            message: 'Successfully logged out!'
        }
    } catch (error) {
        console.error('Logout failed:', error);
        return {
            success: false,
            message: error.message
        }
    }
}

export async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function updatePassword(newPassword) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })
        if (error) throw error
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function getCurrentSession() {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
}

export async function checkSession() {
    const session = getCurrentSession();
    if (!session) return false;

    try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (currentSession) {
            // Update stored session
            localStorage.setItem('session', JSON.stringify(currentSession));
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

// Function to check if user can post (is logged in)
export function canPost() {
    return getCurrentUser() !== null;
} 