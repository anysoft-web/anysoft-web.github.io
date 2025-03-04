/**
 * AnySoft Website JavaScript
 * Handles all interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScrolling();
    initHeaderScroll();
    initFormHandling();
    initChatWidget();
    initPricingCards();
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuDropdown = document.getElementById('mobile-menu-dropdown');
    
    if (mobileMenuButton && mobileMenuDropdown) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenuDropdown.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && 
                !mobileMenuDropdown.contains(event.target)) {
                mobileMenuDropdown.classList.add('hidden');
            }
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuDropdown.classList.add('hidden');
            });
        });
    }
}

/**
 * Smooth scrolling for navigation
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Header scroll behavior
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('py-3', 'shadow-xl');
            header.classList.remove('py-6');
        } else {
            header.classList.add('py-6');
            header.classList.remove('py-3', 'shadow-xl');
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Form handling for email signup
 */
function initFormHandling() {
    const signupForm = document.getElementById('signup-form');
    const formMessage = document.getElementById('form-message');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            // In a real implementation, you would send this to your backend
            console.log('Email submitted:', email);
            
            // Store email in localStorage for demo purposes
            try {
                let emails = JSON.parse(localStorage.getItem('anysoftEmails')) || [];
                emails.push({
                    email: email,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('anysoftEmails', JSON.stringify(emails));
            } catch (error) {
                console.error('Error storing email:', error);
            }
            
            // Display success message
            if (formMessage) {
                formMessage.textContent = 'Thanks for signing up! We\'ll notify you when early access is available.';
                formMessage.className = 'mt-4 text-green-500 text-sm';
            }
            
            // Reset the form
            signupForm.reset();
        });
    }
    
    // Footer signup form
    const footerSignup = document.getElementById('footer-signup');
    if (footerSignup) {
        footerSignup.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = footerSignup.querySelector('input[type="email"]').value;
            
            // Store email in localStorage
            try {
                let emails = JSON.parse(localStorage.getItem('anysoftEmails')) || [];
                emails.push({
                    email: email,
                    timestamp: new Date().toISOString(),
                    source: 'footer'
                });
                localStorage.setItem('anysoftEmails', JSON.stringify(emails));
            } catch (error) {
                console.error('Error storing email:', error);
            }
            
            alert('Thanks for subscribing to our updates!');
            footerSignup.reset();
        });
    }
}

/**
 * Chat widget functionality
 */
function initChatWidget() {
    const openChatButton = document.getElementById('open-chat');
    const chatWidget = document.getElementById('chat-widget');
    const closeChatButton = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (openChatButton && chatWidget && closeChatButton) {
        openChatButton.addEventListener('click', function() {
            chatWidget.classList.remove('hidden');
            if (chatInput) chatInput.focus();
        });
        
        closeChatButton.addEventListener('click', function() {
            chatWidget.classList.add('hidden');
        });
        
        if (chatForm && chatInput && chatMessages) {
            chatForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const message = chatInput.value.trim();
                if (!message) return;
                
                // Add user message to chat
                addMessage('user', message);
                
                // Clear input
                chatInput.value = '';
                
                // Simulate AI response
                simulateTyping();
                
                // Scroll to bottom
                scrollChatToBottom();
            });
        }
    }
    
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender} mb-4`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = sender === 'user' 
            ? 'bg-green-500 text-black rounded-lg p-3 max-w-xs ml-auto' 
            : 'bg-gray-800 rounded-lg p-3 max-w-xs';
        
        const messagePara = document.createElement('p');
        messagePara.textContent = text;
        
        bubbleDiv.appendChild(messagePara);
        messageDiv.appendChild(bubbleDiv);
        chatMessages.appendChild(messageDiv);
        
        scrollChatToBottom();
    }
    
    function simulateTyping() {
        // Add typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant mb-4 typing-indicator';
        typingDiv.innerHTML = '<div class="bg-gray-800 rounded-lg p-3 max-w-xs"><p>...</p></div>';
        chatMessages.appendChild(typingDiv);
        
        scrollChatToBottom();
        
        // Simulate response after a delay
        setTimeout(() => {
            // Remove typing indicator
            chatMessages.removeChild(typingDiv);
            
            // Add response
            const responses = [
                "AnySoft lets you create software without coding experience. You can get started for free!",
                "Our Professional plan at $50/month includes custom branding and 2 hours of AI usage per day.",
                "Yes, you can deploy your applications to any platform with our paid plans.",
                "The free starter plan includes 30 minutes of AI usage per day and 50 GB of bandwidth.",
                "You can add extra AI usage time with our Add-On Credits for $20/month per block.",
                "Sign up with your email and we'll notify you as soon as early access is available!",
                "AnySoft is designed for entrepreneurs, product managers, IT professionals, and more."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage('assistant', randomResponse);
        }, 1500);
    }
    
    function scrollChatToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
}

/**
 * Pricing cards hover effects
 */
function initPricingCards() {
    const pricingCards = document.querySelectorAll('#pricing .rounded-xl');
    
    pricingCards.forEach(card => {
        card.classList.add('pricing-card');
    });
}
