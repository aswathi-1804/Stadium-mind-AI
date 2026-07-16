// src/dashboards/FanDashboard.jsx
import React, { useState } from 'react';
import { Compass, Ticket, Car, ShoppingBag, Eye, RefreshCw, Languages, HelpCircle } from 'lucide-react';
import AiAssistant from '../components/AiAssistant.jsx';

export default function FanDashboard({
  state = {},
  onChat = () => {},
  chatHistory = [],
  setChatHistory = () => {}
}) {
  const { parkingLots = [], crowdZones = [] } = state;
  const [accessibleMode, setAccessibleMode] = useState(false);

  // Offers
  const offers = [
    { code: 'MIND20', title: '20% Off Match Day Scarf', desc: 'Redeemable at East Stand merchandise stall.' },
    { code: 'BURGER50', title: '$5 Burger Discount', desc: 'Redeemable at Grill Corner only.' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. My Match Ticket & Seat Directions */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Match Day Pass</span>
          <h3 className="text-slate-100 font-semibold text-base mb-4">My Virtual Seat Guide</h3>

          <div className="p-4 rounded-xl border border-dashed border-cyan-500/30 bg-slate-950/60 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 block tracking-wider font-bold">MATCH TICKETS</span>
                <span className="font-semibold text-sm text-slate-200">Argentina vs France</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-semibold">GENERAL TIER</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-900 pt-3 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">SEAT CODE</span>
                <span className="text-slate-300">Sec 12, Row F, Seat 24</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">RECOMMENDED ENTRY</span>
                <span className="text-slate-300">Gate 3 (North-West)</span>
              </div>
            </div>
          </div>

          {/* Seat Directions List */}
          <div className="mt-4 space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Interactive Navigation</span>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/20 text-xs text-slate-300 space-y-1.5 font-mono">
              <p>1. Enter via <strong>Gate 3 Turnstile</strong>.</p>
              <p>2. {accessibleMode ? 'Take the main accessibility ramp on the left.' : 'Head up the concourse escalator towards Sector 12.'}</p>
              <p>3. Row F is the 6th row from the pitch corridor entrance.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5"><Compass size={12} className="text-cyan-400" /> Accessible Route</span>
          <button
            onClick={() => setAccessibleMode(!accessibleMode)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono border transition-all ${
              accessibleMode
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-slate-950 border-slate-850 text-slate-500'
            }`}
          >
            {accessibleMode ? 'ACTIVE (RAMPS & ESCORTS)' : 'STANDARD'}
          </button>
        </div>
      </div>

      {/* 2. Interactive Logistics, Wait Times & Wallet */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Concession waiting times</span>
          <h3 className="text-slate-100 font-semibold text-base mb-3">Concessions & Parking Wallet</h3>

          {/* Parking lot details */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 font-mono text-[11px] mb-4">
            <span className="text-[10px] text-slate-500 block mb-1">MY VEHICLE LOCKER</span>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1"><Car size={13} className="text-cyan-400" /> Parking Lot B (Row 4)</span>
              <span className="text-emerald-400">Assigned</span>
            </div>
          </div>

          {/* Wait times list */}
          <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">Concession wait times</span>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/20 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">Grill Corner (East Hub)</span>
              <span className="text-emerald-400 font-semibold">3 mins wait</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/20 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">Taco Stand (North Stand)</span>
              <span className="text-amber-400 font-semibold">12 mins wait</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/20 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">Drink Hub (West Stand)</span>
              <span className="text-emerald-400 font-semibold">5 mins wait</span>
            </div>
          </div>
        </div>

        {/* Dynamic merch offers */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">Personal Merchandise Offers</span>
          {offers.map((off, idx) => (
            <div key={idx} className="p-2 rounded border border-slate-800 bg-slate-950/40 flex justify-between items-center text-[10px] font-mono">
              <div>
                <p className="font-semibold text-slate-300">{off.title}</p>
                <p className="text-slate-500 mt-0.5">{off.desc}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 text-[9px] font-bold">
                {off.code}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Gemini Fan assistant chat overlay */}
      <div className="flex flex-col h-full">
        <AiAssistant
          role="Fan"
          onChat={onChat}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
        />
      </div>

    </div>
  );
}
