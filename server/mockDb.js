// server/mockDb.js
import fs from 'fs';
import path from 'path';

// Memory cache of our database state
const db = {
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
    { id: 'm-101', home: 'Argentina', away: 'France', kickoff: '2026-07-16T18:00:00Z', venue: 'Grand Arena', status: 'Scheduled', attendance: 0, revenue: 0 },
    { id: 'm-102', home: 'Brazil', away: 'Germany', kickoff: '2026-07-18T20:00:00Z', venue: 'Grand Arena', status: 'Scheduled', attendance: 0, revenue: 0 },
    { id: 'm-103', home: 'India', away: 'Australia', kickoff: '2026-07-20T14:30:00Z', venue: 'Grand Arena', status: 'Scheduled', attendance: 0, revenue: 0 }
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

// Simulated drift that ticks in the background to make the dashboard alive
export function runSimulationTick() {
  if (db.incidentMode) {
    if (db.incidentMode === 'power_failure') {
      db.sustainability.powerUsageKw = Math.round(150 + Math.random() * 50);
      db.sustainability.solarGenerationKw = 0;
      db.sustainability.gridImportKw = 0;
      db.sustainability.acLoadPercent = 10;
      db.sensors[5].status = 'Offline';
      db.sensors[1].status = 'Offline';
      db.maintenance[3].failureRisk = 99;
      db.maintenance[3].status = 'Failed';
    } else if (db.incidentMode === 'stampede_risk') {
      db.crowdZones[2].density = Math.min(99, db.crowdZones[2].density + 4);
      db.crowdZones[4].density = Math.min(99, db.crowdZones[4].density + 3);
      db.crowdZones[2].stampedeRisk = 'Critical';
      db.crowdZones[4].stampedeRisk = 'Critical';
      db.crowdZones[2].bottleneckScore = 0.94;
      db.crowdZones[4].bottleneckScore = 0.96;
    } else if (db.incidentMode === 'fire_hazard') {
      db.crowdZones[0].density = Math.min(99, db.crowdZones[0].density + 5);
      db.crowdZones[0].bottleneckScore = 0.90;
    }
    return;
  }

  db.crowdZones.forEach(z => {
    const drift = Math.round((Math.random() - 0.5) * 4);
    z.density = Math.min(95, Math.max(10, z.density + drift));
    z.bottleneckScore = Math.min(0.99, Math.max(0.01, z.density / 100 + (Math.random() - 0.5) * 0.1));
    z.stampedeRisk = z.density >= 85 ? 'Critical' : z.density >= 60 ? 'High' : z.density >= 45 ? 'Medium' : 'Low';
  });

  db.parkingLots.forEach(l => {
    const drift = Math.round((Math.random() - 0.5) * 3);
    l.occupied = Math.min(l.capacity, Math.max(0, l.occupied + drift));
    const ratio = l.occupied / l.capacity;
    l.demand = ratio > 0.85 ? 'High' : ratio > 0.6 ? 'Medium' : 'Low';
  });

  db.sustainability.powerUsageKw = Math.round(1350 + Math.random() * 100);
  db.sustainability.gridImportKw = Math.max(0, db.sustainability.powerUsageKw - db.sustainability.solarGenerationKw);
  db.sustainability.solarGenerationKw = Math.round(400 + Math.random() * 100);
  db.sustainability.waterLitersMin = Math.round(300 + Math.random() * 50);

  db.maintenance.forEach(m => {
    if (m.status !== 'Failed') {
      m.failureRisk = Math.min(100, Math.max(0, m.failureRisk + (Math.random() > 0.7 ? 1 : 0)));
      if (m.failureRisk > 90) m.status = 'Failing';
    }
  });

  db.coachStats.lineup.forEach(p => {
    if (p.status === 'Active') {
      p.fatigue = Math.min(100, p.fatigue + (Math.random() > 0.4 ? 1 : 0));
      p.minutesPlayed += (Math.random() > 0.5 ? 1 : 0);
      p.injuryRisk = Math.min(100, Math.round(p.fatigue * 0.6 + p.minutesPlayed * 0.2));
    }
  });
}

// Tick every 5 seconds
setInterval(runSimulationTick, 5000);

export function getData(collection) {
  return db[collection];
}

export function updateData(collection, finder, updates) {
  if (Array.isArray(db[collection])) {
    const idx = db[collection].findIndex(item => finder(item));
    if (idx !== -1) {
      db[collection][idx] = { ...db[collection][idx], ...updates };
      return db[collection][idx];
    }
  } else {
    db[collection] = { ...db[collection], ...updates };
    return db[collection];
  }
  return null;
}

export function insertData(collection, item) {
  if (Array.isArray(db[collection])) {
    const id = item.id || `${collection.slice(0, 3)}-${Math.round(Math.random() * 100000)}`;
    const newItem = { id, ...item };
    db[collection].unshift(newItem);
    return newItem;
  }
  return null;
}

export function getIncidentMode() {
  return db.incidentMode;
}

export function setIncidentMode(mode) {
  db.incidentMode = mode;
  if (!mode) {
    db.crowdZones[2].density = 55;
    db.crowdZones[2].stampedeRisk = 'Medium';
    db.crowdZones[2].bottleneckScore = 0.45;
    db.crowdZones[4].density = 60;
    db.crowdZones[4].stampedeRisk = 'Medium';
    db.crowdZones[4].bottleneckScore = 0.58;
    db.sensors.forEach(s => s.status = 'Online');
    db.maintenance[3].status = 'Failing';
    db.maintenance[3].failureRisk = 91;
  } else {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    if (mode === 'power_failure') {
      insertData('securityAlerts', {
        text: 'Total Power Grid Failure simulated — Command Center running on backups',
        sev: 'critical',
        status: 'Active',
        staff: 'All Officers',
        time,
        zoneId: 'zone-north'
      });
    } else if (mode === 'stampede_risk') {
      insertData('securityAlerts', {
        text: 'Extreme crowd pressure detected at Gate 3 and East Concourse',
        sev: 'critical',
        status: 'Active',
        staff: 'Stewards Dispatched',
        time,
        zoneId: 'zone-east'
      });
    } else if (mode === 'fire_hazard') {
      insertData('securityAlerts', {
        text: 'Smoke sensor smoke alert — West Corridor Utility Shaft',
        sev: 'critical',
        status: 'Active',
        staff: 'Medical & Security Dispatched',
        time,
        zoneId: 'zone-west'
      });
    }
  }
}
