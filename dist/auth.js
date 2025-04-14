import { createClient } from '@supabase/supabase-js'
import { config } from './config.js'
import { supabase } from './supabase.js'

export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

export async function signUp(email, password, username) {
    try {
        // Sign up the user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        })

        if (authError) throw authError

        // Create a profile in the profiles table
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        username: username,
                        email: email
                    }
                ])

            if (profileError) throw profileError
        }

        return {
            success: true,
            message: 'Please check your email for the confirmation link.'
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error

        // Redirect to home page after successful login
        window.location.href = 'home.html'

        return {
            success: true,
            message: 'Successfully logged in!'
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        // Redirect to login page after successful logout
        window.location.href = 'index.html'

        return {
            success: true,
            message: 'Successfully logged out!'
        }
    } catch (error) {
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
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
} 