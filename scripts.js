// Revolution Times - Interactive Features
// January 21, 1793

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initExecutionCounter();
    initCommentSystem();
    initNewsletterForm();
    initPollSystem();
    initArticleAnimations();
    initScrollEffects();
    initPopupAlerts();
});

// Execution Counter Animation
function initExecutionCounter() {
    const counter = document.getElementById('execution-counter');
    if (!counter) return;
    
    let count = 1;
    setInterval(() => {
        if (Math.random() > 0.98) { // Random chance to increment
            count++;
            counter.textContent = count;
            counter.style.color = '#ff0000';
            setTimeout(() => {
                counter.style.color = '#dc143c';
            }, 500);
        }
    }, 5000);
}

// Comment System
function initCommentSystem() {
    // Submit comment button
    const submitButtons = document.querySelectorAll('.submit-comment');
    submitButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const form = this.closest('.comment-form');
            const textarea = form.querySelector('textarea');
            
            if (textarea.value.trim()) {
                showNotification('תגובתך נשלחה לבדיקה של הועד למען ביטחון המהפכה... 🔍');
                textarea.value = '';
                
                // Simulate comment approval after delay
                setTimeout(() => {
                    showNotification('תגובתך אושרה! (הפעם...)');
                }, 2000);
            } else {
                showNotification('נא לכתוב משהו לפני השליחה!');
            }
        });
    });
    
    // Like buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentText = this.textContent;
            const match = currentText.match(/[-]?\d+/);
            if (match) {
                let count = parseInt(match[0]);
                count += Math.random() > 0.5 ? 1 : -1;
                this.textContent = currentText.replace(/[-]?\d+/, count);
                
                // Animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
    
    // Reply buttons
    const replyButtons = document.querySelectorAll('.reply-btn');
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            showNotification('תכונת התגובות בפיתוח... (אין לנו תקציב, זו מהפכה!)');
        });
    });
    
    // Report buttons
    const reportButtons = document.querySelectorAll('.report-btn');
    reportButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('האם אתה בטוח שברצונך לדווח לוועד ביטחון המהפכה?')) {
                showNotification('הדיווח נשלח. הסוכנים בדרך... 🚨');
                const comment = this.closest('.comment');
                setTimeout(() => {
                    comment.style.opacity = '0.3';
                    comment.style.textDecoration = 'line-through';
                }, 1000);
            }
        });
    });
    
    // Load more comments
    const loadMoreButtons = document.querySelectorAll('.load-more-comments');
    loadMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.textContent = 'טוען תגובות...';
            setTimeout(() => {
                showNotification('אופס! כל התגובות האחרות צונזרו על ידי הממשלה. 🙊');
                this.textContent = 'אין עוד תגובות זמינות';
                this.disabled = true;
                this.style.background = '#999';
            }, 1000);
        });
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
                showNotification('תודה על ההרשמה! העיתון יגיע אליך מדי בוקר (אם הדואר לא יוצא להורג...)');
                inputs.forEach(input => input.value = '');
                
                // Show suspicious message
                setTimeout(() => {
                    showNotification('פרטיך נשלחו גם לוועד ביטחון המהפכה. לביטחונך, כמובן. 👀');
                }, 2000);
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
                showNotification(`הצבעתך נרשמה: ${optionText} - הועד מעריך את שיתוף הפעולה שלך!`);
                
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
                this.style.background = '#32cd32';
            } else {
                showNotification('נא לבחור אפשרות לפני ההצבעה!');
            }
        });
    });
}

