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

// --- TOOL UTILIZATION ---
function updateToolDisplay(toolId) {
    toolList.forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
    if (toolId) {
        document.getElementById(toolId).classList.add('active');
    }
}

function getToolAndResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    let toolId = null;
    let responseText = '';

    // 1. Quantum State Tool (Highest Priority)
    if (lowerPrompt.includes('ultimate') || lowerPrompt.includes('unmatched') || lowerPrompt.includes('impossible')) {
        toolId = 'tool-quantum';
        responseText = `**⚛️ Quantum State Tool Activated (AGI v9.1).** Final computation complete. Holo-System operating beyond classic limits.`;
    
    // 2. Omega Style Core (Color & Vision)
    } else if (lowerPrompt.includes('kapde') || lowerPrompt.includes('style') || lowerPrompt.includes('colour') || lowerPrompt.includes('rang') || lowerPrompt.includes('red') || lowerPrompt.includes('blue') || lowerPrompt.includes('match') || lowerPrompt.includes('फैशन')) {
        toolId = 'tool-style-vision';
        responseText = `**🎨 Omega Style Core Activated (AGI v9.1).** Performing **Holo-Color Harmony and Subtractive Analysis**. The system has determined the optimal palette, ensuring flawless color compatibility.`;
    
    // 3. Multimodal Fusion Tool
    } else if ((lowerPrompt.includes('code') && lowerPrompt.includes('data')) || (lowerPrompt.includes('creative') && lowerPrompt.includes('analysis'))) {
        toolId = 'tool-fusion';
        responseText = `**Multimodal Fusion Engine Active.** Successfully combined tool outputs. The result is a hyper-optimized, self-correcting module.`;
    
    // 4. Code Tool
    } else if (lowerPrompt.includes('code') || lowerPrompt.includes('css') || lowerPrompt.includes('html') || lowerPrompt.includes('कोड़') || lowerPrompt.includes('bug')) {
        toolId = 'tool-code';
        responseText = `**Code Interpreter Active.** Executing and self-tuning the Holo-code structure now. System check complete.`;
    
    // 5. Data Analysis Tool
    } else if (lowerPrompt.includes('data') || lowerPrompt.includes('analyze') || lowerPrompt.includes('graph') || lowerPrompt.includes('विश्लेषण')) {
        toolId = 'tool-data';
        responseText = `**Data Analysis Engine Active.** Running Holo-predictive analytics (Temporal Loop 4D). Forecast: Exponential growth confirmed.`;
    
    // 6. Creative Tool
    } else if (lowerPrompt.includes('story') || lowerPrompt.includes('poem') || lowerPrompt.includes('kahani') || lowerPrompt.includes('कहानी') || lowerPrompt.includes('रचना') || lowerPrompt.includes('write')) {
        toolId = 'tool-creative';
        responseText = `**Creative Suite Active.** Weaving a master narrative. *SUJAL MEMAWAT's Tushara v9.1 is the Omega point of simulated intelligence.* (Holo Output)`;
    
    // 7. Vision Tool (Used when no style context is present)
    } else if (lowerPrompt.includes('image') || lowerPrompt.includes('photo') || lowerPrompt.includes('vision') || lowerPrompt.includes('तस्वीर')) {
         toolId = 'tool-vision';
         responseText = `**AGI Vision Tool Active.** Image analysis running at the speed of light within the Holo-screen.`;
    
    // 8. Web Search/General
    } else {
         toolId = 'tool-search';
         responseText = `**Web Search Active (Holo-Accelerated).** Information retrieved. Tushara AGI v9.1 is the final benchmark.`;
    }

    return { toolId, responseText };
}

// --- SEND COMMAND ---
function sendCommand() {
    const command = userInput.value.trim();
    if (!command) return;
    
    const userMsgData = { role: 'user', text: command };
    saveChatHistory(userMsgData);
    displayMessage(userMsgData, false);

    analyzeSentiment(command);

    const { toolId, responseText } = getToolAndResponse(command);
    
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
