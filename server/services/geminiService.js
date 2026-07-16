// server/services/geminiService.js
import dotenv from 'dotenv';

dotenv.config();

let ai = null;
let model = null;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (GEMINI_API_KEY) {
  try {
    // Correct client initialization for @google/generative-ai
    // Note: The official client uses either:
    // const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    // or from '@google/generative-ai': import { GoogleGenerativeAI } from '@google/generative-ai';
    // Let's support GoogleGenerativeAI import style as well.
    // We will dynamic import or use standard require if needed.
    // In @google/generative-ai, it is usually GoogleGenerativeAI
  } catch (err) {
    console.error('Failed to initialize Gemini AI client:', err);
  }
}

// Fallback AI answers if no API Key is set
const getFallbackChatResponse = (message, lang = 'en') => {
  const q = message.toLowerCase();
  const res = {
    en: {
      seat: "Your seat is located in Section 12, Row F, Seat 24. The closest entrance is Gate 3. Follow the cyan overhead signs upon entering.",
      food: "We recommend 'Grill Corner' in the East Concourse (closest to you) which has a 3-minute waiting time. You can try their specialty Stadium Burgers!",
      washroom: "There are washrooms immediately behind Section 11 (40m west) and Section 14 (65m east). Section 11 washrooms currently have shorter queues.",
      parking: "Your vehicle is in Lot B, Row 4. Egress direction will open via the south bypass roads post-match to minimize traffic delay.",
      queue: "Concession stands in the North Stand have a 12-minute wait. The East Concourse hub is faster, average 5-minute queue.",
      sustainability: "The stadium is currently running on 72% green energy, with 480kW generated from solar roofing. HVAC loads are optimized at 72%.",
      emergency: "EMERGENCY EVACUATION DIRECTIVE: Please head calmly toward the East Concourse and exit through Gate 5. Avoid the North gates where bottlenecks are forming.",
      default: "I am your StadiumMind AI assistant. I can guide you to your seat, recommend food stalls, estimate queue times, suggest parking routes, or translate announcements. How can I assist you today?"
    },
    hi: {
      seat: "आपकी सीट सेक्शन 12, रो F, सीट 24 में स्थित है। निकटतम प्रवेश द्वार गेट 3 है। प्रवेश करने पर कृपया नीले रंग के बोर्ड का पालन करें।",
      food: "हम ईस्ट कॉनकोर्स में 'ग्रिल कॉर्नर' की सलाह देते हैं (जो आपके सबसे करीब है) जहां प्रतीक्षा समय 3 मिनट है। आप वहां के स्पेशल बर्गर ट्राई कर सकते हैं!",
      washroom: "सेक्शन 11 (40 मीटर पश्चिम) और सेक्शन 14 (65 मीटर पूर्व) के ठीक पीछे शौचालय हैं। वर्तमान में सेक्शन 11 वाले शौचालय में कम भीड़ है।",
      parking: "आपका वाहन लॉट B, रो 4 में है। मैच के बाद ट्रैफ़िक को कम करने के लिए दक्षिण बाईपास मार्ग खोला जाएगा।",
      queue: "नॉर्थ स्टैंड के काउंटरों पर 12 मिनट की प्रतीक्षा है। ईस्ट कॉनकोर्स काफी तेज़ है, औसतन 5 मिनट का समय लग रहा है।",
      sustainability: "स्टेडियम वर्तमान में 72% हरित ऊर्जा पर चल रहा है, जिसमें 480kW सौर ऊर्जा से उत्पन्न होती है। एसी लोड को 72% पर नियंत्रित किया गया है।",
      emergency: "आपातकालीन निकासी निर्देश: कृपया शांति से ईस्ट कॉनकोर्स की ओर बढ़ें और गेट 5 से बाहर निकलें। उत्तर द्वारों से बचें जहां भीड़ अधिक है।",
      default: "मैं आपका स्टेडियममाइंड एआई सहायक हूँ। मैं आपको आपकी सीट का रास्ता, भोजन काउंटर, पार्किंग मार्ग, या किसी भी आपातकालीन निर्देश के बारे में बता सकता हूँ। मैं आपकी क्या मदद करूँ?"
    },
    es: {
      seat: "Su asiento está ubicado en la Sección 12, Fila F, Asiento 24. La entrada más cercana es la Puerta 3. Siga los letreros celestes al ingresar.",
      food: "Recomendamos 'Grill Corner' en el East Concourse (el más cercano a usted), que tiene un tiempo de espera de 3 minutos. ¡Pruebe sus hamburguesas especiales!",
      washroom: "Hay baños justo detrás de la Sección 11 (40 m al oeste) y la Sección 14 (65 m al este). Los baños de la Sección 11 tienen menos fila.",
      parking: "Su vehículo está en el Lote B, Fila 4. La salida se abrirá a través de las carreteras del sur después del partido para evitar atascos.",
      queue: "Los puestos de comida en el North Stand tienen 12 minutos de espera. El East Concourse es más rápido, con 5 minutos de espera promedio.",
      sustainability: "El estadio funciona actualmente con un 72% de energía verde, con 480kW generados por paneles solares. El aire acondicionado está optimizado al 72%.",
      emergency: "DIRECTIVA DE EVACUACIÓN DE EMERGENCIA: Diríjase con calma hacia el East Concourse y salga por la Puerta 5. Evite las puertas del norte por embotellamientos.",
      default: "Soy su asistente StadiumMind AI. Puedo guiarlo a su asiento, recomendarle comida, estimar tiempos de espera, sugerir rutas de estacionamiento o traducir. ¿En qué le puedo ayudar?"
    }
  };

  const l = res[lang] || res['en'];
  if (q.includes('seat')) return l.seat;
  if (q.includes('food') || q.includes('burger') || q.includes('eat')) return l.food;
  if (q.includes('washroom') || q.includes('toilet') || q.includes('restroom')) return l.washroom;
  if (q.includes('parking') || q.includes('car')) return l.parking;
  if (q.includes('wait') || q.includes('queue') || q.includes('line')) return l.queue;
  if (q.includes('sustain') || q.includes('power') || q.includes('eco') || q.includes('solar')) return l.sustainability;
  if (q.includes('emergency') || q.includes('danger') || q.includes('evac') || q.includes('fire') || q.includes('stampede')) return l.emergency;
  return l.default;
};

