// src/dashboards/AdminDashboard.jsx
import React, { useState } from 'react';
import { ShieldAlert, Zap, Siren, RotateCcw, AlertTriangle, Compass, ShieldCheck } from 'lucide-react';

export default function AdminDashboard({
  state = {},
  onTriggerIncident = () => {},
  onResetIncident = () => {},
  onActionExecute = () => {}
}) {
  const { incidentMode, crowdZones = [], parkingLots = [], securityAlerts = [], maintenance = [] } = state;
  const [droneRoute, setDroneRoute] = useState('Route Alpha (Fence Guard)');
  const [isDeployingDrone, setIsDeployingDrone] = useState(false);

  // Generate autonomous recommendations based on state
  const getAiRecommendations = () => {
    const recs = [];
    
    // Check crowd density
    const highCrowd = crowdZones.find(z => z.density >= 65);
    if (highCrowd) {
      recs.push({
        id: 'rec-crowd',
        title: `Crowd Surge Anomaly at ${highCrowd.name}`,
        desc: `Density is ${highCrowd.density}%. AI advises opening adjacent turnstiles and dispatching 2 guides.`,
        actionText: "Accept Reroute Directive",
        impact: "Reduces bottleneck by 22%",
        execute: () => onActionExecute('crowd_reroute', highCrowd.id)
      });
    }

    // Check parking lots
    const fullLot = parkingLots.find(l => (l.occupied / l.capacity) >= 0.85);
    if (fullLot) {
      recs.push({
        id: 'rec-parking',
        title: `Parking Capacity Alert: ${fullLot.name}`,
        desc: `Lot is at ${Math.round((fullLot.occupied / fullLot.capacity) * 100)}% capacity. Reroute arriving vehicles to Lot B.`,
        actionText: "Update Signboard Routing",
        impact: "Spreads load evenly",
        execute: () => onActionExecute('parking_reroute', fullLot.id)
      });
    }

    // Check maintenance
    const badMaint = maintenance.find(m => m.failureRisk >= 75);
    if (badMaint) {
      recs.push({
        id: 'rec-maint',
        title: `Predictive Maintenance Anomaly: ${badMaint.item}`,
        desc: `Failure probability is ${badMaint.failureRisk}%. Schedule urgent volunteer intervention.`,
        actionText: "Dispatch Maintenance Order",
        impact: "Prevents immediate downtime",
        execute: () => onActionExecute('dispatch_maint', badMaint.id)
      });
    }

    // Default if clean
    if (recs.length === 0) {
      recs.push({
        id: 'rec-normal',
        title: "All Systems Operating Nominally",
        desc: "AI Autonomous Decision Engine reporting standard patterns. Smart Eco-Mode is active.",
        actionText: "Run Diagnostics",
        impact: "Validates all telemetry",
        execute: () => alert("Telemetry diagnostics: 100% operational.")
      });
    }

    return recs;
  };

  const handleDeployDrone = () => {
    setIsDeployingDrone(true);
    setTimeout(() => setIsDeployingDrone(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Incident Simulator */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Crisis Center</span>
          <h3 className="text-slate-100 font-semibold text-base mb-2">AI Incident Simulator</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Test and audit stadium emergency systems before kickoff. Instantly override IoT sensors to trigger crisis scenarios.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => onTriggerIncident('power_failure')}
              className={`w-full py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all ${
                incidentMode === 'power_failure'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2"><Zap size={15} /> Total Power Grid Failure</span>
              <span className="text-[10px] font-mono bg-rose-500/20 px-1.5 py-0.5 rounded">T3 System</span>
            </button>

            <button
              onClick={() => onTriggerIncident('stampede_risk')}
              className={`w-full py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all ${
                incidentMode === 'stampede_risk'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2"><Siren size={15} /> Crowd Stampede Anomaly</span>
              <span className="text-[10px] font-mono bg-rose-500/20 px-1.5 py-0.5 rounded">T1 System</span>
            </button>

            <button
              onClick={() => onTriggerIncident('fire_hazard')}
              className={`w-full py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all ${
                incidentMode === 'fire_hazard'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2"><AlertTriangle size={15} /> Fire Hazard Discovery</span>
              <span className="text-[10px] font-mono bg-rose-500/20 px-1.5 py-0.5 rounded">T1 System</span>
            </button>
          </div>
        </div>

        {incidentMode && (
          <button
            onClick={onResetIncident}
            className="mt-6 w-full py-2 px-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 animate-pulse"
          >
            <RotateCcw size={15} /> Resolve Emergency Simulator
          </button>
        )}
      </div>

      {/* 2. AI Autonomous Decision Engine */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">AI Intelligence</span>
          <h3 className="text-slate-100 font-semibold text-base mb-3">Autonomous Decision Engine</h3>

          <div className="space-y-4">
            {getAiRecommendations().map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/30 flex flex-col gap-2.5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{rec.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 uppercase">Confidence: 96%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{rec.desc}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-900 pt-2 text-[10px] font-mono">
                  <span className="text-emerald-400 font-medium">Impact: {rec.impact}</span>
                  <button onClick={rec.execute} className="text-cyan-400 hover:text-cyan-300 underline font-semibold">
                    {rec.actionText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-emerald-400" />
          Decision engine operating in Human-in-the-Loop Mode
        </div>
      </div>

      {/* 3. Drone Patrol Coordination */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Security Recon</span>
          <h3 className="text-slate-100 font-semibold text-base mb-3">AI Drone Coordination</h3>

          {/* Simple Drone SVG map layout */}
          <div className="h-28 w-full border border-slate-800 rounded-xl bg-slate-950/40 relative overflow-hidden p-2 flex items-center justify-center">
            <svg viewBox="0 0 100 60" className="h-full w-auto">
              <ellipse cx="50" cy="30" rx="40" ry="20" fill="none" className="stroke-slate-800" strokeWidth="1" />
              {/* Drone Symbol */}
              <circle cx="50" cy="20" r="2" className="fill-cyan-400 animate-ping" />
              <circle cx="50" cy="20" r="1.5" className="fill-cyan-400" />
              {/* Camera sweep indicator */}
              <path d="M50,20 L30,50 L70,50 Z" fill="rgba(34,211,238,0.1)" stroke="rgba(34,211,238,0.2)" strokeWidth="0.5" />
            </svg>
            <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400 bg-slate-950/80 px-1 rounded border border-cyan-400/20">
              DRN-04: PATROL ACTIVE
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400">
              Battery: 84%
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-slate-500">Select Patrol Path</span>
            <select
              value={droneRoute}
              onChange={(e) => setDroneRoute(e.target.value)}
              className="bg-slate-950 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 border border-slate-800 outline-none w-full"
            >
              <option>Route Alpha (Fence Guard)</option>
              <option>Route Beta (Crowd Thermal Check)</option>
              <option>Route Gamma (Parking Egress Scan)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleDeployDrone}
          disabled={isDeployingDrone}
          className="mt-6 w-full py-2 px-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-semibold text-sm hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <Compass size={15} />
          {isDeployingDrone ? 'Deploying Surveillance Drones...' : 'Redeploy Drone Squad'}
        </button>
      </div>

    </div>
  );
}
