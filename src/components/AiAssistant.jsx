// src/components/AiAssistant.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Languages, Sparkles, RefreshCw } from 'lucide-react';

export default function AiAssistant({
  role = 'Fan',
  onChat = () => {},
  chatHistory = [],
  setChatHistory = () => {}
}) {
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const QUICK_PROMPTS = {
    en: [
      { text: "Where is my seat?", label: "Seat Location" },
      { text: "Food recommendations?", label: "Food Guide" },
      { text: "Washroom queues?", label: "Washrooms" },
      { text: "Parking egress?", label: "Parking" }
    ],
    hi: [
      { text: "मेरी सीट कहाँ है?", label: "सीट की स्थिति" },
      { text: "भोजन की सिफारिशें?", label: "फूड गाइड" },
      { text: "वॉशरूम कहाँ हैं?", label: "वॉशरूम" },
      { text: "पार्किंग निकास?", label: "पार्किंग" }
    ],
    es: [
      { text: "¿Dónde está mi asiento?", label: "Mi Asiento" },
      { text: "¿Recomendaciones de comida?", label: "Puestos de Comida" },
      { text: "¿Dónde hay baños?", label: "Baños" },
      { text: "¿Salida del estacionamiento?", label: "Estacionamiento" }
    ]
  };

  const currentPrompts = QUICK_PROMPTS[lang] || QUICK_PROMPTS['en'];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;

    // Add user message to state
    setChatHistory(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await onChat(text, role, { lang });
      setChatHistory(prev => [...prev, { from: 'ai', text: responseText }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { from: 'ai', text: "Sorry, I encountered an operational network failure. Please verify your internet connection or backend server status." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md flex flex-col h-[480px] overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="text-cyan-400 animate-pulse" size={17} />
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-slate-500">Multilingual Orchestration</span>
            <h3 className="text-slate-100 font-semibold text-xs leading-none">StadiumMind Gemini AI Assistant</h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Languages size={12} className="text-slate-500" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-slate-950 text-slate-400 text-[10px] rounded px-1.5 py-0.5 border border-slate-850 outline-none"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="es">Español (Spanish)</option>
          </select>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {chatHistory.length === 0 && (
          <div className="text-center text-slate-500 font-mono text-[10px] py-12 leading-relaxed">
            Welcome to the Smart Stadium AI Assistant.<br />
            Ask about seating directions, food queue predictions, parking routes, or translation requests.
          </div>
        )}
        {chatHistory.map((m, idx) => (
          <div key={idx} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed font-mono ${
                m.from === 'user'
                  ? 'bg-cyan-500/10 text-cyan-200 border border-cyan-500/25'
                  : 'bg-slate-950/80 text-slate-300 border border-slate-800'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-950/80 border border-slate-850 text-cyan-400 font-mono text-[10px] rounded-xl px-3 py-2 flex items-center gap-1.5">
              <RefreshCw size={11} className="animate-spin" /> Thinking...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Prompts suggestions */}
      <div className="px-3 pb-3 pt-2 border-t border-slate-800/60 flex flex-wrap gap-1.5">
        {currentPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.text)}
            disabled={loading}
            className="text-[9px] font-mono rounded-full border border-slate-800 bg-slate-950/30 text-slate-400 px-2.5 py-1 hover:border-cyan-500/35 hover:text-cyan-300 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input panel */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/20 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Assistant..."
          disabled={loading}
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="h-8.5 w-8.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center hover:bg-cyan-500/35 transition-colors disabled:opacity-40"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}
