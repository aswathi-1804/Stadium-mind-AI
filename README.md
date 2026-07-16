# StadiumMind AI 🏟️🤖
### The Autonomous AI-powered Operating System for Smart Stadiums & Tournament Operations
**Built for the Google Build with AI Hackathon**

---

## 🚀 The Vision
Every large-scale tournament (FIFA World Cup, Olympics, IPL, ICC Cricket World Cup) runs on a dozens of **disconnected, legacy systems** — ticketing gates, parking loops, CCTV security grids, HVAC meters, and field medic dispatches. When something goes wrong, stadium operations remain strictly reactive. 

**StadiumMind AI is a single unified AI brain** that connects every stadium system through a shared event-driven Pub/Sub bus. It monitors operations, predicts stampede risks, schedules staff, optimizes energy import, dynamically prices tickets, and mitigates emergencies autonomously with a human-in-the-loop validation console.

---

## 🌟 Key Features & Platforms

1. **AI Command Center (Digital Twin)**: A beautiful split-screen dashboard displaying a 2.5D vector map overlays of crowd heatmaps, lighting networks, and IoT sensor health.
2. **7 Role-Based User Dashboards**: Custom interfaces tailored to specific stadium operations profiles:
   - **Admin Profile**: Crisis overrides, autonomous decision panels, and drone patrols.
   - **Security Profile**: Multi-channel CCTV anomaly scans and responder alerts.
   - **Volunteer Profile**: Station transfers, steward checklist, and accessibility dispatches.
   - **Coach Profile**: Roster biometrics telemetry, fatigue tracking, and substitution recommendation engines.
   - **Organizer Profile**: Fixture bracket generators, Eco-mode power charts, and dynamic ticket surges.
   - **Medical Team Profile**: Incident response triage lists and crowd egress flow telemetry.
   - **Fan Profile**: Multilingual assistant chat, parking pass wallet, and accessible navigation mode.
3. **Google Gemini Integration**: Dynamic chatbot guidance, natural language translation, biometric injury reviews, and dynamic price advice.
4. **Built-in Presentation & Pitch Deck**: A slide deck and interactive live demo walkthrough engine coded directly inside the web UI for hackathon judges!

---

## 🛠️ Technology Stack
- **Frontend Core**: React 18, Tailwind CSS, Lucide Icons, Recharts (Responsive & Mobile-first).
- **Backend Service**: Node.js + Express.js API, dotenv.
- **AI Reasoning**: Gemini 1.5 API via `@google/generative-ai` SDK.
- **Persistence (Firestore Dual-Mode)**: Set up to read/write live to Firestore if credentials are provided, falling back seamlessly to an in-memory database file (`server/mockDb.js`) if offline.

---

## 📂 Project Structure
```
stadiummind-ai/
├── docs/
│   ├── ARCHITECTURE.md     # 5 Mermaid Diagrams: Topologies, Schematics, Use Cases
│   └── PITCH.md            # Pitch guidelines & LinkedIn post templates
├── server/
│   ├── services/
│   │   └── geminiService.js # Google Gemini LLM API wrapper & offline fallbacks
│   ├── mockDb.js           # Stateful database representing Firestore collections
│   └── server.js           # Express API endpoints & Incident Simulation ticks
├── src/
│   ├── components/
│   │   ├── StadiumDigitalTwin.jsx # SVG vector rendering of real-time stadium states
│   │   ├── PitchDeck.jsx          # Built-in Presentation Slides & Quick Demo steps
│   │   └── AiAssistant.jsx        # Conversational chatbot with lang selectors
│   ├── dashboards/
│   │   ├── AdminDashboard.jsx     # Controls for simulated disasters & drone routes
│   │   ├── SecurityDashboard.jsx  # CCTV feeds grid & staff response selectors
│   │   ├── VolunteerDashboard.jsx # Tasks & elderly/disabled wheelchair guidance
│   │   ├── CoachDashboard.jsx     # Athlete fatigue charts & substitution logic
│   │   ├── OrganizerDashboard.jsx # Fixture generation, solar energy, dynamic pricing
│   │   ├── MedicalDashboard.jsx   # EMT dispatcher queue & first-aid maps
│   │   └── FanDashboard.jsx       # Interactive ticket wallet & queue wait meters
│   ├── App.jsx             # Main router, sync pollers, state managers
│   └── index.css           # Glassmorphism stylings & custom visual animations
├── package.json            # Run scripts and fullstack dependencies
└── index.html              # HTML shell & Google Fonts (Outfit)
```

---

## 🏎️ Running the Platform (Fullstack Concurrently)

### 1. Configure Environment Variables (Optional)
If you want to use live Gemini AI calls, create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
PORT=5000
```
*Note: If no API key is specified, StadiumMind AI falls back to a highly realistic mock AI responder, enabling 100% offline functionality for presentation grids.*

### 2. Install Dependencies
Execute the installation from the root directory:
```bash
npm install
```

### 3. Launch Development Server
Start both the React client dev server and the Express backend concurrently:
```bash
npm run dev
```

- **Frontend Client**: runs at [http://localhost:5173](http://localhost:5173) (or next available port).
- **Backend API Server**: runs at [http://localhost:5000](http://localhost:5000).

---

## 🏆 Presentation Guide (For Hackathon Judges)
When presenting to judges:
1. Open the app and toggle **"JUDGE PITCH SLIDES"** in the top bar.
2. Step through the Slides (Architecture, Problem, Solutions, Data Models).
3. Use the **Live Demo Scenarios** panel on the right of the slide deck:
   - Click **"1. Digital Twin Simulation"** to reset the dashboard and start the dynamic background telemetry drifts.
   - Click **"2. Evacuation Coordinator"** to inject a crisis (stampede risk), switch to Admin view, and watch the Digital Twin redraw with neon evacuation routing arrows pointing to safe zones.
   - Click **"3. Smart Logistics"** to jump into the Organizer view and demo solar-grid optimization and dynamic pricing ticket spikes.
   - Click **"4. Gemini Fan Assistant"** to view the Fan Experience chatbot answering questions in multiple languages (English, Hindi, Spanish).
