import { supabase } from './supabase.js';

async function handleEmailConfirmation() {
    const statusElement = document.getElementById('confirmation-status');
    
    try {
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');

        if (!token) {
            throw new Error('No confirmation token found in URL');
        }

        // Handle email confirmation
        const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type || 'signup'
        });

        if (error) throw error;

        statusElement.innerHTML = `
            <h2>Email Confirmed Successfully!</h2>
            <p>Your email has been confirmed. You can now log in to your account.</p>
            <div class="auth-footer">
                <a href="index.html" class="button">Go to Login</a>
            </div>
        `;
    } catch (error) {
        console.error('Error confirming email:', error);
        statusElement.innerHTML = `
            <h2>Confirmation Error</h2>
            <p class="error">${error.message}</p>
            <p>Please try again or contact support if the problem persists.</p>
            <div class="auth-footer">
                <a href="index.html" class="button">Back to Login</a>
            </div>
        `;
    }
}

// Run the confirmation handler when the page loads
document.addEventListener('DOMContentLoaded', handleEmailConfirmation); 