// Article Animations
function initArticleAnimations() {
    const articles = document.querySelectorAll('.article-card, .featured-article');
    
    articles.forEach(article => {
        // Hover effect for engagement counters
        article.addEventListener('mouseenter', function() {
            const likes = this.querySelector('.likes');
            if (likes && Math.random() > 0.7) {
                const match = likes.textContent.match(/\d+/);
                if (match) {
                    const count = parseInt(match[0]);
                    likes.textContent = likes.textContent.replace(/\d+/, count + Math.floor(Math.random() * 5));
                }
            }
        });
        
        // Click tracking
        const readMoreLink = article.querySelector('.read-more');
        if (readMoreLink) {
            readMoreLink.addEventListener('click', function(e) {
                e.preventDefault();
                const views = article.querySelector('.views');
                if (views) {
                    const match = views.textContent.match(/[\d,]+/);
                    if (match) {
                        let count = parseInt(match[0].replace(',', ''));
                        count += Math.floor(Math.random() * 10) + 1;
                        views.textContent = views.textContent.replace(/[\d,]+/, count.toLocaleString());
                    }
                }
                showNotification('המאמר המלא זמין רק למנויים פרימיום! (שלא קיימים עדיין...)');
            });
        }
    });
}

// Scroll Effects
function initScrollEffects() {
    let lastScrollTop = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll(lastScrollTop);
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function handleScroll(scrollTop) {
        // Parallax effect for header
        const header = document.querySelector('.main-header');
        if (header) {
            header.style.transform = `translateY(${scrollTop * 0.3}px)`;
            header.style.opacity = 1 - (scrollTop / 500);
        }
        
        // Fade in articles on scroll
        const articles = document.querySelectorAll('.article-card');
        articles.forEach(article => {
            const rect = article.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }
        });
    }
}

// Popup Alerts (Revolutionary Notifications)
function initPopupAlerts() {
    const messages = [
        'אזהרה: המלוכה עשויה לחזור! היו ערניים!',
        'עדכון: מחירי הלחם עלו שוב ב-15%',
        'שמועה: רובספייר מתכנן טיהור נוסף',
        'חדשות: אוסטריה מתקרבת לגבול!',
        'התראה: נמצאו מרגלים בפריז',
        'עדכון חם: מארי אנטואנט ביקשה יין יקר בכלא'
    ];
    
    // Show random alert every 30 seconds
    setInterval(() => {
        if (Math.random() > 0.7) {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showUrgentAlert(randomMessage);
        }
    }, 30000);
    
    // Show initial alert after 5 seconds
    setTimeout(() => {
        showUrgentAlert('ברוכים הבאים לעיתון המהפכה! העיתון היחיד שנותר (האחרים הוצאו להורג)');
    }, 5000);
}

// Utility Functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1a1a2e;
        color: #f4e4c1;
        padding: 15px 30px;
        border: 2px solid #d4af37;
        border-radius: 5px;
        z-index: 10000;
        max-width: 80%;
        text-align: center;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showUrgentAlert(message) {
    // Create urgent alert overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%);
        color: white;
        padding: 30px;
        border: 3px solid #ffd700;
        max-width: 500px;
        text-align: center;
        border-radius: 5px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    `;
    
    alertBox.innerHTML = `
        <h3 style="font-size: 24px; margin-bottom: 15px;">⚡ התראה דחופה ⚡</h3>
        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">${message}</p>
        <button style="background: #ffd700; color: #8b0000; border: none; padding: 10px 30px; font-size: 16px; font-weight: bold; cursor: pointer; border-radius: 3px;">הבנתי</button>
    `;
    
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    
    // Close on button click
    const closeButton = alertBox.querySelector('button');
    closeButton.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }
    });
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
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Easter Egg - Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showUrgentAlert('🎉 מצאת את הקוד הסודי! מארי אנטואנט שולחת לך עוגה וירטואלית! 🎂');
        konamiCode = [];
    }
});

// Console Easter Egg
console.log('%c חירות! שוויון! אחווה! ', 'background: #1a1a2e; color: #d4af37; font-size: 20px; padding: 10px;');
console.log('%c ברוכים הבאים לעיתון המהפכה - 21 בינואר 1793 ', 'background: #8b0000; color: white; font-size: 14px; padding: 5px;');
console.log('טיפ: נסו את קוד קונאמי (↑↑↓↓←→←→BA) להפתעה מיוחדת!');
