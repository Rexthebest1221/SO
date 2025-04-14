import { signUp } from './auth.js';

// DOM Elements
const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');

// Error message elements
const usernameError = document.getElementById('username-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');

// Validation functions
function validateUsername(username) {
    if (username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    if (username.length > 20) {
        return 'Username must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
}

function validateEmail(email) {
    if (!email) {
        return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
}

function validatePassword(password) {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return '';
}

function validatePasswordConfirmation(password, confirmPassword) {
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return '';
}

// Clear error messages
function clearErrors() {
    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
}

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate inputs
    const usernameValidation = validateUsername(username);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validatePasswordConfirmation(password, confirmPassword);

    // Display validation errors if any
    if (usernameValidation) usernameError.textContent = usernameValidation;
    if (emailValidation) emailError.textContent = emailValidation;
    if (passwordValidation) passwordError.textContent = passwordValidation;
    if (confirmPasswordValidation) confirmPasswordError.textContent = confirmPasswordValidation;

    // If there are any validation errors, stop submission
    if (usernameValidation || emailValidation || passwordValidation || confirmPasswordValidation) {
        return;
    }

    // Disable submit button and show loading state
    signupButton.disabled = true;
    signupButton.textContent = 'Creating Account...';

    try {
        const result = await signUp(email, password, username);
        
        if (result.success) {
            // Show success message
            alert(result.message);
            // Redirect to login page
            window.location.href = 'index.html';
        } else {
            // Show error message
            alert(result.message);
        }
    } catch (error) {
        alert('An error occurred during signup. Please try again.');
    } finally {
        // Re-enable submit button and restore text
        signupButton.disabled = false;
        signupButton.textContent = 'Create Account';
    }
}); 