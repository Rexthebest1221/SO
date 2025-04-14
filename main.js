import { signUp, signIn, signOut, getCurrentUser } from './auth.js';

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const userProfile = document.getElementById('user-profile');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username-display');

// Form Elements
const loginFormElement = document.getElementById('login');
const signupFormElement = document.getElementById('signup');

// Show/Hide Forms
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Handle Login
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const result = await signIn(email, password);
    if (result.success) {
        // Redirection is handled in auth.js
        console.log(result.message);
    } else {
        alert(result.message);
    }
});

// Handle Signup
signupFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const result = await signUp(email, password, username);
    if (result.success) {
        alert('Please check your email to confirm your account');
    } else {
        alert('Signup failed: ' + result.error);
    }
});

// Handle Logout
logoutBtn.addEventListener('click', async () => {
    const result = await signOut();
    if (result.success) {
        // Redirection is handled in auth.js
        console.log(result.message);
    } else {
        alert(result.message);
    }
});

// Helper Functions
function showUserProfile(user) {
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    userProfile.style.display = 'block';
    usernameDisplay.textContent = user.user_metadata.username || user.email;
}

function showLoginForm() {
    userProfile.style.display = 'none';
    loginForm.style.display = 'block';
}

// Check if user is already logged in
async function checkAuth() {
    const result = await getCurrentUser();
    if (result.success && result.user) {
        showUserProfile(result.user);
    } else {
        showLoginForm();
    }
}

// Initial auth check
checkAuth(); 