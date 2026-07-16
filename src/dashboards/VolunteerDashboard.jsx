// src/dashboards/VolunteerDashboard.jsx
import React, { useState } from 'react';
import { UserCheck, Calendar, MapPin, CheckSquare, HeartHandshake, AlertCircle } from 'lucide-react';

export default function VolunteerDashboard({
  state = {},
  onAssignVolunteerZone = () => {}
}) {
  const { volunteers = [], crowdZones = [] } = state;
  const myVolunteerId = 'vol-001'; // Simulated logged-in volunteer (Aarav Kumar)
  const currentVol = volunteers.find(v => v.id === myVolunteerId) || {
    name: 'Aarav Kumar',
    zoneId: 'zone-gate',
    status: 'On-Duty',
    workload: 'Medium',
    role: 'Ticket Assister'
  };

  const currentZone = crowdZones.find(z => z.id === currentVol.zoneId) || { name: 'Main Entry Gates' };

  // Accessibility Tasks
  const [accessTasks, setAccessTasks] = useState([
    { id: 1, fanName: 'Mrs. Evelyn Stone (Age 78)', type: 'Wheelchair guidance', gate: 'Gate 3', status: 'Pending' },
    { id: 2, fanName: 'John Miller (Visually impaired)', type: 'Audio Navigation setup', gate: 'Gate 1 VIP', status: 'Pending' }
  ]);

  const [generalTasks, setGeneralTasks] = useState([
    { id: 101, text: 'Verify barcode scanner 4 alignment', done: true },
    { id: 102, text: 'Distribute tournament booklet handouts at Gate 3', done: false },
    { id: 103, text: 'Sanity check disabled seating access ramp B', done: false }
  ]);

  const toggleTask = (id) => {
    setGeneralTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const resolveAccessTask = (id) => {
    setAccessTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
  };

  const handleZoneChange = (e) => {
    onAssignVolunteerZone(myVolunteerId, e.target.value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Shift & Roster Details */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Staff Portal</span>
          <h3 className="text-slate-100 font-semibold text-base mb-4">Shift & Roster Details</h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-mono font-bold">
                  AK
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{currentVol.name}</h4>
                  <p className="text-[10px] font-mono text-slate-400">{currentVol.role}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-slate-900 pt-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">ASSIGNED STATIONS</span>
                  <span className="text-slate-300 flex items-center gap-1 mt-0.5"><MapPin size={11} className="text-cyan-400" /> {currentZone.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">WORKLOAD INDEX</span>
                  <span className={`font-semibold ${currentVol.workload === 'High' ? 'text-rose-400' : 'text-emerald-400'}`}>{currentVol.workload}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase text-slate-500">Request Station Transfer</span>
              <select
                value={currentVol.zoneId}
                onChange={handleZoneChange}
                className="bg-slate-950 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 border border-slate-800 outline-none w-full"
              >
                {crowdZones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <Calendar size={12} className="text-cyan-400" />
          Shift ends in 2 hours 15 minutes.
        </div>
      </div>

      {/* 2. Tasks & Checklist */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col">
        <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Operational Checklist</span>
        <h3 className="text-slate-100 font-semibold text-base mb-3">Steward Task List</h3>

        <div className="space-y-2.5 flex-1 max-h-[300px] overflow-y-auto pr-1">
          {generalTasks.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="p-3 rounded-xl border border-slate-800 bg-slate-950/20 hover:border-slate-700/40 transition-colors flex items-center justify-between gap-3 cursor-pointer"
            >
              <span className={`text-xs ${task.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{task.text}</span>
              <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center ${task.done ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-slate-700 text-transparent'}`}>
                <CheckSquare size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Accessibility Assistant requests */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500">Accessibility Assistant</span>
          <h3 className="text-slate-100 font-semibold text-base mb-3">Assistance Requests</h3>

          <div className="space-y-3">
            {accessTasks.map(task => (
              <div key={task.id} className={`p-3 rounded-xl border ${task.status === 'Completed' ? 'border-emerald-500/20 bg-emerald-500/5 opacity-60' : 'border-rose-500/20 bg-rose-500/5'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{task.fanName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{task.type} | Gate: {task.gate}</p>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-1 rounded ${task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {task.status}
                  </span>
                </div>
                {task.status !== 'Completed' && (
                  <button
                    onClick={() => resolveAccessTask(task.id)}
                    className="mt-3 w-full py-1 text-center rounded bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-semibold hover:bg-rose-500/30"
                  >
                    Provide Assistance Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
          <HeartHandshake size={12} className="text-cyan-400" />
          Supports Voice navigation + Accessible pathways.
        </div>
      </div>

    </div>
  );
}
