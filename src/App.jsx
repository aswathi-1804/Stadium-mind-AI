// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  LayoutGrid, Shield, HeartHandshake, Award, Building, Activity,
  UserCheck, Users, Radio, Clock, ShieldAlert, Sparkles, LogOut, Code, Presentation
} from "lucide-react";
import StadiumDigitalTwin from "./components/StadiumDigitalTwin.jsx";
import PitchDeck from "./components/PitchDeck.jsx";
import AdminDashboard from "./dashboards/AdminDashboard.jsx";
import SecurityDashboard from "./dashboards/SecurityDashboard.jsx";
import VolunteerDashboard from "./dashboards/VolunteerDashboard.jsx";
import CoachDashboard from "./dashboards/CoachDashboard.jsx";
import OrganizerDashboard from "./dashboards/OrganizerDashboard.jsx";
import MedicalDashboard from "./dashboards/MedicalDashboard.jsx";
import FanDashboard from "./dashboards/FanDashboard.jsx";

// Initial state cache to use if server cannot be reached
const LOCAL_FALLBACK_STATE = {
  users: [
    { id: 'usr-001', name: 'Director Vance', role: 'Admin', language: 'en' },
    { id: 'usr-002', name: 'Officer Cooper', role: 'Security', language: 'en' },
    { id: 'usr-003', name: 'Rahul Sharma', role: 'Volunteer', language: 'hi' },
    { id: 'usr-004', name: 'Coach Alex', role: 'Coach', language: 'en' },
    { id: 'usr-005', name: 'Organizer Sofia', role: 'Organizer', language: 'en' },
    { id: 'usr-006', name: 'Dr. Evelyn', role: 'Medical Team', language: 'en' },
    { id: 'usr-007', name: 'Carlos Gomez', role: 'Fan', language: 'es' },
  ],
  matches: [
    { id: 'm-101', home: 'Argentina', away: 'France', kickoff: '2026-07-16T18:00:00Z', venue: 'Grand Arena', status: 'Scheduled' },
    { id: 'm-102', home: 'Brazil', away: 'Germany', kickoff: '2026-07-18T20:00:00Z', venue: 'Grand Arena', status: 'Scheduled' },
    { id: 'm-103', home: 'India', away: 'Australia', kickoff: '2026-07-20T14:30:00Z', venue: 'Grand Arena', status: 'Scheduled' }
  ],
  tickets: [
    { id: 't-1001', seatId: 'Sec 12, Row F, 24', userId: 'usr-007', matchId: 'm-101', price: 120, tier: 'General' },
    { id: 't-1002', seatId: 'VIP Box A, 03', userId: 'usr-001', matchId: 'm-101', price: 500, tier: 'VIP' }
  ],
  parkingLots: [
    { id: 'lot-a', name: 'Lot A — North Stand', capacity: 300, occupied: 180, baseline: 180, rate: 30, demand: 'Medium' },
    { id: 'lot-b', name: 'Lot B — South Stand', capacity: 400, occupied: 120, baseline: 120, rate: 25, demand: 'Low' },
    { id: 'lot-c', name: 'Lot C — East Concourse', capacity: 250, occupied: 220, baseline: 220, rate: 45, demand: 'High' },
    { id: 'lot-d', name: 'Lot D — VIP Lounge', capacity: 100, occupied: 45, baseline: 45, rate: 100, demand: 'VIP-High' }
  ],
  crowdZones: [
    { id: 'zone-north', name: 'North Stand Egress', density: 42, stampedeRisk: 'Low', bottleneckScore: 0.15, flowRate: 85 },
    { id: 'zone-south', name: 'South Stand Egress', density: 38, stampedeRisk: 'Low', bottleneckScore: 0.10, flowRate: 90 },
    { id: 'zone-east', name: 'East Concourse Hub', density: 55, stampedeRisk: 'Medium', bottleneckScore: 0.45, flowRate: 60 },
    { id: 'zone-west', name: 'West Concourse Hub', density: 31, stampedeRisk: 'Low', bottleneckScore: 0.12, flowRate: 92 },
    { id: 'zone-gate', name: 'Main Entry Gates', density: 60, stampedeRisk: 'Medium', bottleneckScore: 0.58, flowRate: 50 },
    { id: 'zone-vip', name: 'VIP Lounge Entry', density: 20, stampedeRisk: 'Low', bottleneckScore: 0.05, flowRate: 98 }
  ],
  securityAlerts: [
    { id: 'sec-001', text: 'Tailgating detected at VIP Gate 2', sev: 'low', status: 'Active', staff: 'Officer Cooper', time: '15:30:10', zoneId: 'zone-vip' },
    { id: 'sec-002', text: 'Suspicious unattended duffel bag near seating Row D', sev: 'critical', status: 'Active', staff: 'Unassigned', time: '15:42:01', zoneId: 'zone-east' }
  ],
  sensors: [
    { id: 'sns-001', zoneId: 'zone-north', type: 'Camera', status: 'Online' },
    { id: 'sns-002', zoneId: 'zone-east', type: 'Crowd LiDAR', status: 'Online' },
    { id: 'sns-003', zoneId: 'zone-gate', type: 'Metal Detector', status: 'Online' },
    { id: 'sns-004', zoneId: 'zone-east', type: 'CCTV Camera 14', status: 'Online' },
    { id: 'sns-005', zoneId: 'zone-south', type: 'Camera', status: 'Online' },
    { id: 'sns-006', zoneId: 'zone-west', type: 'Camera', status: 'Offline' }
  ],
  revenue: {
    tickets: 824000,
    food: 148500,
    parking: 34200,
    merchandise: 92100,
    dynamicPricingFactor: 1.25
  },
  maintenance: [
    { id: 'maint-001', item: 'South Stand Escalator B', status: 'Functional', lastChecked: '2026-07-10', nextDue: '2026-08-10', failureRisk: 12 },
    { id: 'maint-002', item: 'East Gate Turnstile 4', status: 'Degraded', lastChecked: '2026-06-15', nextDue: '2026-07-20', failureRisk: 68 },
    { id: 'maint-003', item: 'Pitch LED Floodlight Node 8', status: 'Functional', lastChecked: '2026-07-02', nextDue: '2026-08-02', failureRisk: 5 },
    { id: 'maint-004', item: 'Concourse Area E-7 Router', status: 'Failing', lastChecked: '2026-05-18', nextDue: '2026-07-16', failureRisk: 91 }
  ],
  volunteers: [
    { id: 'vol-001', name: 'Aarav Kumar', zoneId: 'zone-gate', status: 'On-Duty', workload: 'Medium', role: 'Ticket Assister' },
    { id: 'vol-002', name: 'Srinivas Murthy', zoneId: 'zone-east', status: 'Break', workload: 'Low', role: 'Steward Guide' },
    { id: 'vol-003', name: 'Ananya Roy', zoneId: 'zone-north', status: 'On-Duty', workload: 'High', role: 'Accessibility Helper' },
    { id: 'vol-004', name: 'Deepa Rao', zoneId: 'zone-west', status: 'On-Duty', workload: 'Low', role: 'Steward Guide' }
  ],
  sustainability: {
    powerUsageKw: 1420,
    waterLitersMin: 320,
    acLoadPercent: 72,
    solarGenerationKw: 480,
    wasteKg: 1250,
    co2EmissionsKg: 580,
    gridImportKw: 940,
    smartEcoMode: true
  },
  coachStats: {
    matchStartOffset: 0,
    lineup: [
      { id: 1, name: 'Lionel Messi', number: 10, position: 'FW', fatigue: 45, injuryRisk: 15, minutesPlayed: 60, status: 'Active' },
      { id: 2, name: 'Angel Di Maria', number: 11, position: 'MF', fatigue: 78, injuryRisk: 55, minutesPlayed: 60, status: 'Active' },
      { id: 3, name: 'Enzo Fernandez', number: 24, position: 'MF', fatigue: 52, injuryRisk: 22, minutesPlayed: 60, status: 'Active' },
      { id: 4, name: 'Nicolas Otamendi', number: 19, position: 'DF', fatigue: 68, injuryRisk: 40, minutesPlayed: 60, status: 'Active' },
      { id: 5, name: 'Emiliano Martinez', number: 23, position: 'GK', fatigue: 15, injuryRisk: 5, minutesPlayed: 60, status: 'Active' },
      { id: 6, name: 'Lautaro Martinez', number: 22, position: 'FW', fatigue: 12, injuryRisk: 8, minutesPlayed: 0, status: 'Bench' },
      { id: 7, name: 'Alexis Mac Allister', number: 20, position: 'MF', fatigue: 64, injuryRisk: 30, minutesPlayed: 45, status: 'Active' },
      { id: 8, name: 'Julian Alvarez', number: 9, position: 'FW', fatigue: 69, injuryRisk: 35, minutesPlayed: 60, status: 'Active' }
    ]
  },
  aiPredictions: [
    { id: 'pred-001', module: 'Crowd Intelligence', type: 'stampede_risk', content: 'Potential bottlenecks detected at East Concourse Hub. Current density is 55% with risk of local surge.', confidence: 82, timestamp: new Date().toISOString() },
    { id: 'pred-002', module: 'Predictive Maintenance', type: 'hardware_failure', content: 'Router E-7 showing packet loss. Failure expected within 48 hours.', confidence: 91, timestamp: new Date().toISOString() }
  ],
  reports: [
    { id: 'rep-001', title: 'Stadium Pre-Match Operations Audit', type: 'operations', content: 'All perimeter fences verified. Parking lot loop sensors initialized. Emergency warning speaker systems validated successfully.', generatedAt: new Date().toISOString() }
  ],
  incidentMode: null
};

