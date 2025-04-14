import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

export const config = {
    supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY
    }
} 