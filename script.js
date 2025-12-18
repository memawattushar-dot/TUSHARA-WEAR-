// TUSHARA AI - Smart Business Logic
// Owner: SUJAL MEMAWAT

const chatBox = document.getElementById('chat');
const userInput = document.getElementById('userInput');

// 1. AI ki bolne ki taqat (Voice Response)
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Shuddh Desi Hindi/Hinglish
    window.speechSynthesis.speak(utterance);
}

// 2. Chat ka Asli Dimaag
function askAI() {
    let message = userInput.value.trim();
    
    if (message === "") return;

    // User ka message screen par dikhao
    chatBox.innerHTML += `<div style="text-align: right; margin: 10px; color: #D4AF37;"><b>Aap:</b> ${message}</div>`;

    // AI ka response logic
    let response = "";

    if (message.includes("hisab") || message.includes("sale")) {
        response = "Sujal bhai, aaj ki sales total 15,000 rupaye rahi. Kya main isse diary mein note kar loon?";
    } else if (message.includes("hello") || message.includes("kaise ho")) {
        response = "Main ekdum badiya hoon bhai! Tushara AI taiyar hai. Bataiye aaj dhande mein kya kamaal karna hai?";
    } else if (message.includes("kharcha")) {
        response = "Theek hai bhai, kharcha note kar liya hai. Savdhani se chaliye, munafa badhana hai!";
    } else {
        response = "Jee bhai, main samajh gaya. Tushara AI ispe kaam kar raha hai.";
    }

    // AI ka jawab screen par dikhao
    setTimeout(() => {
        chatBox.innerHTML += `<div style="text-align: left; margin: 10px; color: #fff; background: #1A1A1A; padding: 10px; border-radius: 10px;"><b>TUSHARA AI:</b> ${response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to bottom
        speak(response); // AI bol kar batayega
    }, 500);

    userInput.value = ""; // Input saaf karo
}

// 3. Enter button se message bhejne ke liye
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        askAI();
    }
});
