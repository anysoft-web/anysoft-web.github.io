/**
 * AnySoft Live Chat Widget
 * Handles chat functionality with strict message control
 */

// Global state to track if the user has sent a message
let userHasSentMessage = false;
let welcomeMessageSent = false;

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
        openChatButton.a
