import { signIn } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Disable the form while processing
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        try {
            const { success, error } = await signIn(email, password);
            
            if (success) {
                // Login successful, redirect to home page
                window.location.href = 'index.html';
            } else {
                // Show error message
                alert(error || 'Login failed. Please try again.');
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
    });
}); 