/**
 * AnySoft Chat Widget
 * Updated conversation flow to collect question first, then email
 */

// Global state
let initialMessageSent = false;
let userQuestion = '';
let waitingForEmail = false;

document.addEventListener('DOMContentLoaded', function() {
    initChatWidget();
});

/**
 * Initialize the chat widget
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
            
            // Send initial help offer message only once
            if (!initialMessageSent && chatMessages.children.length === 0) {
                setTimeout(() => {
                    addMessage('assistant', "Hi there! How can I help you with AnySoft today?");
                    initialMessageSent = true;
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
                
                // Process the message based on conversation state
                if (waitingForEmail) {
                    if (isEmailLike(message)) {
                        // User provided an email, submit to Formspree
                        submitToFormspree(message, userQuestion);
                    } else {
                        // Not an email, ask again
                        setTimeout(() => {
                            addMessage('assistant', "I need your email address to have someone follow up with you. Please provide a valid email address.");
                        }, 500);
                    }
                } else {
                    // This is the user's first message (question)
                    userQuestion = message;
                    waitingForEmail = true;
                    
                    setTimeout(() => {
                        addMessage('assistant', "Thank you, I will pass this along to the team. Please provide your email address for follow up.");
                    }, 500);
                }
                
                // Scroll to bottom
                scrollChatToBottom();
            });
        }
    }
}

/**
 * Check if a string looks like an email address
 */
function isEmailLike(text) {
    return text.includes('@') && text.includes('.');
}

/**
 * Submit data to Formspree
 */
function submitToFormspree(email, question) {
    // Send to Formspree
    fetch('https://formspree.io/f/xpwqvggj', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            message: question,
            source: 'chat-widget',
            page: window.location.href,
            timestamp: new Date().toISOString()
        })
    })
    .then(response => {
        if (response.ok) {
            // Thank the user and reset the conversation state
            addMessage('assistant', "Thank you! We've received your question and email. Someone from our team will get back to you shortly.");
            userQuestion = '';
            waitingForEmail = false;
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        
        // Show error message if submission fails
        addMessage('assistant', "Thanks for your information! We've had a small technical issue, but we'll make sure to follow up with you soon.");
        
        // Fall back to localStorage as backup
        try {
            let inquiries = JSON.parse(localStorage.getItem('anysoftInquiries')) || [];
            inquiries.push({
                email: email,
                question: question,
                timestamp: new Date().toISOString(),
                source: 'chat-widget-fallback'
            });
            localStorage.setItem('anysoftInquiries', JSON.stringify(inquiries));
        } catch (e) {
            console.error('Fallback storage failed:', e);
        }
        
        // Reset conversation state
        userQuestion = '';
        waitingForEmail = false;
    });
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
    
    bubbleDiv.textContent = text;
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    scrollChatToBottom();
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

// Clear any existing state when the page loads
window.addEventListener('load', function() {
    initialMessageSent = false;
    userQuestion = '';
    waitingForEmail = false;
});

// Initialize if the document is already loaded
if (document.readyState === 'complete') {
    initChatWidget();
}
