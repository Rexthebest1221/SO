import { supabase, signOut, getCurrentUser } from './auth.js';

// Check authentication
async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        window.location.href = 'index.html';
        return;
    }
    return user;
}

// Initialize the application
async function initApp() {
    const user = await checkAuth();
    if (!user) return;

    // Set user information
    document.getElementById('username-display').textContent = user.user_metadata.username || user.email;

    // Load initial data
    await loadFeed();
    await loadTrendingTopics();
    await loadSuggestedGroups();

    // Set up event listeners
    setupEventListeners();
}

// Load feed posts
async function loadFeed() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles:author_id (
                username,
                avatar_url
            )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error loading posts:', error);
        return;
    }

    const feed = document.querySelector('.feed');
    feed.innerHTML = posts.map(post => createPostElement(post)).join('');
}

// Create post element
function createPostElement(post) {
    return `
        <div class="post">
            <div class="post-header">
                <img src="${post.profiles.avatar_url || 'https://via.placeholder.com/40'}" alt="Avatar" class="post-avatar">
                <div class="post-info">
                    <span class="post-author">${post.profiles.username}</span>
                    <span class="post-date">${new Date(post.created_at).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
            </div>
            <div class="post-actions">
                <button class="like-button"><i class="fas fa-heart"></i> Like</button>
                <button class="comment-button"><i class="fas fa-comment"></i> Comment</button>
                <button class="share-button"><i class="fas fa-share"></i> Share</button>
            </div>
        </div>
    `;
}

// Load trending topics
async function loadTrendingTopics() {
    const { data: topics, error } = await supabase
        .from('posts')
        .select('title')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error loading trending topics:', error);
        return;
    }

    const trendingTopics = document.querySelector('.trending-topics');
    trendingTopics.innerHTML = topics.map(topic => `
        <div class="trending-topic">
            <i class="fas fa-hashtag"></i>
            <span>${topic.title}</span>
        </div>
    `).join('');
}

// Load suggested groups
async function loadSuggestedGroups() {
    const { data: groups, error } = await supabase
        .from('groups')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error loading suggested groups:', error);
        return;
    }

    const groupList = document.querySelector('.group-list');
    groupList.innerHTML = groups.map(group => `
        <div class="group-item">
            <i class="fas fa-users"></i>
            <span>${group.name}</span>
        </div>
    `).join('');
}

// Set up event listeners
function setupEventListeners() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', async () => {
        const result = await signOut();
        if (result.success) {
            window.location.href = 'index.html';
        }
    });

    // Post form
    const postForm = document.querySelector('.post-form');
    const postTextarea = postForm.querySelector('textarea');
    const postButton = postForm.querySelector('.post-button');

    postButton.addEventListener('click', async () => {
        const content = postTextarea.value.trim();
        if (!content) return;

        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
            .from('posts')
            .insert([
                {
                    title: content.substring(0, 50),
                    content: content,
                    author_id: user.id
                }
            ]);

        if (error) {
            console.error('Error creating post:', error);
            return;
        }

        postTextarea.value = '';
        await loadFeed();
    });
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initApp); 