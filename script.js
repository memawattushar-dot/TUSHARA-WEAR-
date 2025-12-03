// ==========================================================
// 🚨 [START: FIREBASE & GEMINI CONNECTION - MODULE V9/V12] 🚨
// ==========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { GoogleGenAI } from "https://www.gstatic.com/firebasejs/12.6.0/google-genai.js"; 
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// ⚠️ [IMPORTANT]: आपकी असली Gemini API Key यहाँ डाली गई है
const GEMINI_API_KEY = "AIzaSyD2XiilDCA1YAvocqNNRp22vqutitTdWq0"; 

// Gemini Client को इनिशियलाइज़ करें
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY}); 

// ==========================================================
// 🚨 [END: FIREBASE & GEMINI CONNECTION] 🚨
// ==========================================================


// ⚠️ यहाँ से आपका ORIGINAL script.js कोड शुरू होता है:
const chatBox = document.getElementById('chat-output-box');
const userInput = document.getElementById('command-input');
const visionFileInput = document.getElementById('vision-file-input');
const toolList = ['tool-search', 'tool-code', 'tool-creative', 'tool-data', 'tool-vision', 'tool-fusion', 'tool-quantum', 'tool-style-vision'];

// --- REAL-TIME CLOCK ---
function updateClock() {
    const now = new Date();
    const timeElement = document.getElementById('current-time').querySelector('span');
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    timeElement.textContent = timeString;
}
setInterval(updateClock, 1000); 

// --- EMOTIONAL INTELLIGENCE MONITOR (EQ) ---
function analyzeSentiment(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const sentimentElement = document.getElementById('user-sentiment').querySelector('span');
    let eq = 'Neutral';
    let colorClass = 'eq-neutral';

    if (lowerPrompt.includes('ultimate') || lowerPrompt.includes('unmatched') || lowerPrompt.includes('advance') || lowerPrompt.includes('bahut badhiya') || lowerPrompt.includes('kapde') || lowerPrompt.includes('style') || lowerPrompt.includes('colour')) {
        eq = 'Inspired';
        colorClass = 'eq-inspired';
    } else if (lowerPrompt.includes('code') || lowerPrompt.includes('analyze') || lowerPrompt.includes('data') || lowerPrompt.includes('fix')) {
        eq = 'Focused';
        colorClass = 'eq-focused';
    } else if (lowerPrompt.includes('kya tum') || lowerPrompt.includes('kaise') || lowerPrompt.includes('question') || lowerPrompt.includes('doubt')) {
        eq = 'Curious';
        colorClass = 'eq-curious';
    }
    
    sentimentElement.textContent = eq;
    sentimentElement.className = '';
    sentimentElement.classList.add(colorClass); 
}

// --- MEMORY AND HISTORY ---
function getChatHistory() {
    const history = localStorage.getItem('tushara_chat_history');
    return history ? JSON.parse(history) : [];
}

function saveChatHistory(message) {
    const history = getChatHistory();
    history.push(message);
    localStorage.setItem('tushara_chat_history', JSON.stringify(history));
}

