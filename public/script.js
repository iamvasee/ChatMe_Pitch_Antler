// ChatMe Interactive Pitch Deck
// Simulating a chat with Dr. APJ Abdul Kalam

class ChatMePitchDeck {
    constructor() {
        this.isTyping = false;
        this.quickReplies = PITCH_DECK_CONFIG.quickReplies;
        this.responses = PITCH_DECK_CONFIG.responses;
        this.usedQuestions = new Set(); // Track used questions
        this.fullscreenPrompted = false;
        
        // Audio elements - handle missing files gracefully
        this.botMessageSound = new Audio('message_received.mp3');
        this.userMessageSound = new Audio('message_sent.mp3');
        this.responseSound = new Audio('message_received.mp3');
        
        // Handle audio loading errors
        this.botMessageSound.addEventListener('error', () => console.log('Bot message sound not found'));
        this.userMessageSound.addEventListener('error', () => console.log('User message sound not found'));
        this.responseSound.addEventListener('error', () => console.log('Response sound not found'));
        
        this.chatMessages = document.getElementById('chatMessages');
        this.quickRepliesContainer = document.getElementById('quickReplies');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.chatContainer = document.querySelector('.chat-container');
        
        // Check if required elements exist
        if (!this.chatMessages || !this.quickRepliesContainer || !this.loadingScreen || !this.chatContainer) {
            console.error('Required DOM elements not found');
            this.showErrorMessage('Failed to initialize the presentation. Please refresh the page.');
            return;
        }
        
        this.setupEventListeners();
        this.initializePresentation();
        this.optimizePerformance();
    }

    initializePresentation() {
        // Simulate loading time and then start presentation
        setTimeout(() => {
            this.hideLoadingScreen();
            this.startPresentation();
        }, 3000); // 3 second loading time
    }

    hideLoadingScreen() {
        // Fade out loading screen
        this.loadingScreen.classList.add('fade-out');
        
        // Show chat container
        this.chatContainer.classList.add('loaded');
        
        // Remove loading screen from DOM after animation
        setTimeout(() => {
            if (this.loadingScreen.parentNode) {
                this.loadingScreen.parentNode.removeChild(this.loadingScreen);
            }
        }, 800);
    }

    setupEventListeners() {
        // Attempt automatic fullscreen immediately when page loads
        this.attemptAutomaticFullscreen();
        
        // Add touch-friendly improvements
        this.setupTouchOptimizations();
    }

    setupTouchOptimizations() {
        // Add touch event listeners for better mobile interaction
        if ('ontouchstart' in window) {
            // Improve touch targets
            document.addEventListener('touchstart', (e) => {
                // Add visual feedback for touch
                if (e.target.classList.contains('quick-reply') || 
                    e.target.classList.contains('header-actions') ||
                    e.target.closest('.quick-replies-header')) {
                    e.target.style.transform = 'scale(0.95)';
                }
            }, { passive: true });
            
            document.addEventListener('touchend', (e) => {
                // Remove visual feedback
                if (e.target.classList.contains('quick-reply') || 
                    e.target.classList.contains('header-actions') ||
                    e.target.closest('.quick-replies-header')) {
                    setTimeout(() => {
                        e.target.style.transform = '';
                    }, 150);
                }
            }, { passive: true });
            
            // Prevent zoom on double tap
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (e) => {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
        
        // Add scroll detection for accordion visibility
        this.setupScrollDetection();
    }

    setupScrollDetection() {
        let lastScrollTop = 0;
        let scrollDirection = 'down';
        let scrollThreshold = 50; // Minimum scroll distance to trigger accordion reveal
        
        this.chatMessages.addEventListener('scroll', (e) => {
            const currentScrollTop = e.target.scrollTop;
            const scrollDistance = Math.abs(currentScrollTop - lastScrollTop);
            
            // Determine scroll direction
            if (currentScrollTop > lastScrollTop) {
                scrollDirection = 'down';
            } else {
                scrollDirection = 'up';
            }
            
            // If scrolling down and near the bottom, reveal accordion
            if (scrollDirection === 'down' && scrollDistance > scrollThreshold) {
                const scrollPercentage = (currentScrollTop / (e.target.scrollHeight - e.target.clientHeight)) * 100;
                
                // If scrolled more than 80% down, ensure accordion is visible
                if (scrollPercentage > 80) {
                    this.ensureAccordionVisible();
                }
            }
            
            lastScrollTop = currentScrollTop;
        }, { passive: true });
    }

    ensureAccordionVisible() {
        const accordionPanel = document.querySelector('.quick-replies-panel');
        const accordionHeader = document.querySelector('.quick-replies-header');
        
        if (accordionPanel && accordionHeader) {
            // Check if accordion is currently hidden
            if (!accordionPanel.classList.contains('open')) {
                // Open the accordion
                accordionPanel.classList.add('open');
                accordionHeader.setAttribute('aria-expanded', 'true');
                
                // Add a subtle animation to draw attention
                accordionHeader.style.animation = 'accordionPulse 0.6s ease-in-out';
                setTimeout(() => {
                    accordionHeader.style.animation = '';
                }, 600);
                
                // Scroll the accordion into view smoothly
                setTimeout(() => {
                    accordionHeader.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'end',
                        inline: 'nearest'
                    });
                }, 100);
            }
        }
    }

