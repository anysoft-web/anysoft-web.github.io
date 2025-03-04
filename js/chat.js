/**
 * AnySoft Live Chat Widget
 * Handles chat functionality with an enhanced AI response system
 */

document.addEventListener('DOMContentLoaded', function() {
    initChatWidget();
});

/**
 * Initialize the chat widget with improved functionality
 */
function initChatWidget() {
    // Create chat widget HTML if it doesn't exist
    if (!document.getElementById('chat-widget')) {
        createChatWidgetHTML();
    }

    const openChatButton = document.getElementById('open-chat');
    const chatWidget = document.getElementById('chat-widget');
    const closeChatButton = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (openChatButton && chatWidget && closeChatButton) {
        // Open chat when button is clicked
        openChatButton.addEventListener('click', function() {
            chatWidget.classList.remove('hidden');
            if (chatInput) chatInput.focus();
            
            // Only show welcome message if chat is empty
            if (chatMessages.children.length === 0) {
                setTimeout(() => {
                    addMessage('assistant', "Hello! I'm your AnySoft assistant. How can I help you today?");
                }, 500);
            }
        });
        
        // Close chat when close button is clicked
        closeChatButton.addEventListener('click', function() {
            chatWidget.classList.add('hidden');
        });
        
        // Handle form submission for chat messages
        if (chatForm && chatInput && chatMessages) {
            chatForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const message = chatInput.value.trim();
                if (!message) return;
                
                // Add user message to chat
                addMessage('user', message);
                
                // Clear input
                chatInput.value = '';
                
                // Process user message and generate response
                processUserMessage(message);
                
                // Scroll to bottom
                scrollChatToBottom();
            });
        }
    }
}

/**
 * Create the chat widget HTML and add it to the page
 */
function createChatWidgetHTML() {
    const chatWidgetHTML = `
    <div id="chat-widget" class="fixed bottom-4 right-4 z-50 hidden">
        <div class="bg-gray-800 rounded-lg shadow-lg w-80 md:w-96 overflow-hidden">
            <div class="bg-green-500 px-4 py-3 flex justify-between items-center">
                <h3 class="font-bold text-black">AnySoft Assistant</h3>
                <button id="close-chat" class="text-black hover:text-gray-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div id="chat-messages" class="h-80 overflow-y-auto p-4 bg-gray-900">
                <!-- Chat messages will be added here dynamically -->
            </div>
            <div class="p-4 border-t border-gray-700">
                <form id="chat-form" class="flex gap-2">
                    <input type="text" id="chat-input" placeholder="Type your message..." class="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
                    <button type="submit" class="bg-green-500 text-black p-2 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    </div>
    `;
    
    // Append the chat widget to the body
    const chatWidgetContainer = document.createElement('div');
    chatWidgetContainer.innerHTML = chatWidgetHTML;
    document.body.appendChild(chatWidgetContainer.firstElementChild);
}

/**
 * Add a message to the chat
 */
function addMessage(sender, text) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender} mb-4`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = sender === 'user' 
        ? 'bg-green-500 text-black rounded-lg p-3 max-w-xs ml-auto' 
        : 'bg-gray-800 rounded-lg p-3 max-w-xs';
    
    // Format URLs as links
    const formattedText = formatTextWithLinks(text);
    
    bubbleDiv.innerHTML = formattedText;
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    scrollChatToBottom();
}

/**
 * Format text to convert URLs to clickable links
 */
function formatTextWithLinks(text) {
    // Simple URL regex pattern
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, '<a href="$1" target="_blank" class="underline text-blue-400">$1</a>');
}

/**
 * Show typing indicator while generating response
 */
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    // Check if typing indicator already exists
    if (document.getElementById('typing-indicator')) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message assistant mb-4 typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<div class="bg-gray-800 rounded-lg p-3 max-w-xs"><p>...</p></div>';
    chatMessages.appendChild(typingDiv);
    
    scrollChatToBottom();
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Process user message and generate appropriate response
 */
function processUserMessage(message) {
    // Show typing indicator
    showTypingIndicator();
    
    // Lowercase message for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Simulate thinking time (400-1200ms)
    const thinkingTime = 400 + Math.random() * 800;
    
    setTimeout(() => {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Generate response based on message content
        let response;
        
        // Check for pricing related questions
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing') || lowerMessage.includes('subscription')) {
            response = "We offer three pricing tiers: Starter ($0/month), Professional ($50/month), and Enterprise ($100/month). You can also add additional AI usage with our Add-On Credits for $20/month per block. Would you like more details about a specific plan?";
        }
        // Check for features related questions
        else if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities')) {
            response = "AnySoft enables you to build software without coding experience! Our AI builds, tests, and runs bug-free applications with just a few clicks. You can create everything from simple tools to complex enterprise applications. Would you like to know about a specific capability?";
        }
        // Check for AI related questions
        else if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
            response = "Our AI technology powers the entire AnySoft platform, allowing you to describe what you want to build in plain language. The AI then creates, tests, and deploys your application automatically. It can adapt to feedback and continuously improve your software.";
        }
        // Check for trial or sign up questions
        else if (lowerMessage.includes('trial') || lowerMessage.includes('sign up') || lowerMessage.includes('get started') || lowerMessage.includes('join')) {
            response = "You can sign up for early access by entering your email in the form above. We'll notify you as soon as the trial is available. The Starter plan is completely free, so you can start building without any cost!";
        }
        // Check for support questions
        else if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('contact')) {
            response = "For support inquiries, you can email us at support@anysoft.app. Our team is available Monday through Friday, 9am-5pm EST. Enterprise customers receive priority support with dedicated account managers.";
        }
        // Check for greetings
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = "Hello! Thanks for your interest in AnySoft. I'm here to answer any questions you might have about our platform. What would you like to know?";
        }
        // Check for thank you messages
        else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            response = "You're welcome! Feel free to ask if you have any other questions. We're excited to have you try AnySoft!";
        }
        // Check for how it works
        else if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('use'))) {
            response = "Using AnySoft is simple: describe what you want to build in plain language, review the AI-generated solution, make any adjustments you want, and then deploy your application. No coding required! Would you like to see a specific example?";
        }
        // Default response for other queries
        else {
            const defaultResponses = [
                "Thanks for your question! AnySoft makes software development accessible to everyone, regardless of technical background. Could you tell me more about what you're looking to build?",
                "That's a great question. With AnySoft, you can build custom software applications without writing code. The AI handles all the technical details for you. Would you like to know more about our features?",
                "I'd be happy to help with that. AnySoft is designed to make software development easy for anyone. You can sign up for our free Starter plan to begin exploring. Is there a specific use case you're interested in?",
                "AnySoft is revolutionizing how software is built, making it accessible to entrepreneurs, product managers, and business teams. Would you like to learn more about how it could work for your specific needs?"
            ];
            response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        // Add response to chat
        addMessage('assistant', response);
    }, thinkingTime);
}

/**
 * Scroll chat to bottom
 */
function scrollChatToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize if the document is already loaded
if (document.readyState === 'complete') {
    initChatWidget();
}
