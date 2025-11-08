// Revolution Times - Fully Functional Interactive Features
// January 21, 1793

// Storage for user interactions
let userData = {
    likedArticles: new Set(),
    likedComments: new Set(),
    comments: []
};

// Load saved data from localStorage
function loadUserData() {
    const saved = localStorage.getItem('revolutionTimesData');
    if (saved) {
        const parsed = JSON.parse(saved);
        userData.likedArticles = new Set(parsed.likedArticles || []);
        userData.likedComments = new Set(parsed.likedComments || []);
        userData.comments = parsed.comments || [];
    }
}

// Save data to localStorage
function saveUserData() {
    const toSave = {
        likedArticles: Array.from(userData.likedArticles),
        likedComments: Array.from(userData.likedComments),
        comments: userData.comments
    };
    localStorage.setItem('revolutionTimesData', JSON.stringify(toSave));
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    initExecutionCounter();
    initArticleLikes();
    initCommentSystem();
    initNewsletterForm();
    initPollSystem();
    initScrollEffects();
    initPopupAlerts();
    restoreUserInteractions();
});

// Execution Counter Animation
function initExecutionCounter() {
    const counter = document.getElementById('execution-counter');
    if (!counter) return;
    
    let count = parseInt(counter.textContent) || 1;
    setInterval(() => {
        if (Math.random() > 0.97) {
            count++;
            counter.textContent = count;
            counter.style.transform = 'scale(1.2)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 300);
        }
    }, 5000);
}

// Article Likes - Fully Functional
function initArticleLikes() {
    const likesElements = document.querySelectorAll('.engagement-bar .likes');
    
    likesElements.forEach((likeElement, index) => {
        const articleId = `article-${index}`;
        
        // Mark as liked if already in userData
        if (userData.likedArticles.has(articleId)) {
            likeElement.classList.add('liked');
        }
        
        likeElement.addEventListener('click', function(e) {
            e.preventDefault();
            const match = this.textContent.match(/[\d,]+/);
            if (!match) return;
            
            let count = parseInt(match[0].replace(',', ''));
            
            if (userData.likedArticles.has(articleId)) {
                // Unlike
                count--;
                userData.likedArticles.delete(articleId);
                this.classList.remove('liked');
                showNotification('הלייק הוסר');
            } else {
                // Like
                count++;
                userData.likedArticles.add(articleId);
                this.classList.add('liked');
                showNotification('תודה על הלייק! 💗');
            }
            
            this.textContent = this.textContent.replace(/[\d,]+/, count.toLocaleString());
            saveUserData();
            
            // Animation
            this.style.transform = 'scale(1.3)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// Comment System - Fully Functional
function initCommentSystem() {
    // Submit comment button
    const submitButtons = document.querySelectorAll('.submit-comment');
    submitButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const form = this.closest('.comment-form');
            const textarea = form.querySelector('textarea');
            const commentText = textarea.value.trim();
            
            if (commentText) {
                // Create new comment
                const newComment = {
                    id: `comment-${Date.now()}`,
                    author: 'אזרח_' + Math.floor(Math.random() * 10000),
                    text: commentText,
                    time: 'עכשיו',
                    likes: 0,
                    timestamp: Date.now()
                };
                
                userData.comments.push(newComment);
                saveUserData();
                
                // Add comment to DOM
                addCommentToDOM(newComment, form.nextElementSibling);
                
                textarea.value = '';
                showNotification('תגובתך פורסמה בהצלחה! ✓');
            } else {
                showNotification('נא לכתוב משהו לפני השליחה!');
            }
        });
    });
    
    // Initialize existing comment buttons
    initCommentButtons();
    
    // Load more comments
    const loadMoreButtons = document.querySelectorAll('.load-more-comments');
    loadMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.textContent = 'טוען תגובות...';
            setTimeout(() => {
                showNotification('אלו כל התגובות הזמינות כרגע');
                this.textContent = 'אין עוד תגובות';
                this.disabled = true;
                this.style.opacity = '0.6';
            }, 1000);
        });
    });
}

// Initialize comment action buttons
function initCommentButtons() {
    // Like buttons
    const likeButtons = document.querySelectorAll('.comment-actions .like-btn');
    likeButtons.forEach((button, index) => {
        const commentId = `existing-comment-${index}`;
        
        // Restore liked state
        if (userData.likedComments.has(commentId)) {
            button.classList.add('liked');
        }
        
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            handleCommentLike(this, commentId);
        });
    });
    
    // Reply buttons
    const replyButtons = document.querySelectorAll('.reply-btn');
    replyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const commentText = this.closest('.comment').querySelector('.comment-text').textContent;
            const commenterName = this.closest('.comment').querySelector('.commenter-name').textContent;
            
            // Find nearest comment form
            const section = this.closest('.comments-section');
            const textarea = section.querySelector('textarea');
            if (textarea) {
                textarea.value = `תגובה ל-${commenterName}: `;
                textarea.focus();
                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
    
    // Report buttons
    const reportButtons = document.querySelectorAll('.report-btn');
    reportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('האם אתה בטוח שברצונך לדווח על תגובה זו?')) {
                showNotification('הדיווח נשלח לצוות המנהלים 🚨');
                const comment = this.closest('.comment');
                comment.style.opacity = '0.5';
                comment.style.pointerEvents = 'none';
                setTimeout(() => {
                    const badge = document.createElement('span');
                    badge.className = 'warning-badge';
                    badge.textContent = '⚠️ דווח';
                    comment.querySelector('.comment-header').appendChild(badge);
                }, 500);
            }
        });
    });
}

