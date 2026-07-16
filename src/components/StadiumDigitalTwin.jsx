// src/components/StadiumDigitalTwin.jsx
import React, { useState } from 'react';
import { Camera, Wifi, Lightbulb, ArrowUpRight, Flame, ShieldAlert, ZapOff } from 'lucide-react';

export default function StadiumDigitalTwin({
  zones = [],
  sensors = [],
  maintenance = [],
  incidentMode = null,
  safestZoneName = '',
  onSelectZone = () => {}
}) {
  const [selectedElement, setSelectedElement] = useState(null);

  // Helper: map density percentage to color classes
  const getDensityColor = (density) => {
    if (density >= 85) return 'rgba(244, 63, 94, 0.4)'; // critical rose
    if (density >= 60) return 'rgba(251, 191, 36, 0.4)'; // caution amber
    return 'rgba(52, 211, 153, 0.2)'; // nominal emerald
  };

  const getDensityBorder = (density) => {
    if (density >= 85) return 'stroke-rose-500';
    if (density >= 60) return 'stroke-amber-400';
    return 'stroke-emerald-400';
  };

  // Find maintenance issue count per zone
  const getZoneMaintenanceRisk = (zoneId) => {
    const matched = maintenance.filter(m => {
      if (zoneId === 'zone-north' && m.item.includes('North')) return true;
      if (zoneId === 'zone-south' && m.item.includes('South')) return true;
      if (zoneId === 'zone-east' && m.item.includes('East')) return true;
      if (zoneId === 'zone-west' && m.item.includes('West')) return true;
      return false;
    });
    const maxRisk = matched.reduce((max, m) => Math.max(max, m.failureRisk), 0);
    return maxRisk > 0 ? maxRisk : 5;
  };

  return (
    <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Facility Operations</span>
          <h3 className="text-slate-100 font-semibold text-base">Stadium Digital Twin (2.5D Real-time Overlay)</h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/40 border border-emerald-400 animate-pulse" /> Safe</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-400/40 border border-amber-400 animate-pulse" /> Warning</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500/40 border border-rose-500 animate-pulse" /> Critical</span>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative flex-1 flex items-center justify-center min-h-[300px] border border-slate-800/40 rounded-xl bg-slate-950/40 p-4">
        <svg viewBox="0 0 600 400" className="w-full max-h-[340px] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <defs>
            <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
            </radialGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Track / Background Ring */}
          <ellipse cx="300" cy="200" rx="270" ry="170" className="fill-slate-900/50 stroke-slate-800/60" strokeWidth="3" />
          <ellipse cx="300" cy="200" rx="255" ry="155" className="fill-transparent stroke-slate-700/30" strokeWidth="1" strokeDasharray="5,5" />

          {/* Zones Layout */}
          
          {/* North Stand (Top) */}
          {(() => {
            const z = zones.find(x => x.id === 'zone-north') || { density: 40 };
            return (
              <path
                d="M 120,95 C 200,30 400,30 480,95 L 430,135 C 370,95 230,95 170,135 Z"
                fill={getDensityColor(z.density)}
                className={`cursor-pointer transition-all hover:opacity-85 ${getDensityBorder(z.density)}`}
                strokeWidth="1.5"
                onClick={() => { onSelectZone(z); setSelectedElement({ type: 'zone', item: z }); }}
              />
            );
          })()}

          {/* South Stand (Bottom) */}
          {(() => {
            const z = zones.find(x => x.id === 'zone-south') || { density: 30 };
            return (
              <path
                d="M 120,305 C 200,370 400,370 480,305 L 430,265 C 370,305 230,305 170,265 Z"
                fill={getDensityColor(z.density)}
                className={`cursor-pointer transition-all hover:opacity-85 ${getDensityBorder(z.density)}`}
                strokeWidth="1.5"
                onClick={() => { onSelectZone(z); setSelectedElement({ type: 'zone', item: z }); }}
              />
            );
          })()}

          {/* East Concourse (Right) */}
          {(() => {
            const z = zones.find(x => x.id === 'zone-east') || { density: 55 };
            return (
              <path
                d="M 480,95 C 555,160 555,240 480,305 L 430,265 C 475,220 475,180 430,135 Z"
                fill={getDensityColor(z.density)}
                className={`cursor-pointer transition-all hover:opacity-85 ${getDensityBorder(z.density)}`}
                strokeWidth="1.5"
                onClick={() => { onSelectZone(z); setSelectedElement({ type: 'zone', item: z }); }}
              />
            );
          })()}

          {/* West Concourse (Left) */}
          {(() => {
            const z = zones.find(x => x.id === 'zone-west') || { density: 31 };
            return (
              <path
                d="M 120,95 C 45,160 45,240 120,305 L 170,265 C 125,220 125,180 170,135 Z"
                fill={getDensityColor(z.density)}
                className={`cursor-pointer transition-all hover:opacity-85 ${getDensityBorder(z.density)}`}
                strokeWidth="1.5"
                onClick={() => { onSelectZone(z); setSelectedElement({ type: 'zone', item: z }); }}
              />
            );
          })()}

          {/* Pitch / Field (Center Oval) */}
          <ellipse
            cx="300" cy="200" rx="145" ry="85"
            fill="url(#fieldGrad)"
            className="stroke-cyan-500/40"
            strokeWidth="2"
          />
          {/* Pitch Lines */}
          <ellipse cx="300" cy="200" rx="130" ry="70" fill="none" className="stroke-slate-700/40" strokeWidth="1" />
          <line x1="300" y1="130" x2="300" y2="270" className="stroke-slate-700/40" strokeWidth="1" />
          <circle cx="300" cy="200" r="25" fill="none" className="stroke-slate-700/40" strokeWidth="1" />

          {/* Main Gate (Top Left Entry) */}
          {(() => {
            const z = zones.find(x => x.id === 'zone-gate') || { density: 60 };
            return (
              <g
                className="cursor-pointer group"
                onClick={() => { onSelectZone(z); setSelectedElement({ type: 'zone', item: z }); }}
              >
                <rect x="75" y="65" width="40" height="25" rx="4" fill={getDensityColor(z.density)} className={`${getDensityBorder(z.density)} stroke`} strokeWidth="1.5" />
                <text x="95" y="80" textAnchor="middle" className="fill-slate-300 font-mono text-[9px] font-semibold">GATE</text>
              </g>
            );
          })()}

          {/* VIP Lounge (Center Top Overlay) */}
          {(() => {
            const z = zones.find(x => x.id === 'zone-vip') || { density: 20 };
            return (
              <g
                className="cursor-pointer group"
                onClick={() => { onSelectZone(z); setSelectedElement({ type: 'zone', item: z }); }}
              >
                <rect x="260" y="85" width="80" height="22" rx="4" fill={getDensityColor(z.density)} className={`${getDensityBorder(z.density)} stroke`} strokeWidth="1.5" />
                <text x="300" y="99" textAnchor="middle" className="fill-cyan-400 font-mono text-[9px] font-semibold tracking-wider">VIP LOUNGE</text>
              </g>
            );
          })()}

          {/* Operational Overlays & Sensors */}
          
          {/* North CCTV Camera (sns-001) */}
          <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'sensor', item: sensors[0] || { id: 'sns-001', status: 'Online', type: 'Camera' } })}>
            <circle cx="300" cy="55" r="10" className="fill-slate-950 stroke-cyan-500" strokeWidth="1" />
            <path d="M296,52 L304,52 L304,58 L296,58 Z M300,52 L300,48" className="stroke-cyan-400" strokeWidth="1" />
            <circle cx="300" cy="55" r="2" className="fill-cyan-400" />
          </g>

          {/* East Concourse LiDAR (sns-002) */}
          <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'sensor', item: sensors[1] || { id: 'sns-002', status: 'Online', type: 'Crowd LiDAR' } })}>
            <circle cx="505" cy="200" r="10" className="fill-slate-950 stroke-cyan-500" strokeWidth="1" />
            <circle cx="505" cy="200" r="4" className="fill-amber-400 animate-ping" />
            <circle cx="505" cy="200" r="2.5" className="fill-amber-400" />
          </g>

          {/* West Concourse Camera (sns-006 - Offline) */}
          <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'sensor', item: sensors[5] || { id: 'sns-006', status: 'Offline', type: 'Camera' } })}>
            <circle cx="95" cy="200" r="10" className="fill-slate-950 stroke-rose-500" strokeWidth="1" />
            <line x1="91" y1="196" x2="99" y2="204" className="stroke-rose-500" strokeWidth="1.5" />
            <circle cx="95" cy="200" r="2.5" className="fill-rose-500/50" />
          </g>

          {/* Center LED Floodlight Node (maint-003) */}
          <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'maintenance', item: maintenance[2] || { id: 'maint-003', item: 'LED light', status: 'Functional' } })}>
            <polygon points="300,165 304,173 313,173 306,178 309,186 300,181 291,186 294,178 287,173 296,173" className="fill-amber-300 stroke-amber-500" strokeWidth="0.5" />
          </g>

          {/* Interactive Alarms / Incident Visuals */}
          {incidentMode && (
            <>
              {/* Power Failure Effect */}
              {incidentMode === 'power_failure' && (
                <g filter="url(#neonGlow)">
                  {/* Blackout overlay (semi-transparent darkness) */}
                  <rect x="0" y="0" width="600" height="400" rx="16" fill="rgba(15, 23, 42, 0.75)" pointerEvents="none" />
                  {/* Warning lightning icon */}
                  <g transform="translate(285, 175) scale(1.5)" className="animate-pulse">
                    <circle cx="10" cy="10" r="12" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="1.5" />
                    <path d="M10,2 L4,11 L9,11 L8,18 L16,9 L11,9 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                  </g>
                </g>
              )}

              {/* Stampede Risk / Crowding alerts */}
              {incidentMode === 'stampede_risk' && (
                <g transform="translate(470, 150) scale(1.2)" className="animate-bounce">
                  <path d="M12,2 L2,22 L22,22 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
                  <text x="12" y="18" textAnchor="middle" className="fill-white font-bold font-mono text-xs">!</text>
                  <circle cx="12" cy="15" r="15" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" />
                </g>
              )}

              {/* Fire Hazard */}
              {incidentMode === 'fire_hazard' && (
                <g transform="translate(100, 250) scale(1.2)" className="animate-pulse">
                  <ellipse cx="10" cy="10" r="16" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1" className="animate-ping" />
                  <path d="M12 2C12 2 15.28 5.28 15.28 9.28C15.28 12.5 12.5 15.28 9.28 15.28C6.06 15.28 3.28 12.5 3.28 9.28C3.28 7.39 4.39 5.28 6.5 4.17C7.22 8.33 10.39 9.44 12 7.78C12 6.06 12 2 12 2Z" fill="#f97316" stroke="#ea580c" />
                </g>
              )}
            </>
          )}

          {/* Emergency Evacuation Path Vectors */}
          {incidentMode && (
            <g>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                </marker>
              </defs>
              
              {/* Neon Green evacuation routes */}
              {safestZoneName && (
                <>
                  {/* From West to East / Main Safe area */}
                  <path d="M 180,180 Q 300,120 420,160" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="8,6" markerEnd="url(#arrow)" className="animate-[dash_2s_linear_infinite]" style={{ filter: 'drop-shadow(0 0 4px #10b981)' }} />
                  <path d="M 200,240 Q 300,280 400,240" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="8,6" markerEnd="url(#arrow)" className="animate-[dash_2s_linear_infinite]" style={{ filter: 'drop-shadow(0 0 4px #10b981)' }} />
                </>
              )}
            </g>
          )}
        </svg>

        {/* Hover/Selection Info Dialog */}
        {selectedElement && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 border border-slate-700/60 rounded-xl p-3 text-xs flex items-center justify-between backdrop-blur-md">
            <div>
              {selectedElement.type === 'zone' && (
                <div>
                  <p className="font-semibold text-slate-100">{selectedElement.item.name}</p>
                  <p className="text-slate-400 font-mono">Density: <span className="text-cyan-400 font-bold">{selectedElement.item.density}%</span> | Stampede Risk: <span className={selectedElement.item.density >= 85 ? 'text-rose-400' : selectedElement.item.density >= 60 ? 'text-amber-400' : 'text-emerald-400'}>{selectedElement.item.stampedeRisk || 'Low'}</span></p>
                </div>
              )}
              {selectedElement.type === 'sensor' && (
                <div>
                  <p className="font-semibold text-slate-100">IoT Sensor {selectedElement.item.id}</p>
                  <p className="text-slate-400 font-mono">Type: {selectedElement.item.type} | Status: <span className={selectedElement.item.status === 'Online' ? 'text-emerald-400' : 'text-rose-400'}>{selectedElement.item.status}</span></p>
                </div>
              )}
              {selectedElement.type === 'maintenance' && (
                <div>
                  <p className="font-semibold text-slate-100">{selectedElement.item.item}</p>
                  <p className="text-slate-400 font-mono">Risk: <span className="text-amber-400">{selectedElement.item.failureRisk}%</span> | Status: {selectedElement.item.status}</p>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedElement(null)} className="h-6 px-2 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200">
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 font-mono leading-relaxed">
        <div className="flex items-center gap-1.5"><Camera size={13} className="text-cyan-400" /> CCTV Grid Active</div>
        <div className="flex items-center gap-1.5"><Wifi size={13} className="text-cyan-400" /> Gateway Mesh Active</div>
        <div className="flex items-center gap-1.5"><Lightbulb size={13} className="text-cyan-400" /> Smart Lighting Loop</div>
      </div>
      
      {/* EVACUATION HEADS UP */}
      {incidentMode && safestZoneName && (
        <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-400 font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span><strong>EVACUATION ROUTE CALCULATION ACTIVE:</strong> Directing traffic to <strong>{safestZoneName}</strong>.</span>
          </div>
          <ArrowUpRight size={14} className="shrink-0" />
        </div>
      )}

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-\[dash_2s_linear_infinite\] {
          animation: dash 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
