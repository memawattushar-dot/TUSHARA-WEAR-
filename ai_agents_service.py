import os
from google import genai
from google.genai import types

# --- 0. सेटअप ---
# सुनिश्चित करें कि GEMINI_API_KEY environment variable सेट है।
api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    print("त्रुटि: API Key सेट नहीं है।")
    exit()

client = genai.Client(api_key=api_key)
MODEL = 'gemini-2.5-flash' # तेज़ और कुशल मॉडल

# --- 1. कस्टमर डेटा/मेमोरी (डेटाबेस से सिम्युलेटेड) ---
# वास्तविक कार्यान्वयन में, यह डेटाबेस से लोड होगा।
customer_data = {
    "name": "राहुल",
    "last_product_interest": "प्रीमियम विजेट X",
    "is_frustrated": True, # कस्टमर प्रोफाइलिंग लॉजिक ने यह फ्लैग सेट किया है
    "current_page": "भुगतान पृष्ठ"
}

# --- AI एजेंट 1: कन्वर्सेशनल असिस्टेंट (मेमोरी के साथ) ---
def conversational_agent(user_message: str, user_id: str):
    # *नोट:* वास्तविक चैट सेशन को स्टोर/लोड करने के लिए
    # डेवलपर को यहां chat = client.chats.create() को यूज़र ID के साथ मैप करना होगा।
    
    # सिस्टम को AI की भूमिका समझाना
    system_instruction = (
        "आप इस वेबसाइट के मुख्य AI एजेंट ('वेबसाइट सीईओ') हैं। "
        f"वर्तमान ग्राहक का नाम {customer_data['name']} है और वह {customer_data['current_page']} पर है।"
        "उनकी पिछली रुचि प्रीमियम विजेट X में थी। उनकी पिछली बातचीत को याद रखें और विनम्र रहें।"
    )
    
    response = client.models.generate_content(
        model=MODEL,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction
        )
    )
    return response.text

# --- AI एजेंट 2: रियल-टाइम निजीकरण / प्रोएक्टिव असिस्टेंट ---
def proactive_assistant():
    if customer_data["is_frustrated"] and customer_data["current_page"] == "भुगतान पृष्ठ":
        # AI को प्रोएक्टिव एक्शन प्रॉम्प्ट करें
        system_instruction = (
            f"ग्राहक {customer_data['name']} भुगतान पृष्ठ पर अटका हुआ है और निराश लग रहा है। "
            "एक संक्षिप्त (short) और सहायक (helpful) मैसेज जनरेट करें जो उन्हें खरीदारी पूरी करने के लिए प्रोत्साहित करे और उन्हें सहायता प्रदान करे।"
        )
        
        response = client.models.generate_content(
            model=MODEL,
            contents="मुझे क्या करना चाहिए?",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        # यह आउटपुट सीधे वेबसाइट पर प्रोएक्टिव पॉप-अप के रूप में जाएगा
        return f"प्रोएक्टिव मैसेज: {response.text}"
    return "कोई प्रोएक्टिव एक्शन आवश्यक नहीं।"

# --- AI एजेंट 3: मार्केट इंटेलिजेंस (डेटा सारांश) ---
def market_intelligence_agent(scraped_market_data: str):
    # मार्केट डेटा का सारांश और विश्लेषण करने के लिए प्रॉम्प्ट
    market_prompt = (
        "आप एक बाज़ार विश्लेषक हैं। निम्नलिखित मार्केट डेटा का विश्लेषण करें। "
        "तीन बुलेट पॉइंट्स में 'मुख्य निष्कर्ष' और 'वेबसाइट के लिए अगला कदम' सुझाएँ।"
        f"\n\nमार्केट डेटा: {scraped_market_data}"
    )
    
    response = client.models.generate_content(
        model=MODEL,
        contents=market_prompt
    )
    # यह आउटपुट एडमिन को भेजा जाएगा
    return response.text

# --- डेमो रन ---

# 1. कन्वर्सेशनल एजेंट का उपयोग
chat_response = conversational_agent(
    "हाय, क्या आप मुझे प्रीमियम विजेट X की कीमत बता सकते हैं?", 
    user_id="12345"
)
print("--- 1. कन्वर्सेशनल असिस्टेंट ---")
print(chat_response)

# 2. प्रोएक्टिव असिस्टेंट का उपयोग
proactive_message = proactive_assistant()
print("\n--- 2. प्रोएक्टिव असिस्टेंट (वेबसाइट एक्शन) ---")
print(proactive_message)

# 3. मार्केट इंटेलिजेंस एजेंट का उपयोग
sample_market_data = (
    "प्रतियोगी A ने कल मुफ्त शिपिंग की घोषणा की। उद्योग के ब्लॉग अब नए एआई टूल्स पर ध्यान केंद्रित कर रहे हैं। "
    "ग्राहक समीक्षाओं से पता चलता है कि हमारे विजेट X का रंग थोड़ा फीका है।"
)
market_report = market_intelligence_agent(sample_market_data)
print("\n--- 3. मार्केट इंटेलिजेंस रिपोर्ट (एडमिन को) ---")
print(market_report)
