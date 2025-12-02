*
 * TUSHARA-WEAR: Advanced AI Sales and Advertising Script
 * Purpose: Track user intent and show personalized offers to increase sales.
 */

// --- 1. User Activity Tracker (Samajhna ki customer kya chahta hai) ---
let userIntent = 'general';
let lastViewedProduct = '';

document.addEventListener('click', (event) => {
    // Agar user kisi product button par click karta hai
    if (event.target.classList.contains('product-card')) {
        lastViewedProduct = event.target.querySelector('h3').innerText;
        userIntent = lastViewedProduct.includes('Shirt') ? 'shirt_buyer' : 'denim_buyer';
        console.log('AI Intent:', userIntent, 'Product:', lastViewedProduct);
    }
});

// --- 2. AI Pop-up Ad Creator (Automatic Sale Banner Dikhana) ---
function createAIPopupAd() {
    let message = '';
    let offer = '';

    if (userIntent === 'shirt_buyer') {
        message = "Aapne Oxford Shirt dekhi? Aaj aapke liye 10% Extra Discount!";
        offer = "FLASH10";
    } else if (userIntent === 'denim_buyer') {
        message = "Jeans par Bumper Offer! Free Shipping Code: SHIPFREE";
        offer = "SHIPFREE";
    } else {
        message = "Welcome! Naye customers ke liye pehla order 5% off! Code: FIRST5";
        offer = "FIRST5";
    }

    // HTML for the Pop-up Ad (automatic advertise)
    const adHTML = `
        <div id="ai-popup-ad" style="
            position: fixed; bottom: 20px; right: 20px; z-index: 9999; 
            background: #ff6600; color: white; padding: 15px; border-radius: 8px; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.4); max-width: 300px; cursor: pointer;">
            
            <h3 style="margin-top: 0; font-size: 1.1em;">📢 AI Special Offer!</h3>
            <p style="margin-bottom: 5px;">${message}</p>
            <p style="font-weight: bold;">Code: ${offer}</p>
            <small>Click to Close</small>
        </div>
    `;

    // Pop-up ko body mein add karna
    document.body.insertAdjacentHTML('beforeend', adHTML);

    // Pop-up ko band karne ka function
    document.getElementById('ai-popup-ad').addEventListener('click', () => {
        document.getElementById('ai-popup-ad').remove();
    });
}

// --- 3. AI Function Ko Trigger Karna (Automatic dikhaega) ---

// 10 seconds baad ad dikhaega
setTimeout(createAIPopupAd, 10000);

// Jab user website se jaane lagega (exit intent) tab bhi dikhaega
document.addEventListener('mouseout', (event) => {
    // Agar mouse browser window se bahar ja raha hai
    if (event.clientY <= 0 && !document.getElementById('ai-popup-ad')) {
        createAIPopupAd();
    }
});
