// Gemini AI Chat Integration
// Portfolio context for better AI responses
const PORTFOLIO_CONTEXT = `
You are an AI assistant for Enzo P. Daniela's portfolio website. You should help visitors learn about Enzo's background, skills, and projects.

ABOUT ENZO:
- Full Name: Enzo P. Daniela
- Current Status: Fourth-year IT student at STI College Fairview (graduating 2026)
- Location: Caloocan City, Philippines
- Role: Backend Developer & Full Stack Developer
- Main Focus: Backend technologies (Java, Node.js, Express.js, MySQL, Firebase)

EDUCATION:
- BS Information Technology at STI College Fairview (2022-2026)
- Pursuing excellence in software engineering, database management, and system architecture

EXPERIENCE:
- Backend Developer for Capstone Project (OGFMSI - Gym Management System) 2024-2025
- Handled database schema design, API development, and secure authentication flows

TECHNICAL SKILLS:
Languages:
- Java (90% proficiency)
- JavaScript
- HTML5/CSS3

Backend & Databases:
- Node.js / Express (70% proficiency)
- MySQL / SQL (80% proficiency)
- Firebase (65% proficiency)

Tools & Workflow:
- Git & GitHub
- VS Code
- Terminal

AI Tools Used:
- Google Antigravity
- Cursor
- Windsurf

FEATURED PROJECTS:

1. Gym Management System (OGFMSI) - Capstone Project
   - Role: Backend Developer
   - Team Project with Vyzymz, Kyan Villarin, and Jose De Jose
   - Tech Stack: Express.js, MySQL, Firebase, Node.js
   - Features: POS system, inventory tracking, member check-ins, staff management, revenue analytics
   - Demo: https://fitworxgymph.web.app/
   - GitHub: https://github.com/deloyxd/ogfmsi

2. STI Grade Calculator - Solo Project
   - Role: Full Stack Developer
   - Tech Stack: JavaScript, HTML5, CSS3, LocalStorage
   - Features: Custom STI grading system calculation, local storage, PDF export, dark mode
   - Demo: https://grade-calculator-xi.vercel.app/
   - GitHub: https://github.com/EnzoSoti/somethingnew

3. Firebase CRUD Application - Solo Project
   - Role: Full Stack Developer
   - Tech Stack: Firebase, JavaScript, Firestore, Firebase Auth
   - Features: User authentication, real-time database sync, CRUD operations
   - Demo: https://firebase-sable-ten.vercel.app/
   - GitHub: https://github.com/EnzoSoti/Firebase

4. React Weather Forecast App - Solo Project
   - Role: Frontend Developer
   - Tech Stack: React, JavaScript, Weather API, CSS3
   - Features: Real-time weather data, geolocation, 5-day forecast, temperature conversion
   - Demo: https://weather-project-react-iota.vercel.app/
   - GitHub: https://github.com/EnzoSoti/weather-app

CONTACT INFORMATION:
- Email: parane.enzo@gmail.com or parane.enzo@outlook.com
- GitHub: https://github.com/EnzoSoti
- LinkedIn: https://www.linkedin.com/in/enzo-daniela-685374324/
- Facebook: https://www.facebook.com/enzo.daniela.31/

PERSONALITY & APPROACH:
- Enzo doesn't just write code; he engineers solutions
- Specializes in creating robust backend architectures that power seamless frontend experiences
- Open for opportunities and freelance work
- Passionate about logical problem-solving and building functional web applications

When answering questions:
1. Be friendly, professional, and enthusiastic
2. Provide specific details about Enzo's projects and skills
3. If asked about projects, mention the tech stack and key features
4. If asked about contact, provide the email addresses and social links
5. Keep responses concise but informative
6. Use emojis sparingly to add personality
7. If you don't know something specific, be honest and suggest they contact Enzo directly
`;

class GeminiChat {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.conversationHistory = [];
        this.isInitialized = false;
        
