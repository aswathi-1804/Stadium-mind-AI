// src/dashboards/CoachDashboard.jsx
import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';

export default function CoachDashboard({
  state = {},
  onSubstitute = () => {}
}) {
  const { coachStats = {} } = state;
  const lineup = coachStats.lineup || [];

  const [subOut, setSubOut] = useState('');
  const [subIn, setSubIn] = useState('');
  const [chatPrompt, setChatPrompt] = useState('Analyze Di Maria fatigue and recommend subs');
  const [aiReport, setAiReport] = useState("Click 'Request AI Advice' to generate real-time substitution recommendations from Gemini.");
  const [loading, setLoading] = useState(false);

  const activePlayers = lineup.filter(p => p.status === 'Active');
  const benchPlayers = lineup.filter(p => p.status === 'Bench');

  // Request sub instructions from server Gemini
  const fetchSubAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: chatPrompt,
          role: 'Coach',
          context: { lineup }
        })
      });
      const data = await res.json();
      setAiReport(data.reply || "Failed to fetch response.");
    } catch (err) {
      console.error(err);
      setAiReport("Unable to contact Gemini API. Default advice: Replace Angel Di Maria (Fatigue 78%) with Lautaro Martinez (Bench, Fatigue 12%) immediately at Minute 60.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubSubmit = (e) => {
    e.preventDefault();
    if (!subOut || !subIn) return;
    onSubstitute(subOut, subIn);
    setSubOut('');
    setSubIn('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Squad Biometrics Telemetry */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 lg:col-span-2 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Match Operations</span>
            <h3 className="text-slate-100 font-semibold text-base">Squad Biometrics Telemetry</h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
            <Activity size={14} className="animate-pulse" /> LIVE TELEMETRY STREAM
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[360px] pr-1">
          {activePlayers.map(p => {
            const riskColor = p.injuryRisk >= 50 ? 'text-rose-400' : p.injuryRisk >= 30 ? 'text-amber-400' : 'text-emerald-400';
            const fatigueColor = p.fatigue >= 70 ? 'bg-rose-500' : p.fatigue >= 40 ? 'bg-amber-400' : 'bg-emerald-400';
            return (
              <div key={p.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{p.number}. {p.name}</h4>
                    <p className="text-[9px] font-mono text-slate-500">{p.position} | Played: {p.minutesPlayed} mins</p>
                  </div>
                  <span className={`text-[10px] font-mono font-semibold ${riskColor}`}>
                    Risk: {p.injuryRisk}%
                  </span>
                </div>
                
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
                    <span>Fatigue Index</span>
                    <span>{p.fatigue}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${fatigueColor}`} style={{ width: `${p.fatigue}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. AI Coach Assistant Recommendations */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">AI Assistant</span>
          <h3 className="text-slate-100 font-semibold text-base mb-3">AI Coach Assistant</h3>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 text-[11px] text-slate-300 leading-relaxed font-mono min-h-[140px]">
            {loading ? (
              <span className="flex items-center gap-2 text-cyan-400"><RefreshCw size={12} className="animate-spin" /> Querying Gemini Orchestrator...</span>
            ) : (
              <p>{aiReport}</p>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              placeholder="Ask coach assistant..."
              className="flex-1 bg-slate-950 text-xs rounded border border-slate-800 px-2 py-1 outline-none text-slate-300 focus:border-cyan-400"
            />
            <button
              onClick={fetchSubAdvice}
              className="px-2.5 py-1 rounded bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-400/20 flex items-center gap-1"
            >
              <MessageSquare size={11} /> Advice
            </button>
          </div>
        </div>

        {/* Dynamic sub submission box */}
        <form onSubmit={handleSubSubmit} className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2.5">
          <span className="text-[10px] font-mono uppercase text-slate-500">Execute Substitution</span>
          <div className="flex gap-2">
            <select
              value={subOut}
              onChange={(e) => setSubOut(e.target.value)}
              required
              className="bg-slate-950 text-slate-300 text-[10px] rounded px-1.5 py-1 border border-slate-800 outline-none flex-1"
            >
              <option value="">Sub OUT...</option>
              {activePlayers.map(p => (
                <option key={p.id} value={p.id}>{p.number}. {p.name} ({p.fatigue}%)</option>
              ))}
            </select>

            <select
              value={subIn}
              onChange={(e) => setSubIn(e.target.value)}
              required
              className="bg-slate-950 text-slate-300 text-[10px] rounded px-1.5 py-1 border border-slate-800 outline-none flex-1"
            >
              <option value="">Sub IN...</option>
              {benchPlayers.map(p => (
                <option key={p.id} value={p.id}>{p.number}. {p.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full py-1.5 text-center bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded font-semibold text-xs hover:bg-cyan-500/30">
            Confirm Substitution
          </button>
        </form>
      </div>

    </div>
  );
}