// Clock Component
function Clock24() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-mono text-sm text-slate-400 tabular-nums">
      {now.toLocaleTimeString([], { hour12: false })}
    </span>
  );
}

const ROLES = [
  { id: 'Admin', label: 'Admin Ops', icon: LayoutGrid, desc: 'Central Control Center & Drone Feeds' },
  { id: 'Security', label: 'Security', icon: Shield, desc: 'CCTV Matrix & Threat Dispatch' },
  { id: 'Volunteer', label: 'Volunteers', icon: UserCheck, desc: 'Tasks & Accessibility Ramps' },
  { id: 'Coach', label: 'Coach Assist', icon: Activity, desc: 'Player Fatigue & Substitution Math' },
  { id: 'Organizer', label: 'Tournament Dir', icon: Building, desc: 'Fixtures & Pricing & Green Power' },
  { id: 'Medical Team', label: 'Medical EMT', icon: HeartHandshake, desc: 'Field Rescue & Crowd Vitals' },
  { id: 'Fan', label: 'Fan Experience', icon: Users, desc: 'Seat Locator & Gemini chat' }
];

export default function App() {
  const [role, setRole] = useState('Admin');
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'pitch'
  const [state, setState] = useState(LOCAL_FALLBACK_STATE);
  const [serverOnline, setServerOnline] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  
  // Chatbot history (cached per session)
  const [chatHistory, setChatHistory] = useState([
    { from: 'ai', text: "Welcome to StadiumMind AI Assistant. How can I help you find your seat, locate parking, or view wait times?" }
  ]);

  // Sync state from server on interval
  const syncState = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
        setServerOnline(true);
      } else {
        setServerOnline(false);
      }
    } catch (err) {
      setServerOnline(false);
      // Run local client-side drift simulation to keep the UI alive if server is offline
      runClientSideDrift();
    }
  };

  useEffect(() => {
    syncState();
    const interval = setInterval(syncState, 4000);
    return () => clearInterval(interval);
  }, []);

  // Client-side drift simulation fallback
  const runClientSideDrift = () => {
    setState(prev => {
      if (prev.incidentMode) return prev; // Hold states if incident active

      const nextCrowd = prev.crowdZones.map(z => {
        const drift = Math.round((Math.random() - 0.5) * 4);
        const density = Math.min(95, Math.max(10, z.density + drift));
        return {
          ...z,
          density,
          bottleneckScore: density / 100,
          stampedeRisk: density >= 85 ? 'Critical' : density >= 60 ? 'High' : density >= 45 ? 'Medium' : 'Low'
        };
      });

      const nextParking = prev.parkingLots.map(l => {
        const drift = Math.round((Math.random() - 0.5) * 3);
        const occupied = Math.min(l.capacity, Math.max(0, l.occupied + drift));
        return { ...l, occupied, demand: (occupied / l.capacity) > 0.8 ? 'High' : 'Medium' };
      });

      const nextPower = Math.round(1350 + Math.random() * 100);

      const nextLineup = prev.coachStats.lineup.map(p => {
        if (p.status === 'Active') {
          const fatigue = Math.min(100, p.fatigue + (Math.random() > 0.45 ? 1 : 0));
          return { ...p, fatigue, minutesPlayed: p.minutesPlayed + (Math.random() > 0.6 ? 1 : 0) };
        }
        return p;
      });

      return {
        ...prev,
        crowdZones: nextCrowd,
        parkingLots: nextParking,
        sustainability: {
          ...prev.sustainability,
          powerUsageKw: nextPower,
          gridImportKw: Math.max(0, nextPower - prev.sustainability.solarGenerationKw)
        },
        coachStats: {
          ...prev.coachStats,
          lineup: nextLineup
        }
      };
    });
  };

  // Server API call wrappers with local fallbacks
  const triggerIncident = async (mode) => {
    if (serverOnline) {
      try {
        await fetch('http://localhost:5000/api/incident', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode })
        });
        syncState();
      } catch (err) {
        console.error(err);
      }
    } else {
      // Local implementation of incident
      setState(prev => {
        const time = new Date().toLocaleTimeString([], { hour12: false });
        const nextAlerts = [
          { id: `sec-local-${Date.now()}`, text: `Local Fallback Trigger: ${mode.replace('_', ' ').toUpperCase()} simulated`, sev: 'critical', status: 'Active', staff: 'All Officers', time, zoneId: 'zone-east' },
          ...prev.securityAlerts
        ];
        
        let nextCrowd = [...prev.crowdZones];
        if (mode === 'stampede_risk') {
          nextCrowd = prev.crowdZones.map(z => z.id === 'zone-east' ? { ...z, density: 95, stampedeRisk: 'Critical' } : z);
        }

        return {
          ...prev,
          incidentMode: mode,
          securityAlerts: nextAlerts,
          crowdZones: nextCrowd
        };
      });
    }
  };

  const resetIncident = async () => {
    if (serverOnline) {
      try {
        await fetch('http://localhost:5000/api/incident/reset', { method: 'POST' });
        syncState();
      } catch (err) {
        console.error(err);
      }
    } else {
      setState(prev => ({
        ...prev,
        incidentMode: null,
        securityAlerts: prev.securityAlerts.filter(a => !a.id.toString().includes('local')),
        crowdZones: prev.crowdZones.map(z => z.id === 'zone-east' ? { ...z, density: 55, stampedeRisk: 'Medium' } : z)
      }));
    }
  };

  const handleAcknowledgeAlert = async (id) => {
    if (serverOnline) {
      try {
        await fetch(`http://localhost:5000/api/data/securityAlerts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Resolved' })
        });
        syncState();
      } catch (err) {
        console.error(err);
      }
    } else {
      setState(prev => ({
        ...prev,
        securityAlerts: prev.securityAlerts.filter(a => a.id !== id)
      }));
    }
  };

  const handleSubstitute = async (subOutId, subInId) => {
    if (serverOnline) {
      try {
        await fetch('http://localhost:5000/api/match-ops/substitute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subOutId, subInId })
        });
        syncState();
      } catch (err) {
        console.error(err);
      }
    } else {
      setState(prev => {
        const nextLineup = prev.coachStats.lineup.map(p => {
          if (p.id === Number(subOutId)) return { ...p, status: 'Bench' };
          if (p.id === Number(subInId)) return { ...p, status: 'Active', minutesPlayed: 1 };
          return p;
        });
        return {
          ...prev,
          coachStats: { ...prev.coachStats, lineup: nextLineup }
        };
      });
    }
  };

  const handleGenerateFixtures = async (teams) => {
    if (serverOnline) {
      try {
        await fetch('http://localhost:5000/api/tournament/fixtures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teams })
        });
        syncState();
      } catch (err) {
        console.error(err);
      }
    } else {
      const generated = teams.slice(0, 3).map((t, idx) => ({
        id: `m-gen-${idx}`,
        home: t,
        away: teams[idx + 1] || 'Qualifier',
        kickoff: new Date().toISOString(),
        venue: 'Grand Arena',
        status: 'Scheduled'
      }));
      setState(prev => ({ ...prev, matches: [...generated, ...prev.matches] }));
    }
  };

  const handleUpdatePricing = async (multiplier) => {
    if (serverOnline) {
      try {
        await fetch('http://localhost:5000/api/revenue/dynamic-pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ multiplier })
        });
        syncState();
      } catch (err) {
        console.error(err);
      }
    } else {
      setState(prev => ({ ...prev, revenue: { ...prev.revenue, dynamicPricingFactor: multiplier } }));
    }
  };

  const handleAssignVolunteer = async (volunteerId, zoneId) => {
    if (serverOnline) {
      try {
        await fetch('http://localhost:5000/api/volunteers/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ volunteerId, zoneId })
        });
        syncState();
      } catch (err) {
        console.error(err);
      }
    } else {
      setState(prev => {
        const nextVols = prev.volunteers.map(v => v.id === volunteerId ? { ...v, zoneId } : v);
        return { ...prev, volunteers: nextVols };
      });
    }
  };

  const handleToggleEcoMode = () => {
    setState(prev => ({
      ...prev,
      sustainability: { ...prev.sustainability, smartEcoMode: !prev.sustainability.smartEcoMode }
    }));
  };

  const handleDecisionExecute = (actionType, targetId) => {
    if (actionType === 'crowd_reroute') {
      alert(`AI Autonomous Decision Engine: Evacuation signage and volunteer guidance deployed for zone: ${targetId}. Density flow will drop shortly.`);
    } else if (actionType === 'parking_reroute') {
      alert("AI Autonomous Decision Engine: Roadside digital banners updated. Arriving vehicles redirected to South Stand Lot B.");
    } else if (actionType === 'dispatch_maint') {
      alert(`AI Autonomous Decision Engine: Scheduled inspection check dispatched for maintenance ticket ${targetId}.`);
    }
  };

  const handleChat = async (prompt, chatRole, context) => {
    if (serverOnline) {
      try {
        const res = await fetch('http://localhost:5000/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, role: chatRole, context })
        });
        const data = await res.json();
        return data.reply;
      } catch (err) {
        console.error(err);
        return "Operational network error contacting Gemini AI server. Standard advice applies.";
      }
    } else {
      // client side fallback
      return new Promise((resolve) => {
        setTimeout(() => {
          const q = prompt.toLowerCase();
          if (q.includes('seat')) resolve("Your seat is in Section 12, Row F, Seat 24. Nearest entry Gate 3.");
          if (q.includes('food')) resolve("Grill Corner is 30m away, average waiting time: 3 minutes.");
          if (q.includes('parking')) resolve("Your vehicle is in Lot B, Row 4. Direct pathways are marked with blue signboards.");
          resolve("I am StadiumMind AI assistant. Ask me about routes, seating, food stands, or emergency evacuations.");
        }, 400);
      });
    }
  };

  // Helper calculation for overall health status pill
  const getOverallStatus = () => {
    if (state.incidentMode) return 'critical';
    const highCrowd = state.crowdZones.some(z => z.density >= 75);
    const failingMaint = state.maintenance.some(m => m.status === 'Failing' || m.status === 'Failed');
    if (highCrowd || failingMaint) return 'caution';
    return 'nominal';
  };

  const statusTexts = {
    nominal: 'SYSTEMS ONLINE (100%)',
    caution: 'CAUTION: CONGESTION REPORTED',
    critical: 'CRITICAL EMERGENCY OVERRIDE'
  };

  const statusPills = {
    nominal: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    caution: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    critical: 'bg-rose-500/15 border-rose-500/30 text-rose-500 animate-pulse'
  };

  const overallStatus = getOverallStatus();
  const safestZone = state.crowdZones.reduce((a, b) => (b.density < a.density ? b : a), state.crowdZones[0]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 p-4 sm:p-6 flex flex-col justify-between">
      
      {/* 1. Header Banner */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            {/* Pulsing Radar Ring */}
            <div className="relative h-11 w-11 shrink-0">
              <span className="sm-ring absolute inset-0 rounded-full border border-cyan-400/60" />
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 bg-slate-950 flex items-center justify-center overflow-hidden">
                <div className="sm-sweep absolute inset-0 origin-center" style={{ background: "conic-gradient(from 0deg, rgba(34,211,238,0.55), transparent 70%)" }} />
                <div className="relative h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-100">STADIUMMIND<span className="text-cyan-400 font-extrabold"> AI</span></h1>
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 border border-slate-800 rounded px-1.5 py-0.5">PromptWars Virtual</span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Challenge 4: Smart Stadiums & Tournament Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Server Online Status Indicator */}
            <span className={`text-[10px] font-mono border rounded px-2 py-0.5 ${serverOnline ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-950 border-slate-850 text-slate-600'}`}>
              {serverOnline ? 'CLOUDLINK: SECURE' : 'CLOUDLINK: OFFLINE (LOCAL SIM)'}
            </span>
            
            {/* Status Pill */}
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider ${statusPills[overallStatus]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${overallStatus === 'critical' ? 'bg-rose-500' : overallStatus === 'caution' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              {statusTexts[overallStatus]}
            </span>

            <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
              <Clock size={13} />
              <Clock24 />
            </div>
          </div>
        </div>

        {/* 2. Top-level View Selector (Dashboard vs Pitch Deck) */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                viewMode === 'dashboard'
                  ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-900/10'
                  : 'border-slate-850 bg-slate-950/20 text-slate-400 hover:border-slate-800 hover:text-slate-200'
              }`}
            >
              <LayoutGrid size={13} /> STADIUM PLATFORM
            </button>
            <button
              onClick={() => setViewMode('pitch')}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                viewMode === 'pitch'
                  ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-900/10'
                  : 'border-slate-850 bg-slate-950/20 text-slate-400 hover:border-slate-800 hover:text-slate-200'
              }`}
            >
              <Presentation size={13} /> JUDGE PITCH SLIDES
            </button>
          </div>

          {viewMode === 'dashboard' && (
            <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-850 rounded-xl px-2 py-1 max-w-[280px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1">Identity:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-900 text-slate-200 text-xs rounded border border-slate-800 px-2 py-1 outline-none flex-1 font-semibold"
              >
                {ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.label} Profile</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Split-Screen Panel Layout */}
      <div className="flex-1 mb-6">
        {viewMode === 'pitch' ? (
          <PitchDeck
            currentRole={role}
            onSwitchRole={(r) => { setRole(r); setViewMode('dashboard'); }}
            onTriggerIncident={triggerIncident}
            onResetIncident={resetIncident}
            onSendFanMessage={(msg) => {
              setRole('Fan');
              setViewMode('dashboard');
              setChatHistory(prev => [...prev, { from: 'user', text: msg }]);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            
            {/* Left Hand: Renders active dashboard based on selector role */}
            <div className="xl:col-span-2 flex flex-col justify-between">
              {role === 'Admin' && (
                <AdminDashboard
                  state={state}
                  onTriggerIncident={triggerIncident}
                  onResetIncident={resetIncident}
                  onActionExecute={handleDecisionExecute}
                />
              )}
              {role === 'Security' && (
                <SecurityDashboard
                  state={state}
                  onAcknowledgeAlert={handleAcknowledgeAlert}
                />
              )}
              {role === 'Volunteer' && (
                <VolunteerDashboard
                  state={state}
                  onAssignVolunteerZone={handleAssignVolunteer}
                />
              )}
              {role === 'Coach' && (
                <CoachDashboard
                  state={state}
                  onSubstitute={handleSubstitute}
                />
              )}
              {role === 'Organizer' && (
                <OrganizerDashboard
                  state={state}
                  onGenerateFixtures={handleGenerateFixtures}
                  onUpdateDynamicPricing={handleUpdatePricing}
                  onToggleEcoMode={handleToggleEcoMode}
                />
              )}
              {role === 'Medical Team' && (
                <MedicalDashboard
                  state={state}
                  onActionExecute={handleDecisionExecute}
                />
              )}
              {role === 'Fan' && (
                <FanDashboard
                  state={state}
                  onChat={handleChat}
                  chatHistory={chatHistory}
                  setChatHistory={setChatHistory}
                />
              )}
            </div>

            {/* Right Hand: Stadium Digital Twin Map Overlay */}
            <div className="h-full">
              <StadiumDigitalTwin
                zones={state.crowdZones}
                sensors={state.sensors}
                maintenance={state.maintenance}
                incidentMode={state.incidentMode}
                safestZoneName={safestZone?.name}
                onSelectZone={(zone) => setSelectedZone(zone)}
              />
            </div>

          </div>
        )}
      </div>

      {/* 4. Footer credits */}
      <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-600 gap-2">
        <span>StadiumMind AI Dashboard • PromptWars Challenge 4 Entry • Version 1.0.0</span>
        <div className="flex gap-4">
          <a href="#docs" className="hover:text-slate-400">Architecture Diagram</a>
          <a href="#readme" className="hover:text-slate-400">Database Schema</a>
          <a href="#roadmap" className="hover:text-slate-400">Future Roadmap</a>
        </div>
      </div>

    </div>
  );
}