    checkAccordionVisibility() {
        const accordionHeader = document.querySelector('.quick-replies-header');
        if (!accordionHeader) return;
        
        // Check if accordion is visible in viewport
        const rect = accordionHeader.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        // If not visible and there are available questions, show a hint
        if (!isVisible && this.quickReplies.filter(q => !this.usedQuestions.has(q)).length > 0) {
            // Removed the hint functionality as requested
            // this.showAccordionHint();
        }
    }

    attemptAutomaticFullscreen() {
        // Check if fullscreen is supported
        if (!document.fullscreenEnabled && 
            !document.webkitFullscreenEnabled && 
            !document.mozFullScreenEnabled && 
            !document.msFullscreenEnabled) {
            console.log('Fullscreen not supported');
            return;
        }

        // Try to enter fullscreen automatically after a short delay
        setTimeout(() => {
            this.enterFullscreen().catch(error => {
                console.log('Automatic fullscreen failed:', error);
                // Show a subtle notification that fullscreen is available
                this.showFullscreenHint();
            });
        }, 1500); // 1.5 second delay after page load
    }

    showFullscreenHint() {
        // Create a subtle hint that fullscreen is available
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(139, 92, 246, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-family: 'Manrope', sans-serif;
            z-index: 1000;
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        hint.innerHTML = '💻 Click for fullscreen';
        hint.title = 'Click to enter fullscreen mode';
        
        document.body.appendChild(hint);
        
        // Animate in
        setTimeout(() => {
            hint.style.opacity = '1';
            hint.style.transform = 'translateX(0)';
        }, 100);
        
        // Add click handler
        hint.addEventListener('click', () => {
            this.enterFullscreen().catch(error => {
                console.log('Manual fullscreen failed:', error);
            });
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            hint.style.opacity = '0';
            hint.style.transform = 'translateX(20px)';
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.parentNode.removeChild(hint);
                }
            }, 300);
        }, 5000);
    }

    startPresentation() {
        // Show the first message immediately after loading screen disappears
        const welcomeMessage = `🙏 **Namaste! My dear friends**

I am Dr. APJ Abdul Kalam, former President of India, aerospace scientist, and now, I am also one of the AI characters on ChatMe.At - India's revolutionary AI Companion Platform.

*"Dream, dream, dream. Dreams transform into thoughts and thoughts result in action."*

This is exactly what ChatMe is doing - transforming dreams into reality for 1.4 billion Indian hearts.

*"The future of emotional AI, built for 1.4B desi souls."*

Our mission is clear: *"Not just chat. Real connection."*

As someone who always believed that technology should serve humanity, I am excited to present this platform that understands the heart and soul of India. ChatMe is not just building a product - we are creating a cultural phenomenon that will touch every Indian household.

**What would you like to know about this incredible journey?**`;

        this.addBotMessage(welcomeMessage, () => {
            this.showQuickReplies();
        });
    }

    addBotMessage(message, callback = null) {
        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            
            // Play response sound when message appears
            if (this.responseSound && this.responseSound.readyState >= 2) {
                this.responseSound.play().catch(e => console.log('Response sound failed:', e));
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot';
            
            // Convert markdown-like formatting to HTML
            const formattedMessage = this.formatMessage(message);
            
            // Sanitize HTML content before setting innerHTML
            const sanitizedContent = this.sanitizeHTML(formattedMessage);
            
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="image.png" alt="APJ Abdul Kalam" aria-label="Dr. APJ Abdul Kalam's avatar" loading="lazy">
                </div>
                <div class="message-content" role="article" aria-label="Message from Dr. APJ Abdul Kalam">
                    <div class="message-html">${sanitizedContent}</div>
                </div>
            `;
            
            this.chatMessages.appendChild(messageDiv);
            
            // Trigger animation after a brief delay
            setTimeout(() => {
                messageDiv.classList.add('show');
            }, 50);
            
            this.scrollToBottom();
            
            if (callback) {
                setTimeout(callback, 500);
            }
        }, 2500); // 2.5 seconds total (2s typing + 0.5s delay)
    }

    formatMessage(message) {
        // Check if the message contains HTML tags
        if (message.includes('<div') || message.includes('<h2') || message.includes('<ul>') || message.includes('<p>')) {
            // If it's HTML content, return it as-is
            return message;
        } else {
            // Convert markdown-like formatting to HTML for plain text
            return message
                // Bold text **text** -> <strong>text</strong>
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                // Italic text *text* -> <em>text</em>
                .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
                // Bullets • text -> <li>text</li>
                .replace(/^• (.+)$/gm, '<li>$1</li>')
                // Wrap consecutive <li> tags in <ul>
                .replace(/(<li>.*<\/li>\s*)+/gs, '<ul>$&</ul>')
                // Line breaks
                .replace(/\n/g, '<br>');
        }
    }

    addUserMessage(message) {
        // Play user message sound
        if (this.userMessageSound && this.userMessageSound.readyState >= 2) {
            this.userMessageSound.play().catch(e => console.log('Audio play failed:', e));
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        
        // Sanitize user message
        const sanitizedMessage = this.sanitizeHTML(`<p>${message}</p>`);
        
        messageDiv.innerHTML = `
            <div class="message-content" role="article" aria-label="Your message">
                ${sanitizedMessage}
            </div>
            <div class="message-avatar">
                <img src="image copy.png" alt="User" aria-label="Your avatar" loading="lazy">
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        
        // Trigger animation after a brief delay
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 50);
        
        this.scrollToBottom();
    }

    showTyping() {
        this.isTyping = true;
        // this.typingIndicator.classList.add('show'); // Removed as per edit hint
    }

    hideTyping() {
        this.isTyping = false;
        // this.typingIndicator.classList.remove('show'); // Removed as per edit hint
    }

    showQuickReplies() {
        this.quickRepliesContainer.innerHTML = '';
        
        // Get available questions (not used yet)
        const availableQuestions = this.quickReplies.filter(q => !this.usedQuestions.has(q));
        
        // If all questions are used, show a completion message
        if (availableQuestions.length === 0) {
            const completionMessage = `🎉 **Presentation Complete!**

Thank you for your excellent questions. We've covered all the key aspects of ChatMe.

**Contact Information:**
• Email: vaseekaran@chatme.at
• Website: www.chatme.at

Let's build India's first AI entertainment empire together! 🙏

**Thank you for exploring ChatMe with me!**`;

            this.addBotMessage(completionMessage);
            this.stopAccordionVisibilityMonitoring();
            return;
        }
        
        // Create accordion structure
        const accordionHeader = document.createElement('div');
        accordionHeader.className = 'quick-replies-header';
        accordionHeader.setAttribute('role', 'button');
        accordionHeader.setAttribute('tabindex', '0');
        accordionHeader.setAttribute('aria-expanded', 'false');
        accordionHeader.setAttribute('aria-controls', 'quick-replies-panel');
        
        // Sanitize accordion header HTML
        const headerHTML = `
            <h4>💬 Ask APJ a Question</h4>
            <div class="quick-replies-toggle">
                <span>${availableQuestions.length} questions available</span>
                <i class="fas fa-chevron-down" aria-hidden="true"></i>
            </div>
        `;
        accordionHeader.innerHTML = this.sanitizeHTML(headerHTML);
        
        const accordionPanel = document.createElement('div');
        accordionPanel.className = 'quick-replies-panel';
        accordionPanel.setAttribute('id', 'quick-replies-panel');
        accordionPanel.setAttribute('role', 'region');
        accordionPanel.setAttribute('aria-label', 'Available questions');
        
        const questionsGrid = document.createElement('div');
        questionsGrid.className = 'quick-replies-grid';
        questionsGrid.setAttribute('role', 'group');
        questionsGrid.setAttribute('aria-label', 'Question options');
        
        // Add available questions
        availableQuestions.forEach((reply, index) => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = reply;
            button.setAttribute('type', 'button');
            button.setAttribute('aria-label', `Ask: ${reply}`);
            button.setAttribute('tabindex', '0');
            button.addEventListener('click', () => this.handleQuickReply(reply));
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleQuickReply(reply);
                }
            });
            questionsGrid.appendChild(button);
        });
        
        accordionPanel.appendChild(questionsGrid);
        this.quickRepliesContainer.appendChild(accordionHeader);
        this.quickRepliesContainer.appendChild(accordionPanel);
        
        // Add click handler for accordion toggle
        accordionHeader.addEventListener('click', () => {
            const panel = accordionPanel;
            const toggle = accordionHeader.querySelector('.quick-replies-toggle');
            const icon = toggle.querySelector('i');
            
            if (panel.classList.contains('open')) {
                panel.classList.remove('open');
                toggle.classList.remove('rotated');
                accordionHeader.setAttribute('aria-expanded', 'false');
            } else {
                panel.classList.add('open');
                toggle.classList.add('rotated');
                accordionHeader.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Add keyboard support for accordion
        accordionHeader.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                accordionHeader.click();
            }
        });
        
        // Check if accordion is visible after a short delay
        setTimeout(() => {
            this.checkAccordionVisibility();
        }, 500);
        
        // Set up periodic visibility checks
        this.startAccordionVisibilityMonitoring();
    }

    startAccordionVisibilityMonitoring() {
        // Check accordion visibility every 3 seconds
        this.accordionVisibilityInterval = setInterval(() => {
            this.checkAccordionVisibility();
        }, 3000);
    }

    stopAccordionVisibilityMonitoring() {
        if (this.accordionVisibilityInterval) {
            clearInterval(this.accordionVisibilityInterval);
            this.accordionVisibilityInterval = null;
        }
    }

    handleQuickReply(reply) {
        this.addUserMessage(reply);
        this.quickRepliesContainer.innerHTML = '';
        
        // Mark this question as used
        this.usedQuestions.add(reply);
        
        // Get the response for this question
        const response = this.responses[reply];
        
        if (response) {
            setTimeout(() => {
                this.addBotMessage(response, () => {
                    this.showQuickReplies();
                });
            }, 1000);
        } else {
            // Fallback response if no specific response found
            setTimeout(() => {
                this.addBotMessage("Thank you for that question. Let me provide you with more information about ChatMe...", () => {
                    this.showQuickReplies();
                });
            }, 1000);
        }
    }

    hasCommonKeywords(message1, message2) {
        const keywords1 = message1.split(' ').filter(word => word.length > 3);
        const keywords2 = message2.split(' ').filter(word => word.length > 3);
        
        return keywords1.some(keyword => keywords2.includes(keyword));
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    enterFullscreen() {
        const element = document.documentElement;
        
        return new Promise((resolve, reject) => {
            if (element.requestFullscreen) {
                element.requestFullscreen().then(resolve).catch(reject);
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen().then(resolve).catch(reject);
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen().then(resolve).catch(reject);
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen().then(resolve).catch(reject);
            } else {
                reject(new Error('Fullscreen not supported'));
            }
        });
    }

    showErrorMessage(message) {
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #dc3545;
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
            font-family: 'Manrope', sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        errorDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">⚠️ Error</h3>
            <p style="margin: 0;">${message}</p>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    optimizePerformance() {
        // Preload critical images
        const criticalImages = ['image.png', 'Logo Full White.png'];
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        // Add intersection observer for lazy loading if supported
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    sanitizeHTML(html) {
        // If this is HTML content from our config (trusted source), allow it with minimal sanitization
        if (html.includes('<div style="font-family:') || html.includes('<h2 style="color:')) {
            // This is trusted content from config.js - only remove potentially dangerous scripts
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            // Remove any script tags for safety
            const scripts = temp.querySelectorAll('script');
            scripts.forEach(script => script.remove());
            
            // Remove any event handlers
            const elementsWithEvents = temp.querySelectorAll('*');
            elementsWithEvents.forEach(el => {
                const attrs = el.attributes;
                for (let i = attrs.length - 1; i >= 0; i--) {
                    const attr = attrs[i];
                    if (attr.name.startsWith('on')) {
                        el.removeAttribute(attr.name);
                    }
                }
            });
            
            return temp.innerHTML;
        }
        
        // For other content, use strict sanitization
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Define allowed tags and attributes - expanded to include all HTML used in responses
        const allowedTags = [
            'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 
            'strong', 'b', 'em', 'i', 'br', 'span', 'table', 'thead', 'tbody', 
            'tr', 'td', 'th', 'blockquote', 'code', 'pre', 'a', 'hr'
        ];
        const allowedAttributes = ['style', 'class', 'id', 'href', 'target'];
        
        // Recursively sanitize the DOM tree
        const sanitizeNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.cloneNode(true);
            }
            
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                
                // Only allow specific tags
                if (!allowedTags.includes(tagName)) {
                    return document.createTextNode(node.textContent);
                }
                
                // Create new element with same tag
                const newElement = document.createElement(tagName);
                
                // Copy allowed attributes
                for (let attr of node.attributes) {
                    if (allowedAttributes.includes(attr.name.toLowerCase())) {
                        newElement.setAttribute(attr.name, attr.value);
                    }
                }
                
                // Recursively sanitize children
                for (let child of node.childNodes) {
                    const sanitizedChild = sanitizeNode(child);
                    if (sanitizedChild) {
                        newElement.appendChild(sanitizedChild);
                    }
                }
                
                return newElement;
            }
            
            return null;
        };
        
        // Sanitize all child nodes
        const sanitizedNodes = [];
        for (let child of temp.childNodes) {
            const sanitized = sanitizeNode(child);
            if (sanitized) {
                sanitizedNodes.push(sanitized);
            }
        }
        
        // Return sanitized HTML
        return sanitizedNodes.map(node => node.outerHTML || node.textContent).join('');
    }
}