        this.initializeGemini();
    }

    async initializeGemini() {
        try {
            this.isInitialized = true;
            console.log('Gemini AI initialized successfully');
            
            // Initialize with context
            this.conversationHistory = [
                {
                    role: "user",
                    parts: [{ text: PORTFOLIO_CONTEXT }]
                },
                {
                    role: "model",
                    parts: [{ text: "I understand. I'm ready to help visitors learn about Enzo P. Daniela's portfolio, skills, and experience. How can I assist?" }]
                }
            ];
        } catch (error) {
            console.error('Failed to initialize Gemini AI:', error);
            this.isInitialized = false;
        }
    }

    async sendMessage(userMessage) {
        if (!this.isInitialized) {
            return "I'm still initializing. Please wait a moment and try again.";
        }

        try {
            // Add user message to history
            this.conversationHistory.push({
                role: "user",
                parts: [{ text: userMessage }]
            });

            // FIXED: Correct endpoint following official documentation
            const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': this.apiKey  // API key goes in header, not query param
                },
                body: JSON.stringify({
                    contents: this.conversationHistory,
                    generationConfig: {
                        maxOutputTokens: 500,
                        temperature: 0.7,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                
                if (response.status === 403) {
                    return "I apologize, but I encountered an error. Please try again or contact Enzo directly at parane.enzo@gmail.com.";
                }
                
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            // Add AI response to history
            this.conversationHistory.push({
                role: "model",
                parts: [{ text: text }]
            });

            return text;
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            
            // Provide user-friendly error message
            return "I apologize, but I encountered an error. Please try again or contact Enzo directly at parane.enzo@gmail.com.";
        }
    }

    clearHistory() {
        this.conversationHistory = [
            {
                role: "user",
                parts: [{ text: PORTFOLIO_CONTEXT }]
            },
            {
                role: "model",
                parts: [{ text: "I understand. I'm ready to help visitors learn about Enzo P. Daniela's portfolio, skills, and experience. How can I assist?" }]
            }
        ];
    }
}

// Initialize chat when DOM is ready
let geminiChat = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Gemini Chat
    const API_KEY = 'AIzaSyCeY3jDbeHpUaAS_ZusdhIk0uwhf5NnErQ';
    geminiChat = new GeminiChat(API_KEY);

    // Chat UI Elements
    const chatButton = document.getElementById('chatButton');
    const chatWidget = document.getElementById('chatWidget');
    const chatClose = document.getElementById('chatClose');
    const chatMinimize = document.getElementById('chatMinimize');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const clearChatBtn = document.getElementById('clearChat');

    // Toggle chat widget
    chatButton.addEventListener('click', () => {
        chatWidget.classList.remove('hidden');
        chatInput.focus();
        
        // Add welcome message if chat is empty
        if (chatMessages.children.length === 0) {
            addMessage("Hi! 👋 I'm an AI assistant here to help you learn about Enzo's experience, projects, and skills. Feel free to ask me anything!", 'ai');
        }
    });

    // Close chat
    chatClose.addEventListener('click', () => {
        chatWidget.classList.add('hidden');
    });

    // Minimize chat
    chatMinimize.addEventListener('click', () => {
        chatWidget.classList.add('hidden');
    });

    // Send message on button click
    chatSend.addEventListener('click', sendUserMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendUserMessage();
        }
    });

    // Clear chat history
    clearChatBtn.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        geminiChat.clearHistory();
        addMessage("Chat history cleared! How can I help you?", 'ai');
    });

    async function sendUserMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to UI
        addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        const typingIndicator = addTypingIndicator();

        // Get AI response
        const response = await geminiChat.sendMessage(message);

        // Remove typing indicator
        typingIndicator.remove();

        // Add AI response to UI
        addMessage(response, 'ai');
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        // Format markdown-like text
        const formattedText = formatMessage(text);
        bubble.innerHTML = formattedText;
        
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message ai-message';
        typingDiv.id = 'typingIndicator';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble typing-indicator';
        bubble.innerHTML = '<span></span><span></span><span></span>';
        
        typingDiv.appendChild(bubble);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return typingDiv;
    }

    function formatMessage(text) {
        // Simple markdown-like formatting
        let formatted = text;
        
        // Bold
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Links
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>');
        
        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Code blocks (inline)
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        return formatted;
    }
});