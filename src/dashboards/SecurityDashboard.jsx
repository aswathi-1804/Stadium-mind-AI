// src/dashboards/SecurityDashboard.jsx
import React, { useState } from 'react';
import { Camera, ShieldAlert, CheckCircle, Navigation, Radio } from 'lucide-react';

export default function SecurityDashboard({
  state = {},
  onAcknowledgeAlert = () => {}
}) {
  const { securityAlerts = [], sensors = [] } = state;
  const [assigningTo, setAssigningTo] = useState({});

  const sevColors = {
    critical: 'border-rose-500 bg-rose-500/10 text-rose-400',
    high: 'border-amber-500 bg-amber-500/10 text-amber-400',
    medium: 'border-cyan-500 bg-cyan-500/10 text-cyan-300',
    low: 'border-slate-700 bg-slate-800/40 text-slate-400'
  };

  const handleAssign = (alertId, officerName) => {
    setAssigningTo(prev => ({ ...prev, [alertId]: officerName }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. CCTV Video Matrix */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 lg:col-span-2 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">CCTV Surveillance</span>
            <h3 className="text-slate-100 font-semibold text-base">Multi-Channel CCTV Feeds (Vision AI Scanning)</h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-rose-400 font-mono">
            <Radio size={14} className="animate-pulse" /> SCANNING FOR ANOMALIES
          </span>
        </div>

        {/* 2x2 grid representing CCTV cameras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {/* Feed 1 */}
          <div className="border border-slate-800 rounded-xl bg-slate-950/80 relative aspect-video flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-1 rounded border border-slate-800 flex items-center gap-1">
              <Camera size={10} className="text-cyan-400" /> CAM-01 (North Stand Entry)
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400">FPS: 30.0</div>
            <div className="text-[11px] text-slate-600 font-mono text-center">
              [ Feed active: Scanning crowd densities ]
            </div>
          </div>

          {/* Feed 2 */}
          <div className="border border-slate-800 rounded-xl bg-slate-950/80 relative aspect-video flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-1 rounded border border-slate-800 flex items-center gap-1">
              <Camera size={10} className="text-cyan-400" /> CAM-02 (East Concourse)
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400">FPS: 30.0</div>
            {securityAlerts.some(a => a.zoneId === 'zone-east') ? (
              <div className="absolute inset-0 bg-rose-500/10 border-2 border-rose-500 flex flex-col items-center justify-center animate-pulse">
                <ShieldAlert className="text-rose-500 mb-1" size={20} />
                <span className="text-[11px] font-bold text-rose-400 font-mono uppercase">Unattended bag anomaly</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-600 font-mono text-center">
                [ Feed active: Nominal scan ]
              </div>
            )}
          </div>

          {/* Feed 3 */}
          <div className="border border-slate-800 rounded-xl bg-slate-950/80 relative aspect-video flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-1 rounded border border-slate-800 flex items-center gap-1">
              <Camera size={10} className="text-cyan-400" /> CAM-03 (Main Gate Loop)
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400">FPS: 29.8</div>
            <div className="text-[11px] text-slate-600 font-mono text-center">
              [ Feed active: High ticketing flow ]
            </div>
          </div>

          {/* Feed 4 */}
          <div className="border border-slate-800 rounded-xl bg-slate-950/80 relative aspect-video flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-1 rounded border border-slate-800 flex items-center gap-1">
              <Camera size={10} className="text-cyan-400" /> CAM-04 (VIP Lounge corridor)
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400">FPS: 30.0</div>
            <div className="text-[11px] text-slate-600 font-mono text-center">
              [ Feed active: Scanning entry points ]
            </div>
          </div>
        </div>
      </div>

      {/* 2. Security Alert Queue */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Alert Center</span>
          <h3 className="text-slate-100 font-semibold text-base mb-3">Security Alert Queue</h3>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-xl border flex flex-col gap-2 ${sevColors[alert.sev]}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold">{alert.text}</p>
                    <p className="text-[9px] font-mono opacity-75 mt-0.5">{alert.time} | Assigned: {assigningTo[alert.id] || alert.staff || 'Unassigned'}</p>
                  </div>
                  <span className="text-[9px] font-mono uppercase px-1 rounded bg-black/30 border border-current">
                    {alert.sev}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <select
                    onChange={(e) => handleAssign(alert.id, e.target.value)}
                    value={assigningTo[alert.id] || alert.staff || ''}
                    className="bg-slate-900 text-slate-300 text-[10px] rounded px-1.5 py-0.5 border border-slate-800 outline-none flex-1"
                  >
                    <option value="">Assign Officer...</option>
                    <option value="Officer Rao">Officer Rao (Gate 3)</option>
                    <option value="Officer Cooper">Officer Cooper (Section B)</option>
                    <option value="Officer Fernandes">Officer Fernandes (VIP)</option>
                    <option value="Officer Kapoor">Officer Kapoor (North)</option>
                  </select>
                  
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="h-6 w-6 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30"
                    title="Acknowledge Alert"
                  >
                    <CheckCircle size={12} />
                  </button>
                </div>
              </div>
            ))}
            {securityAlerts.length === 0 && (
              <div className="text-center text-slate-500 font-mono py-12 text-xs">
                No active threats detected.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
          <Navigation size={12} className="text-cyan-400" />
          Alert location coordinates synced to Digital Twin map overlays.
        </div>
      </div>

    </div>
  );
}
