// src/components/PitchDeck.jsx
import React, { useState } from 'react';
import { Presentation, ShieldAlert, Sparkles, Database, Users, HelpCircle, Code, ChevronRight, Play } from 'lucide-react';

export default function PitchDeck({
  currentRole,
  onSwitchRole = () => {},
  onTriggerIncident = () => {},
  onResetIncident = () => {},
  onSendFanMessage = () => {}
}) {
  const [slide, setSlide] = useState(0);

  const SLIDES = [
    {
      title: "StadiumMind AI",
      subtitle: "PromptWars Virtual — [Challenge 4] Smart Stadiums & Tournament Operations",
      bullets: [
        "Challenge: Build a GenAI solution enhancing operations & experience for fans, organizers, and staff.",
        "Concept: One unified AI brain connected to an event stream Pub/Sub bus.",
        "GenAI Power: Google Gemini guides crowd routing, schedules guides, checks fatigue, and translates chats.",
        "Coverage: Dynamic twin maps, accessible path toggles, dynamic pricing rules, and security queues."
      ],
      icon: Sparkles
    },
    {
      title: "Fullstack Architecture",
      subtitle: "Scalable Event-Driven Topology",
      bullets: [
        "Event Bus: Realtime ingestion of camera feeds, ticket gates, IoT meters, and GPS data.",
        "Orchestration: Powered by Gemini (reasoning and natural language) + Vertex AI (predictive analytics).",
        "Dual-Mode DB: Firestore active-ready + stateful local file mock for low-friction offline installs.",
        "Enterprise Dashboard: Role-based dashboards for Admins, Security, Medical, Coaches, Organizers, Volunteers, and Fans."
      ],
      icon: Code
    },
    {
      title: "Interactive Demo Action Plan",
      subtitle: "Guide the judges through these 4 key scenarios:",
      bullets: [
        "1. Real-time Command: Admin Digital Twin overlays and dynamic system drifts.",
        "2. Emergency Automation: Trigger crowd pressure surge -> AI calculates exit paths -> updates maps.",
        "3. Predictive Logistics: Smart Parking assignments & dynamic ticketing rates.",
        "4. Personal Fan Hub: Multi-language Q&A powered by Google Gemini."
      ],
      icon: Play
    },
    {
      title: "Production Data Schema",
      subtitle: "Firestore Collections",
      bullets: [
        "Users & Tickets: Core fan identity, active seating assignments.",
        "Parking & Crowd: Real-time sensor densities, occupancy vectors, and historical trends.",
        "Alerts & Predictions: Gemini and Vertex analytics storing anomaly scores and actions.",
        "Maintenance & Volunteers: IoT health indicators and dynamic staff rosters."
      ],
      icon: Database
    }
  ];

  // Quick Action triggers for Demo Script
  const runDemoStep = (step) => {
    if (step === 1) {
      onSwitchRole('Admin');
      onResetIncident();
    } else if (step === 2) {
      onSwitchRole('Admin');
      onTriggerIncident('stampede_risk');
    } else if (step === 3) {
      onSwitchRole('Organizer');
    } else if (step === 4) {
      onSwitchRole('Fan');
      onSendFanMessage("Where is my seat and nearest food?");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Slide Deck Panel */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-6 xl:col-span-2 flex flex-col justify-between min-h-[350px]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Presentation className="text-cyan-400" size={18} />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Judge Pitch Deck</span>
            </div>
            <span className="text-xs font-mono text-slate-500">{slide + 1} / {SLIDES.length}</span>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
              {React.createElement(SLIDES[slide].icon, { className: "text-cyan-400 shrink-0", size: 24 })}
              {SLIDES[slide].title}
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-mono">{SLIDES[slide].subtitle}</p>

            <ul className="mt-6 space-y-3">
              {SLIDES[slide].bullets.map((b, i) => (
                <li key={i} className="text-sm text-slate-200 flex items-start gap-2">
                  <ChevronRight size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setSlide(s => Math.max(0, s - 1))}
            disabled={slide === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 font-mono text-xs"
          >
            Prev
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${idx === slide ? 'bg-cyan-400 w-4' : 'bg-slate-700'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setSlide(s => Math.min(SLIDES.length - 1, s + 1))}
            disabled={slide === SLIDES.length - 1}
            className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 font-mono text-xs"
          >
            Next
          </button>
        </div>
      </div>

      {/* Demo Action Panel */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-6 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Live Demo Scenarios</span>
          <h3 className="text-slate-100 font-semibold text-base mb-4">Quick Simulation Triggers</h3>

          <div className="space-y-3.5">
            {/* Step 1 */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700/50 transition-colors flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-xs text-slate-200">1. Digital Twin Simulation</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Logs in as Admin. Toggles normal drift events.</p>
              </div>
              <button onClick={() => runDemoStep(1)} className="h-7 w-7 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 hover:bg-cyan-400/25">
                <Play size={12} fill="currentColor" />
              </button>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:border-rose-500/30 transition-colors flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-xs text-rose-400 flex items-center gap-1.5"><ShieldAlert size={12} /> 2. Evacuation Coordinator</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Simulates crowd pressure. Generates live exits and warning paths.</p>
              </div>
              <button onClick={() => runDemoStep(2)} className="h-7 w-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 hover:bg-rose-500/25">
                <Play size={12} fill="currentColor" />
              </button>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700/50 transition-colors flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-xs text-slate-200">3. Smart Logistics</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Swaps to Organizer. Tests dynamic ticket pricing & fixtures planner.</p>
              </div>
              <button onClick={() => runDemoStep(3)} className="h-7 w-7 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 hover:bg-cyan-400/25">
                <Play size={12} fill="currentColor" />
              </button>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700/50 transition-colors flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-xs text-slate-200">4. Gemini Fan Assistant</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Swaps to Fan. Pre-populates the conversational chatbot query.</p>
              </div>
              <button onClick={() => runDemoStep(4)} className="h-7 w-7 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 hover:bg-cyan-400/25">
                <Play size={12} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono flex justify-between items-center">
          <span>Targeting FIFA, Olympics, IPL</span>
          <span>Google Build with AI</span>
        </div>
      </div>
    </div>
  );
}