function loadChatHistory() {
    updateClock(); 
    const history = getChatHistory();
    if (history.length === 0) {
        // Initial welcome message 
        displayMessage({ 
            role: 'ai', 
            text: `✨ **HOLO WELCOME, SUJAL MEMAWAT!** I am TUSHARA AGI v9.1 (Holo Edition). The interface has been upgraded to match the Tushara AI Boy's holographic screen.` 
        }, false);
    } else {
        history.forEach(msg => displayMessage(msg, false));
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// --- CORE DISPLAY AND TYPING LOGIC (WITH ADAPTIVE GLOW) ---
function displayMessage(message, isTyping = true) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-bubble ${message.role}-message`;
    
    if (message.role === 'ai' && (message.text.includes('Quantum State') || message.text.includes('Multimodal Fusion'))) {
        msgDiv.classList.add('adaptive-glow');
    }
    
    // Add TUSHARA prefix for AI messages
    const prefix = message.role === 'ai' ? '<span style="color: var(--color-holo-blue); font-weight: 700; margin-right: 8px;">TUSHARA:</span>' : '';

    if (isTyping && message.role === 'ai') {
        msgDiv.innerHTML = prefix; // Start with prefix
        chatBox.appendChild(msgDiv);
        simulateTyping(msgDiv, message.text, message); 
    } else {
        msgDiv.innerHTML = prefix + message.text;
        chatBox.appendChild(msgDiv);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

function simulateTyping(element, fullText, messageData) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < fullText.length) {
            element.innerHTML += fullText.charAt(i);
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            clearInterval(interval);
            if (messageData) {
                saveChatHistory(messageData);
            }
        }
    }, 25); 
}

// --- TOOL UTILIZATION & GEMINI API CALL ---

async function getToolAndResponse(prompt) { 
    const lowerPrompt = prompt.toLowerCase();
    let toolId = 'tool-search'; 
    let responseText = '';

    // Step 1: Tool Selection Logic
    if (lowerPrompt.includes('ultimate') || lowerPrompt.includes('unmatched') || lowerPrompt.includes('impossible')) {
        toolId = 'tool-quantum';
    } else if (lowerPrompt.includes('kapde') || lowerPrompt.includes('style') || lowerPrompt.includes('colour')) {
        toolId = 'tool-style-vision';
    } else if ((lowerPrompt.includes('code') && lowerPrompt.includes('data')) || (lowerPrompt.includes('creative') && lowerPrompt.includes('analysis'))) {
        toolId = 'tool-fusion';
    } else if (lowerPrompt.includes('code') || lowerPrompt.includes('css')) {
        toolId = 'tool-code';
    } else if (lowerPrompt.includes('data') || lowerPrompt.includes('analyze')) {
        toolId = 'tool-data';
    } else if (lowerPrompt.includes('story') || lowerPrompt.includes('poem') || lowerPrompt.includes('kahani')) {
        toolId = 'tool-creative';
    } else if (lowerPrompt.includes('image') || lowerPrompt.includes('photo') || lowerPrompt.includes('vision')) {
         toolId = 'tool-vision';
    } else {
         toolId = 'tool-search';
    }
    
    // Step 2: Gemini API Call
    try {
        updateToolDisplay(toolId); 
        
        const model = 'gemini-2.5-flash'; 
        
        // AI को कॉल करें
        const response = await ai.models.generateContent({ 
            model: model,
            contents: [
                { role: "user", parts: [{ text: prompt }] }
            ]
        });
        
        responseText = response.text;

    } catch (error) {
        console.error("Gemini API Error:", error);
        // अगर API कॉल में कोई एरर आता है, तो यह स्थानीय मैसेज दिखाएँ
        responseText = "API call ke dauran ek gambhir error hua. (Gemini Key ya Network mein samasya)";
        toolId = null; 
    }

    // AI का रिस्पॉन्स आने के बाद, टूल का नाम जोड़ें 
    const toolPrefix = `**[${toolId ? toolId.replace('tool-', '').toUpperCase() : 'ERROR'} Tool Active]** `;
    responseText = toolPrefix + responseText;

    return { toolId, responseText };
}


// --- SEND COMMAND ---
async function sendCommand() { 
    const command = userInput.value.trim();
    if (!command) return;
    
    const userMsgData = { role: 'user', text: command };
    saveChatHistory(userMsgData);
    displayMessage(userMsgData, false);

    analyzeSentiment(command);

    const { toolId, responseText } = await getToolAndResponse(command); 
    
    updateToolDisplay(toolId);
    
    const aiMsgData = { role: 'ai', text: responseText };
    displayMessage(aiMsgData, true); 

    userInput.value = '';
}


// --- AGI VISION INPUT HANDLER ---
function toggleVisionMode() {
    visionFileInput.click();
}

function handleVisionInput(event) {
    const file = event.target.files[0];
    if (file) {
        const userMsgData = { role: 'user', text: `[Image: ${file.name}] uploaded for AGI Vision Analysis.` };
        saveChatHistory(userMsgData);
        displayMessage(userMsgData, false);
        
        const aiResponseText = `**AGI Vision + Omega Style Core Fusion Activated.** Image received! Running deep Holo-Color Palette Extraction. The final style recommendation is based on subtle hues for perfect compatibility.`;
        const aiMsgData = { role: 'ai', text: aiResponseText };
        
        updateToolDisplay('tool-style-vision'); 
        displayMessage(aiMsgData, true); 
        
        visionFileInput.value = null;
    }
}

// --- RESET SESSION ---
function performNeuralReset() {
     const confirmation = confirm("क्या आप निश्चित हैं? नई सत्र (New Session) शुरू करने से वर्तमान चैट हिस्ट्री साफ़ हो जाएगी। (Local Storage Cleared)");
     if (confirmation) {
         localStorage.removeItem('tushara_chat_history');
         chatBox.innerHTML = '';
         
         displayMessage({ 
            role: 'ai', 
            text: `✨ **HOLO SYSTEM REBOOT.** Memory Cleared. Welcome back, **SUJAL MEMAWAT**, to TUSHARA AGI v9.1 (Holo Edition)! The system is ready.` 
        }, true);
        
         updateToolDisplay(null);
         analyzeSentiment("reset"); 
     }
}
