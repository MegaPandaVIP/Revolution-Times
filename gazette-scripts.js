// Le Guillotine Gazette - Interactive JavaScript

// GitHub configuration - UPDATE THESE VALUES
const GITHUB_CONFIG = {
    owner: 'MegaPandaVIP',
    repo: 'Revolution-Times',
    branch: 'main',
    token: '', // Add your GitHub personal access token here
};

// Update current time
function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = `Paris Time: ${now.toLocaleString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }
}

// Update guillotine counter with random increments
function updateGuillotineCounter() {
    const counter = document.getElementById('guillotine-counter');
    if (counter) {
        let count = parseInt(localStorage.getItem('guillotineCount') || '0');
        count += Math.floor(Math.random() * 3); // Increment by 0-2
        localStorage.setItem('guillotineCount', count.toString());
        counter.textContent = count;
    }
}

// Animate view counters
function animateViewCounters() {
    const counters = document.querySelectorAll('.view-count');
    counters.forEach(counter => {
        const originalValue = parseInt(counter.textContent.replace(/,/g, ''));
        let currentValue = originalValue;
        
        const interval = setInterval(() => {
            currentValue += Math.floor(Math.random() * 50);
            counter.textContent = currentValue.toLocaleString();
        }, 5000);
    });
}

// Save comment to GitHub repository
async function saveCommentToGitHub(comment) {
    if (!GITHUB_CONFIG.token) {
        console.warn('GitHub token not configured. Comment will only be saved locally.');
        return false;
    }
    
    try {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const filename = `comment_${timestamp}_${random}.txt`;
        const path = `comments/${filename}`;
        
        const commentContent = [
            '=' .repeat(60),
            'LE GUILLOTINE GAZETTE - READER COMMENT',
            '='.repeat(60),
            '',
            `Page: ${comment.page || 'Unknown'}`,
            `Author: ${comment.name}`,
            `Timestamp: ${comment.timestamp}`,
            `Posted: ${new Date(comment.timestamp).toLocaleString('fr-FR')}`,
            '',
            '-'.repeat(60),
            'COMMENT:',
            '-'.repeat(60),
            '',
            comment.text,
            '',
            '='.repeat(60),
            `Saved to repository: ${new Date().toLocaleString('fr-FR')}`,
            '='.repeat(60)
        ].join('\n');
        
        // Encode content to base64
        const contentBase64 = btoa(unescape(encodeURIComponent(commentContent)));
        
        // Create file via GitHub API
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Add comment from ${comment.name}`,
                    content: contentBase64,
                    branch: GITHUB_CONFIG.branch
                })
            }
        );
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Comment saved to GitHub: ${filename}`);
            return true;
        } else {
            const error = await response.json();
            console.error('Failed to save comment to GitHub:', error);
            return false;
        }
    } catch (error) {
        console.error('Error saving comment to GitHub:', error);
        return false;
    }
}

// Handle comment submission
async function handleCommentSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    
    if (!name || !text) {
        alert('Please fill in all fields!');
        return;
    }
    
    // Disable submit button while processing
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    
    // Create comment object
    const comment = {
        name: name,
        text: text,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };
    
    // Save comment to GitHub
    const savedToGitHub = await saveCommentToGitHub(comment);
    
    // Save comment locally regardless
    saveCommentLocally(comment);
    
    // Display the comment
    displayComment(comment);
    
    // Clear form
    nameInput.value = '';
    textInput.value = '';
    
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Comment';
    
    // Show success message
    if (savedToGitHub) {
        showNotification('Comment saved to repository! Vive la Révolution! 🎉');
    } else {
        showNotification('Comment saved locally! (Configure GitHub token to save to repo)');
    }
}

// Save comment to localStorage
function saveCommentLocally(comment) {
    const storageKey = `comments_${comment.page}`;
    let comments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    comments.unshift(comment); // Add to beginning
    
    // Keep only last 50 comments per page
    if (comments.length > 50) {
        comments = comments.slice(0, 50);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(comments));
}

// Display a single comment
function displayComment(comment) {
    const commentsDisplay = document.getElementById('comments-display');
    if (!commentsDisplay) return;
    
    const commentDiv = document.createElement('div');
    commentDiv.className = 'bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in';
    
    const date = new Date(comment.timestamp);
    const timeAgo = getTimeAgo(date);
    
    commentDiv.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <span class="font-bold text-gray-800">${escapeHtml(comment.name)}</span>
            <span class="text-sm text-gray-500">${timeAgo}</span>
        </div>
        <p class="text-gray-700">${escapeHtml(comment.text)}</p>
    `;
    
    commentsDisplay.insertBefore(commentDiv, commentsDisplay.firstChild);
}

// Load and display existing comments
function loadComments() {
    const commentsDisplay = document.getElementById('comments-display');
    if (!commentsDisplay) return;
    
    const storageKey = `comments_${window.location.pathname}`;
    const comments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    comments.forEach(comment => {
        displayComment(comment);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString('fr-FR');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add hover effects to articles
function addArticleEffects() {
    const articles = document.querySelectorAll('article');
    articles.forEach(article => {
        article.addEventListener('mouseenter', () => {
            article.style.transform = 'translateY(-5px)';
            article.style.transition = 'transform 0.3s ease';
        });
        
        article.addEventListener('mouseleave', () => {
            article.style.transform = 'translateY(0)';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update time immediately and every minute
    updateTime();
    setInterval(updateTime, 60000);
    
    // Update guillotine counter
    updateGuillotineCounter();
    setInterval(updateGuillotineCounter, 10000);
    
    // Animate view counters
    animateViewCounters();
    
    // Load existing comments
    loadComments();
    
    // Add comment form handler
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }
    
    // Add article effects
    addArticleEffects();
    
    console.log('⚔️ Le Guillotine Gazette loaded successfully! Vive la Révolution! ⚔️');
    
    // Check if GitHub token is configured
    if (!GITHUB_CONFIG.token) {
        console.warn('⚠️ GitHub token not configured. Comments will only be saved locally.');
        console.log('To enable saving to repository, add your GitHub token to gazette-scripts.js');
    }
});

// Add some CSS animations via style tag
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slide-in {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    .animate-fade-in {
        animation: fade-in 0.5s ease-out;
    }
    
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);
