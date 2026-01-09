// PRAJOS Blog CMS Application

// State management
let posts = [];
let editingPostId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupFormHandler();
});

// Load all posts from API
async function loadPosts() {
    try {
        const postsList = document.getElementById('postsList');
        postsList.innerHTML = '<div class="joko-loading">Memuat posts...</div>';
        
        posts = await JokoUI.fetch('/posts');
        renderPosts();
    } catch (error) {
        document.getElementById('postsList').innerHTML = 
            '<div class="joko-empty">❌ Gagal memuat posts. Silakan coba lagi.</div>';
        console.error('Error loading posts:', error);
    }
}

// Render posts to DOM
function renderPosts() {
    const postsList = document.getElementById('postsList');
    
    if (posts.length === 0) {
        postsList.innerHTML = `
            <div class="joko-empty">
                <div class="joko-empty-icon">📝</div>
                <p>Belum ada post. Mulai tulis sesuatu!</p>
            </div>
        `;
        return;
    }
    
    // Sort posts by date (newest first)
    const sortedPosts = [...posts].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
    );
    
    postsList.innerHTML = sortedPosts.map(post => `
        <div class="joko-post-item" data-id="${post.id}">
            <div class="joko-post-header">
                <div>
                    <h3 class="joko-post-title">${escapeHtml(post.title)}</h3>
                    <div class="joko-post-meta">
                        👤 ${escapeHtml(post.author)} • 
                        📅 ${JokoUI.formatDate(post.created_at)}
                    </div>
                </div>
            </div>
            <div class="joko-post-content">${escapeHtml(post.content)}</div>
            <div class="joko-post-actions">
                <button class="joko-button joko-button-success joko-button-small" onclick="editPost(${post.id})">
                    ✏️ Edit
                </button>
                <button class="joko-button joko-button-danger joko-button-small" onclick="deletePost(${post.id})">
                    🗑️ Hapus
                </button>
            </div>
        </div>
    `).join('');
}

// Setup form submit handler
function setupFormHandler() {
    const form = document.getElementById('postForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await savePost();
    });
}

// Save post (create or update)
async function savePost() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const content = document.getElementById('content').value.trim();
    const postId = document.getElementById('postId').value;
    
    if (!title || !author || !content) {
        JokoUI.showNotification('Semua field harus diisi!', 'danger');
        return;
    }
    
    const postData = { title, author, content };
    
    try {
        if (postId) {
            // Update existing post
            await JokoUI.fetch(`/posts/${postId}`, {
                method: 'PUT',
                body: JSON.stringify(postData)
            });
            JokoUI.showNotification('✅ Post berhasil diupdate!', 'success');
        } else {
            // Create new post
            await JokoUI.fetch('/posts', {
                method: 'POST',
                body: JSON.stringify(postData)
            });
            JokoUI.showNotification('✅ Post berhasil dibuat!', 'success');
        }
        
        resetForm();
        await loadPosts();
        
        // Scroll to posts list
        document.querySelector('.joko-posts-list').scrollIntoView({ 
            behavior: 'smooth' 
        });
    } catch (error) {
        JokoUI.showNotification('❌ Gagal menyimpan post. Silakan coba lagi.', 'danger');
        console.error('Error saving post:', error);
    }
}

// Edit post
function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    
    document.getElementById('postId').value = post.id;
    document.getElementById('title').value = post.title;
    document.getElementById('author').value = post.author;
    document.getElementById('content').value = post.content;
    
    document.querySelector('.joko-card-title').textContent = '✏️ Edit Post';
    document.querySelector('button[type="submit"]').textContent = '💾 Update Post';
    
    // Scroll to form
    document.getElementById('formSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Delete post
async function deletePost(id) {
    if (!confirm('Yakin ingin menghapus post ini?')) {
        return;
    }
    
    try {
        await JokoUI.fetch(`/posts/${id}`, {
            method: 'DELETE'
        });
        
        JokoUI.showNotification('✅ Post berhasil dihapus!', 'success');
        await loadPosts();
    } catch (error) {
        JokoUI.showNotification('❌ Gagal menghapus post. Silakan coba lagi.', 'danger');
        console.error('Error deleting post:', error);
    }
}

// Reset form
function resetForm() {
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    document.querySelector('.joko-card-title').textContent = '✍️ Tulis Post Baru';
    document.querySelector('button[type="submit"]').textContent = '💾 Simpan Post';
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available
window.editPost = editPost;
window.deletePost = deletePost;
window.resetForm = resetForm;