// Handle comment like
function handleCommentLike(button, commentId) {
    const match = button.textContent.match(/[-]?\d+/);
    if (!match) return;
    
    let count = parseInt(match[0]);
    
    if (userData.likedComments.has(commentId)) {
        // Unlike
        count--;
        userData.likedComments.delete(commentId);
        button.classList.remove('liked');
    } else {
        // Like
        count++;
        userData.likedComments.add(commentId);
        button.classList.add('liked');
    }
    
    button.textContent = button.textContent.replace(/[-]?\d+/, count);
    saveUserData();
    
    // Animation
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// Add comment to DOM (with XSS protection)
function addCommentToDOM(comment, commentsList) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    
    // Create elements safely without innerHTML for user content
    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';
    
    const commenterName = document.createElement('span');
    commenterName.className = 'commenter-name';
    commenterName.textContent = comment.author; // Safe - uses textContent
    
    const commentTime = document.createElement('span');
    commentTime.className = 'comment-time';
    commentTime.textContent = comment.time;
    
    const badge = document.createElement('span');
    badge.className = 'warning-badge';
    badge.style.background = '#00a86b';
    badge.textContent = '✓ חדש';
    
    commentHeader.appendChild(commenterName);
    commentHeader.appendChild(commentTime);
    commentHeader.appendChild(badge);
    
    const commentText = document.createElement('p');
    commentText.className = 'comment-text';
    commentText.textContent = comment.text; // Safe - uses textContent
    
    const commentActions = document.createElement('div');
    commentActions.className = 'comment-actions';
    
    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.setAttribute('data-comment-id', comment.id);
    likeBtn.textContent = `👍 ${comment.likes}`;
    
    const replyBtn = document.createElement('button');
    replyBtn.className = 'reply-btn';
    replyBtn.textContent = '↩️ השב';
    
    commentActions.appendChild(likeBtn);
    commentActions.appendChild(replyBtn);
    
    commentElement.appendChild(commentHeader);
    commentElement.appendChild(commentText);
    commentElement.appendChild(commentActions);
    commentElement.appendChild(commentHeader);
    commentElement.appendChild(commentText);
    commentElement.appendChild(commentActions);
    
    // Insert at the beginning of comments list
    commentsList.insertBefore(commentElement, commentsList.firstChild);
    
    // Initialize buttons for new comment
    likeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        handleCommentLike(this, comment.id);
    });
    
    replyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const section = this.closest('.comments-section');
        const textarea = section.querySelector('textarea');
        if (textarea) {
            textarea.value = `תגובה ל-${comment.author}: `;
            textarea.focus();
        }
    });
    
    // Highlight animation
    commentElement.style.animation = 'fadeIn 0.5s ease-out';
}

// Restore user interactions on page load
function restoreUserInteractions() {
    // Restore article likes
    document.querySelectorAll('.engagement-bar .likes').forEach((element, index) => {
        const articleId = `article-${index}`;
        if (userData.likedArticles.has(articleId)) {
            element.classList.add('liked');
        }
    });
    
    // Restore comment likes
    document.querySelectorAll('.comment-actions .like-btn').forEach((button, index) => {
        const commentId = `existing-comment-${index}`;
        if (userData.likedComments.has(commentId)) {
            button.classList.add('liked');
        }
    });
}

// Newsletter Form
function initNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputs = form.querySelectorAll('input');
            let allFilled = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    allFilled = false;
                }
            });
            
            if (allFilled) {
                showNotification('תודה על ההרשמה! העיתון יגיע אליך מדי בוקר ✓');
                inputs.forEach(input => input.value = '');
            } else {
                showNotification('נא למלא את כל השדות!');
            }
        });
    });
}

// Poll System
function initPollSystem() {
    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pollSection = this.closest('.poll-section');
            const selectedOption = pollSection.querySelector('input[type="radio"]:checked');
            
            if (selectedOption) {
                const optionText = selectedOption.nextElementSibling.querySelector('.poll-text').textContent;
                showNotification(`הצבעתך נרשמה: ${optionText} ✓`);
                
                // Update counter
                const disclaimer = pollSection.querySelector('.poll-disclaimer');
                if (disclaimer) {
                    const match = disclaimer.textContent.match(/[\d,]+/);
                    if (match) {
                        let count = parseInt(match[0].replace(',', ''));
                        count++;
                        disclaimer.textContent = disclaimer.textContent.replace(/[\d,]+/, count.toLocaleString());
                    }
                }
                
                this.textContent = 'הצבעה נרשמה!';
                this.disabled = true;
                this.style.opacity = '0.7';
            } else {
                showNotification('נא לבחור אפשרות לפני ההצבעה!');
            }
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Fade in articles on scroll
        const articles = document.querySelectorAll('.article-card');
        articles.forEach(article => {
            const rect = article.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                article.style.opacity = '1';
            }
        });
        
        lastScrollTop = scrollTop;
    });
}

// Popup Alerts
function initPopupAlerts() {
    // Show welcome alert after 3 seconds
    setTimeout(() => {
        showNotification('ברוכים הבאים לעיתון המהפכה! 🗞️');
    }, 3000);
}

// Utility: Show Notification
function showNotification(message) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.toast-notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #1a1a1a;
        color: white;
        padding: 15px 30px;
        border-radius: 4px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease-out;
        max-width: 90%;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translate(-50%, 100px);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, 100px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Console message
console.log('%c חירות! שוויון! אחווה! ', 'background: #c80000; color: white; font-size: 18px; padding: 10px; font-weight: bold;');
console.log('%c עיתון המהפכה - 21 בינואר 1793 ', 'background: #1a1a1a; color: white; font-size: 14px; padding: 5px;');
console.log('כל הפיצ\'רים האינטראקטיביים עובדים! נסו ללחוץ על הלייקים והתגובות.');