// Global functions
function toggleFullscreen() {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        // Enter fullscreen
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(error => {
                console.log('Fullscreen request failed:', error);
                showFullscreenError();
            });
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen().catch(error => {
                console.log('Webkit fullscreen request failed:', error);
                showFullscreenError();
            });
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen().catch(error => {
                console.log('Mozilla fullscreen request failed:', error);
                showFullscreenError();
            });
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen().catch(error => {
                console.log('MS fullscreen request failed:', error);
                showFullscreenError();
            });
        } else {
            showFullscreenError();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(error => {
                console.log('Exit fullscreen failed:', error);
            });
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen().catch(error => {
                console.log('Webkit exit fullscreen failed:', error);
            });
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen().catch(error => {
                console.log('Mozilla exit fullscreen failed:', error);
            });
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen().catch(error => {
                console.log('MS exit fullscreen failed:', error);
            });
        }
    }
}

function showFullscreenError() {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #dc3545;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 10000;
        font-family: 'Manrope', sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        font-size: 14px;
    `;
    errorDiv.innerHTML = `
        <div style="margin-bottom: 8px;">⚠️</div>
        <div>Fullscreen not supported in this browser</div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove error message after 3 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}

// Initialize
let chatMe;
document.addEventListener('DOMContentLoaded', () => {
    chatMe = new ChatMePitchDeck();
});