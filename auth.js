import { createClient } from '@supabase/supabase-js'
import { config } from './config.js'
import { supabase } from './supabase.js'

export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

export async function signUp(email, password, username) {
    try {
        console.log('Starting signup process for:', email);
        
        // Sign up the user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                },
                emailRedirectTo: `${window.location.origin}/confirm-email.html`
            }
        })

        console.log('Signup response:', { authData, authError });

        if (authError) {
            console.error('Signup error:', authError);
            throw authError
        }

        // Check if email confirmation was sent
        if (authData?.user?.identities?.length === 0) {
            console.log('No new identity created - user might already exist');
            return {
                success: false,
                message: 'An account with this email already exists.'
            }
        }

        console.log('Signup successful, confirmation email should be sent');
        return {
            success: true,
            message: 'Please check your email for the confirmation link.'
        }
    } catch (error) {
        console.error('Signup failed:', error);
        return {
            success: false,
            message: error.message
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
        window.location.href = 'home.html'

        return {
            success: true,
            message: 'Successfully logged in!'
        }
    } catch (error) {
        console.error('Login failed:', error);
        return {
            success: false,
            message: error.message
        }
    }
}

export async function signOut() {
    try {
        console.log('Attempting logout');
        const { error } = await supabase.auth.signOut()
        if (error) throw error

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

export async function getCurrentUser() {
    try {
        console.log('Getting current user');
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        console.log('Current user:', user);
        return user
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
} 