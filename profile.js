import { supabase } from './supabase.js';
import { signOut } from './auth.js';

// Check if user is logged in
async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    return session.user;
}

// Load user profile data
async function loadProfile() {
    const user = await checkAuth();
    if (!user) return;

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error loading profile:', error);
        return;
    }

    // Populate form fields
    document.getElementById('display-name').value = profile.display_name || '';
    document.getElementById('bio').value = profile.bio || '';
    document.getElementById('theme').value = profile.theme || 'system';
    document.getElementById('email-notifications').checked = profile.email_notifications;
    document.getElementById('push-notifications').checked = profile.push_notifications;

    // Set profile picture if exists
    if (profile.avatar_url) {
        document.getElementById('profile-picture').src = profile.avatar_url;
    }
}

// Handle profile picture upload
async function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const user = await checkAuth();
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating profile:', updateError);
        return;
    }

    document.getElementById('profile-picture').src = publicUrl;
}

// Save profile changes
async function saveProfile(event) {
    event.preventDefault();
    const user = await checkAuth();
    if (!user) return;

    const formData = {
        display_name: document.getElementById('display-name').value,
        bio: document.getElementById('bio').value,
        theme: document.getElementById('theme').value,
        email_notifications: document.getElementById('email-notifications').checked,
        push_notifications: document.getElementById('push-notifications').checked,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

    if (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile changes. Please try again.');
        return;
    }

    alert('Profile updated successfully!');
}

// Handle logout
async function handleLogout() {
    await signOut();
    window.location.href = 'login.html';
}

// Handle account deletion
async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }

    const user = await checkAuth();
    if (!user) return;

    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

    if (error) {
        console.error('Error deleting profile:', error);
        return;
    }

    await signOut();
    window.location.href = 'login.html';
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', async () => {
    await loadProfile();

    document.getElementById('change-picture').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = handleProfilePictureUpload;
        input.click();
    });

    document.getElementById('profile-form').addEventListener('submit', saveProfile);
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.getElementById('delete-account').addEventListener('click', handleDeleteAccount);
}); 