// Main AI orchestration routing
export async function askGemini(prompt, role = 'Fan', context = {}) {
  const lang = context.lang || 'en';

  if (!GEMINI_API_KEY) {
    // Return mock generator
    return new Promise((resolve) => {
      setTimeout(() => {
        if (role === 'Fan') {
          resolve(getFallbackChatResponse(prompt, lang));
        } else if (role === 'Admin' || role === 'Organizer') {
          if (prompt.includes('price') || prompt.includes('revenue')) {
            resolve(`**[AI Decision Engine Analysis]**\nOccupancy is projected at 89%. Dynamic Pricing Factor is adjusted to **1.25x** for standard tickets. Recommend raising Lot C rate to **$50** due to parking congestion. Food stall promotions for 'Grill Corner' should trigger immediately via push notifications to balance queue times.`);
          } else if (prompt.includes('sustainability') || prompt.includes('optimize')) {
            resolve(`**[AI Sustainability Intelligence]**\nSmart Eco-Mode is **ON**. Optimization complete: HVAC ventilation throttled by 10% in empty corridors, saving **120kW/h**. Grid import reduced. Total carbon offset: **85kg CO2** in the past hour.`);
          } else if (prompt.includes('tournament') || prompt.includes('fixture')) {
            resolve(`**[AI Tournament Optimizer]**\nFixtures generated. 3 matches balanced across 4 days. Resolved conflicts: Argentina vs France set to 18:00 to avoid late-night transport logjam. Weather impact: 15% rain predicted on Day 2; recommend roof closures starting 17:00.`);
          } else {
            resolve(`**[AI Command Center Recommendation]**\nBased on real-time crowd dynamics (Zone East density 55%) and Security Alert Queue (Suspicious bag at Section B), I recommend shifting 2 volunteers from West Concourse to East Concourse and alerting nearest officer (Officer Cooper) to inspect Section B immediately.`);
          }
        } else if (role === 'Coach') {
          resolve(`**[AI Coach Assistant Report]**\n* **Fatigue Alerts:** Angel Di Maria is at **78% fatigue** (Injury risk: 55%). Nicolas Otamendi is at **68% fatigue**.\n* **Substitution Advice:** Recommend replacing Di Maria with Lautaro Martinez (Bench - 12% fatigue) at Minute 65 to prevent muscle strain. Switch to counter-attacking formation to preserve midfielder stamina.`);
        } else if (role === 'Security') {
          resolve(`**[AI Security Intelligence Dispatch]**\nPriority alert: Unattended bag at Section B (East Concourse). Nearest security personnel: **Officer Cooper** (20m distance). Dispatching drone route #4 to hover over the spot and stream live feed. Advise immediate cordoning of Section B exit corridors.`);
        } else {
          resolve(`**[AI Orchestrator]** System operating normally. Crowd density average: 40%. Parking occupancy: 63%. All security modules active.`);
        }
      }, 500);
    });
  }

  // Real Gemini API call
  try {
    // Dynamic import to avoid errors if packages aren't fully resolved
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let systemInstruction = `You are StadiumMind AI, the supreme AI Operating System for a smart tournament stadium (FIFA, Olympics, etc.).
    Your current user has the role: "${role}".
    Provide premium, futuristic, concise, and highly professional answers tailored to this role.
    Keep formatting clear using Markdown. Use short lists. Limit length to 120 words maximum.`;

    if (role === 'Fan') {
      systemInstruction += `\nHelp fans with seat locations, food stands (Grill Corner, Taco Stand), toilets, routes, parking (Lot A, B, C, D). Answer in the requested language: ${lang}.`;
    }

    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}\nContext State: ${JSON.stringify(context)}` }] }
      ]
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API call failed, falling back:', error);
    return getFallbackChatResponse(prompt, lang);
  }
}
