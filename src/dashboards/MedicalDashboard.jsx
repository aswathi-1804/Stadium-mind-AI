// src/dashboards/MedicalDashboard.jsx
import React, { useState } from 'react';
import { Siren, Users, Crosshair, PhoneCall, Check } from 'lucide-react';

export default function MedicalDashboard({
  state = {},
  onActionExecute = () => {}
}) {
  const { crowdZones = [], securityAlerts = [] } = state;

  const [medicalIncidents, setMedicalIncidents] = useState([
    { id: 'med-001', location: 'Gate 3 Turnstile', issue: 'Possible Heatstroke (Elderly Fan)', priority: 'High', status: 'Dispatched', responder: 'Medic Team Red' },
    { id: 'med-002', location: 'East Stand Row G', issue: 'Minor head injury (Fall collision)', priority: 'Medium', status: 'Pending', responder: 'Unassigned' }
  ]);

  const handleDispatch = (id, team) => {
    setMedicalIncidents(prev => prev.map(m => m.id === id ? { ...m, responder: team, status: 'En-Route' } : m));
  };

  const handleResolve = (id) => {
    setMedicalIncidents(prev => prev.map(m => m.id === id ? { ...m, status: 'Resolved' } : m));
  };

  const priorityColors = {
    High: 'border-rose-500 bg-rose-500/10 text-rose-400',
    Medium: 'border-amber-500 bg-amber-500/10 text-amber-400',
    Low: 'border-slate-800 bg-slate-950/40 text-slate-400'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Medical Incident Dispatcher */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Siren className="text-rose-500 animate-pulse" size={18} />
              <h3 className="text-slate-100 font-semibold text-base">Medical Event Dispatcher</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">{medicalIncidents.filter(m => m.status !== 'Resolved').length} active reports</span>
          </div>

          <div className="space-y-3.5">
            {medicalIncidents.map((inc) => (
              <div key={inc.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${priorityColors[inc.priority]} ${inc.status === 'Resolved' && 'opacity-50'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{inc.location}</span>
                    <span className="text-[9px] font-mono uppercase bg-black/40 px-1 border border-current rounded">{inc.priority} PRIORITY</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{inc.issue} — Status: {inc.status}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center font-mono">
                  {inc.status === 'Pending' && (
                    <select
                      onChange={(e) => handleDispatch(inc.id, e.target.value)}
                      className="bg-slate-950 text-slate-300 text-[10px] rounded px-2 py-1 border border-slate-850 outline-none"
                    >
                      <option value="">Dispatch Medic...</option>
                      <option value="Medic Team Red">Medic Team Red (North)</option>
                      <option value="Medic Team Blue">Medic Team Blue (VIP)</option>
                      <option value="First Aid Station 1">First Aid Station 1 (East)</option>
                    </select>
                  )}
                  {inc.status === 'En-Route' && (
                    <button
                      onClick={() => handleResolve(inc.id)}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-500/30 flex items-center gap-1"
                    >
                      <Check size={12} /> Mark Scene Clear
                    </button>
                  )}
                  {inc.status === 'Dispatched' && (
                    <span className="text-[10px] text-cyan-400 font-semibold">{inc.responder} Responding</span>
                  )}
                  {inc.status === 'Resolved' && (
                    <span className="text-[10px] text-slate-500">Resolved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
          <PhoneCall size={12} className="text-cyan-400" />
          Direct VoIP link active to Local EMT Emergency dispatch.
        </div>
      </div>

      {/* 2. Critical Stampede Risk telemetry */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Crowd Safety telemetry</span>
          <h3 className="text-slate-100 font-semibold text-base mb-3">Egress Health telemetry</h3>

          <div className="space-y-3.5">
            {crowdZones.map((z) => {
              const riskColor = z.density >= 75 ? 'text-rose-400' : z.density >= 50 ? 'text-amber-400' : 'text-emerald-400';
              return (
                <div key={z.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{z.name}</h4>
                    <p className="text-[9px] font-mono text-slate-500">Flow rate: {z.flowRate} people/min</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-mono font-semibold block ${riskColor}`}>
                      {z.density}% Density
                    </span>
                    <span className="text-[8px] font-mono text-slate-600 block uppercase">
                      Risk: {z.stampedeRisk}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
          <Users size={12} className="text-cyan-400" />
          Sensor telemetry refreshes dynamically every 5 seconds.
        </div>
      </div>

    </div>
  );
}
