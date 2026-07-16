// src/dashboards/OrganizerDashboard.jsx
import React, { useState } from 'react';
import { Trophy, Leaf, DollarSign, Plus, RefreshCw, Eye } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function OrganizerDashboard({
  state = {},
  onGenerateFixtures = () => {},
  onUpdateDynamicPricing = () => {},
  onToggleEcoMode = () => {}
}) {
  const { matches = [], sustainability = {}, revenue = {} } = state;
  const [newTeam, setNewTeam] = useState('');
  const [teamList, setTeamList] = useState(['England', 'Spain', 'Italy', 'Portugal']);
  const [generating, setGenerating] = useState(false);

  const addTeam = () => {
    if (!newTeam.trim()) return;
    setTeamList(prev => [...prev, newTeam.trim()]);
    setNewTeam('');
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await onGenerateFixtures(teamList);
    setGenerating(false);
  };

  const handlePricingChange = (e) => {
    onUpdateDynamicPricing(Number(e.target.value));
  };

  // Mock static timeline chart data for Sustainability resource
  const chartData = [
    { name: '12:00', solar: 120, grid: 800 },
    { name: '13:00', solar: 240, grid: 750 },
    { name: '14:00', solar: 410, grid: 620 },
    { name: '15:00', solar: 480, grid: 940 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Tournament Planner & Fixture Generator */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Planning & Fixtures</span>
            <h3 className="text-slate-100 font-semibold text-base">AI Tournament Planner</h3>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="Add team (e.g. England)"
              className="flex-1 bg-slate-950 text-xs rounded border border-slate-800 px-2 py-1.5 outline-none text-slate-300 focus:border-cyan-400"
            />
            <button
              onClick={addTeam}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 flex items-center justify-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="mb-4">
            <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Roster Team Pool</span>
            <div className="flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto pr-1">
              {teamList.map((t, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-1.5 text-center bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded font-semibold text-xs hover:bg-cyan-500/30 flex items-center justify-center gap-2"
          >
            {generating ? <RefreshCw size={14} className="animate-spin" /> : <Trophy size={14} />}
            Generate Tournament Fixtures
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 max-h-[140px] overflow-y-auto pr-1 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Matches List</span>
          {matches.map((m) => (
            <div key={m.id} className="p-2 rounded bg-slate-950/40 border border-slate-900 flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-300">{m.home} vs {m.away}</span>
              <span className="text-slate-500">{m.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sustainability Monitor */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Resource Optimization</span>
            <h3 className="text-slate-100 font-semibold text-base">Sustainability Intelligence</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-2 rounded bg-slate-950/50 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-500 block">GRID DEMAND</span>
              <span className="font-mono text-sm text-rose-400 font-semibold">{sustainability.powerUsageKw} kW</span>
            </div>
            <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30">
              <span className="text-[9px] font-mono text-emerald-400 block">SOLAR OFFSET</span>
              <span className="font-mono text-sm text-emerald-400 font-semibold">+{sustainability.solarGenerationKw} kW</span>
            </div>
          </div>

          {/* Spark chart for resource telemetry */}
          <div className="h-20 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area type="monotone" dataKey="solar" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={1.5} />
                <Area type="monotone" dataKey="grid" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <div className="flex items-center gap-1.5">
            <Leaf className="text-emerald-400" size={15} />
            <span className="text-xs font-semibold text-slate-300">Smart Eco-Mode</span>
          </div>
          <button
            onClick={onToggleEcoMode}
            className={`px-3 py-1 rounded-full text-xs font-semibold font-mono border transition-all ${
              sustainability.smartEcoMode
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {sustainability.smartEcoMode ? 'ACTIVE' : 'STANDBY'}
          </button>
        </div>
      </div>

      {/* 3. Revenue Operations */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Commercial Operations</span>
            <h3 className="text-slate-100 font-semibold text-base">Revenue & Ticket Optimization</h3>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 font-mono mb-4 text-xs">
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500">TICKETS SOLD</span>
              <span className="text-slate-200">${revenue.tickets?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 py-2">
              <span className="text-slate-500">CONCESSION SALES</span>
              <span className="text-slate-200">${revenue.food?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 py-2">
              <span className="text-slate-500">DYNAMIC MULTIPLIER</span>
              <span className="text-cyan-400 font-semibold">{revenue.dynamicPricingFactor}x</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
          <span className="text-[10px] font-mono uppercase text-slate-500">Set Dynamic Pricing Rules</span>
          <select
            value={revenue.dynamicPricingFactor}
            onChange={handlePricingChange}
            className="bg-slate-950 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 border border-slate-800 outline-none w-full"
          >
            <option value="1.0">1.0x (Standard Pricing)</option>
            <option value="1.25">1.25x (Medium Surge)</option>
            <option value="1.5">1.5x (High Demand Surge)</option>
            <option value="1.75">1.75x (Extreme Attendance Surge)</option>
            <option value="2.0">2.0x (Peak World Cup Surge)</option>
          </select>
        </div>
      </div>

    </div>
  );
}
