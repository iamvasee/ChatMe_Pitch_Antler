// ChatMe Interactive Pitch Deck
// Simulating a chat with Dr. APJ Abdul Kalam

class ChatMePitchDeck {
    constructor() {
        this.isTyping = false;
        this.quickReplies = PITCH_DECK_CONFIG.quickReplies;
        this.responses = PITCH_DECK_CONFIG.responses;
        this.usedQuestions = new Set(); // Track used questions
        this.fullscreenPrompted = false;
        
        // Audio elements
        this.botMessageSound = new Audio('Message received.mp3');
        this.userMessageSound = new Audio('message_sent.mp3');
        this.responseSound = new Audio('Message_received.mp3');
        
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.quickRepliesContainer = document.getElementById('quickReplies');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.chatContainer = document.querySelector('.chat-container');
        
        this.setupEventListeners();
        this.initializePresentation();
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
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isTyping) {
                this.handleSendMessage();
            }
        });

        // Attempt automatic fullscreen immediately when page loads
        this.attemptAutomaticFullscreen();
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
                // No fallback button - user can use the header button if needed
            });
        }, 1500); // 1.5 second delay after page load
    }

    startPresentation() {
        // Show the first message immediately after loading screen disappears
        const welcomeMessage = `🙏 **Namaste! My dear friends**

I am Dr. APJ Abdul Kalam, former President of India, aerospace scientist, and now, I am also one of the AI characters on ChatMe.At - India's revolutionary AI Companion Platform.

*"Dream, dream, dream. Dreams transform into thoughts and thoughts result in action."*

This is exactly what ChatMe is doing - transforming dreams into reality for 1.4 billion Indian hearts.

*"The future of emotional AI, built for 1.4B desi souls."*

Our mission is clear: *"Not just chat. Real connection."*

As someone who always believed that technology should serve humanity, I am excited to present this revolutionary platform that understands the heart and soul of India. ChatMe is not just building a product - we are creating a cultural phenomenon that will touch every Indian household.

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
            this.responseSound.play().catch(e => console.log('Response sound failed:', e));
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot';
            
            // Convert markdown-like formatting to HTML
            const formattedMessage = this.formatMessage(message);
            
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="image.png" alt="APJ Abdul Kalam">
                </div>
                <div class="message-content">
                    <div class="message-html">${formattedMessage}</div>
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
        this.userMessageSound.play().catch(e => console.log('Audio play failed:', e));
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-avatar">
                <img src="image copy.png" alt="User">
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
• Email: investors@chatme.at
• Website: www.chatme.at

Let's build India's first AI entertainment empire together! 🙏

**Feel free to ask any custom questions you might have, or type your own message!**`;

            this.addBotMessage(completionMessage, () => {
                // Enable free-form chat
                this.messageInput.placeholder = "Ask Dr. Kalam anything about ChatMe...";
                this.messageInput.disabled = false;
            });
            return;
        }
        
        // Create accordion structure
        const accordionHeader = document.createElement('div');
        accordionHeader.className = 'quick-replies-header';
        accordionHeader.innerHTML = `
            <h4>💬 Ask Dr. Kalam a Question</h4>
            <div class="quick-replies-toggle">
                <span>${availableQuestions.length} questions available</span>
                <i class="fas fa-chevron-down"></i>
            </div>
        `;
        
        const accordionPanel = document.createElement('div');
        accordionPanel.className = 'quick-replies-panel';
        
        const questionsGrid = document.createElement('div');
        questionsGrid.className = 'quick-replies-grid';
        
        // Add available questions
        availableQuestions.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = reply;
            button.addEventListener('click', () => this.handleQuickReply(reply));
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
            } else {
                panel.classList.add('open');
                toggle.classList.add('rotated');
            }
        });
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

    handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (message && !this.isTyping) {
            // Check if the message matches any of our predefined questions
            const lowerMessage = message.toLowerCase();
            let matchedQuestion = null;
            
            // Check for exact or partial matches with predefined questions
            for (const question of this.quickReplies) {
                const lowerQuestion = question.toLowerCase();
                if (lowerMessage === lowerQuestion || 
                    lowerMessage.includes(lowerQuestion.slice(0, 10)) || 
                    this.hasCommonKeywords(lowerMessage, lowerQuestion)) {
                    matchedQuestion = question;
                    break;
                }
            }
            
            if (matchedQuestion && !this.usedQuestions.has(matchedQuestion)) {
                // If it matches a predefined question, handle it as a quick reply
                this.handleQuickReply(matchedQuestion);
            } else {
                // If no match or question already used, show a helpful message
                this.addUserMessage(message);
                setTimeout(() => {
                    this.addBotMessage(`Thank you for your question: "${message}"

I have detailed information prepared for specific aspects of our business. Please select from the available questions above, or ask about contacting our team.

**For custom inquiries, please contact us at:**
• Email: investors@chatme.at
• Website: www.chatme.at`, () => {
                        this.showQuickReplies();
                    });
                }, 1000);
            }
            
            this.messageInput.value = '';
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
}

// Global functions
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Initialize
let chatMe;
document.addEventListener('DOMContentLoaded', () => {
    chatMe = new ChatMePitchDeck();
});