// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  getData,
  updateData,
  insertData,
  getIncidentMode,
  setIncidentMode,
  runSimulationTick
} from './mockDb.js';
import { askGemini } from './services/geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Fetch entire system state (all collections combined for dashboard sync)
app.get('/api/state', (req, res) => {
  res.json({
    users: getData('users'),
    matches: getData('matches'),
    tickets: getData('tickets'),
    parkingLots: getData('parkingLots'),
    crowdZones: getData('crowdZones'),
    securityAlerts: getData('securityAlerts'),
    sensors: getData('sensors'),
    revenue: getData('revenue'),
    maintenance: getData('maintenance'),
    volunteers: getData('volunteers'),
    sustainability: getData('sustainability'),
    coachStats: getData('coachStats'),
    aiPredictions: getData('aiPredictions'),
    reports: getData('reports'),
    incidentMode: getIncidentMode()
  });
});

// 2. Incident Simulator triggers
app.post('/api/incident', (req, res) => {
  const { mode } = req.body;
  if (!['power_failure', 'stampede_risk', 'fire_hazard'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid incident mode' });
  }
  setIncidentMode(mode);
  runSimulationTick(); // trigger direct state change
  res.json({ success: true, mode, alerts: getData('securityAlerts') });
});

app.post('/api/incident/reset', (req, res) => {
  setIncidentMode(null);
  runSimulationTick();
  res.json({ success: true, mode: null });
});

// 3. Gemini Prompt Router
app.post('/api/gemini/chat', async (req, res) => {
  const { prompt, role, context } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    const reply = await askGemini(prompt, role, context);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CRUD operations for general Firestore simulation
app.get('/api/data/:collection', (req, res) => {
  const data = getData(req.params.collection);
  if (!data) return res.status(404).json({ error: 'Collection not found' });
  res.json(data);
});

app.post('/api/data/:collection', (req, res) => {
  const item = insertData(req.params.collection, req.body);
  if (!item) return res.status(404).json({ error: 'Collection not found / failed to insert' });
  res.json(item);
});

app.put('/api/data/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const item = updateData(collection, (x) => x.id === id, req.body);
  if (!item) return res.status(404).json({ error: 'Item not found in collection' });
  res.json(item);
});

// 5. Module-specific REST operations
// AI Match Operations - Substitution coordinate
app.post('/api/match-ops/substitute', (req, res) => {
  const { subOutId, subInId } = req.body;
  const lineup = getData('coachStats').lineup;

  const playerOut = lineup.find(p => p.id === Number(subOutId));
  const playerIn = lineup.find(p => p.id === Number(subInId));

  if (!playerOut || !playerIn) {
    return res.status(404).json({ error: 'Players not found' });
  }

  // Swap statuses
  updateData('coachStats', () => true, {
    lineup: lineup.map(p => {
      if (p.id === playerOut.id) return { ...p, status: 'Bench', fatigue: Math.min(100, p.fatigue + 5) };
      if (p.id === playerIn.id) return { ...p, status: 'Active', minutesPlayed: 1 };
      return p;
    })
  });

  // Inject a match log alert
  const time = new Date().toLocaleTimeString([], { hour12: false });
  insertData('securityAlerts', {
    text: `Match Ops Substitution: ${playerIn.name} replaced ${playerOut.name}`,
    sev: 'low',
    status: 'Resolved',
    staff: 'Match Commissioner',
    time,
    zoneId: 'zone-vip'
  });

  res.json({ success: true, lineup: getData('coachStats').lineup });
});

// AI Tournament Planner - Dynamic Fixture Generation
app.post('/api/tournament/fixtures', (req, res) => {
  const { teams } = req.body;
  if (!teams || teams.length < 2) {
    return res.status(400).json({ error: 'Provide at least two teams' });
  }

  // Generate round-robin or quick bracket fixtures
  const fixtures = [];
  const startDay = new Date();
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const matchDay = new Date(startDay);
      matchDay.setDate(startDay.getDate() + fixtures.length + 1);
      fixtures.push({
        id: `m-gen-${fixtures.length + 1}`,
        home: teams[i],
        away: teams[j],
        kickoff: matchDay.toISOString(),
        venue: 'Grand Arena Stadium',
        status: 'Scheduled'
      });
    }
  }

  // Write new matches into match database
  fixtures.forEach(f => insertData('matches', f));
  res.json({ success: true, fixtures });
});

// AI Revenue Optimization - Toggle dynamic pricing multiplier
app.post('/api/revenue/dynamic-pricing', (req, res) => {
  const { multiplier } = req.body;
  updateData('revenue', () => true, { dynamicPricingFactor: Number(multiplier) });
  res.json({ success: true, revenue: getData('revenue') });
});

// AI Volunteer Assignment
app.post('/api/volunteers/assign', (req, res) => {
  const { volunteerId, zoneId } = req.body;
  const vol = updateData('volunteers', (x) => x.id === volunteerId, { zoneId, status: 'On-Duty' });
  if (!vol) return res.status(404).json({ error: 'Volunteer not found' });
  res.json({ success: true, volunteer: vol });
});

app.listen(PORT, () => {
  console.log(`StadiumMind AI backend running on http://localhost:${PORT}`);
});
