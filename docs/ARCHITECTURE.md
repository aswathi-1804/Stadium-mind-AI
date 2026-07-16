# StadiumMind AI — Architecture & Systems Design

This document details the system topology, database schemas, message flows, use cases, and decision logic for **StadiumMind AI**, a tournament-scale smart stadium operating system.

---

## 1. High-Level Event-Driven Architecture
StadiumMind AI uses a shared **Event Bus** (implemented via Google Cloud Pub/Sub in production) as its central backbone. All telemetry providers (cameras, ticketing turnstiles, IoT meters) publish messages to the bus. The **AI Orchestration Layer** reasons over these events and triggers workflows in downstream modules.

```mermaid
flowchart TB
    subgraph telemetry["IoT Telemetry & Data Providers"]
        A1[CCTV Cameras / Vision AI]
        A2[Smart Parking Sensors]
        A3[Ticketing Scanners]
        A4[Weather Telemetry API]
        A5[Facility Power Meters]
    end

    subgraph pubsub["Event Bus (Google Cloud Pub/Sub)"]
        B1[(Telemetry Event Stream)]
    end

    subgraph brain["AI Orchestration Layer (Google Cloud)"]
        C1[Gemini 1.5 - Reasoning & Conversation]
        C2[Vertex AI - Predictive Diagnostics]
        C3[Vision AI - Anomaly Detection]
    end

    subgraph modules["Downstream Action Modules"]
        D1[Crowd Intelligence]
        D2[Smart Parking]
        D3[Security Intelligence]
        D4[Emergency Coordinator]
        D5[Sustainability Manager]
        D6[Coach Assistant]
        D7[Tournament Planner]
        D8[Revenue Optimizer]
        D9[Volunteer Coordinator]
        D10[Accessibility Assistant]
    end

    subgraph client["AI Command Center UI"]
        E1[Platform Dashboards]
    end

    telemetry -->|Telemetry Events| pubsub
    pubsub -->|Forward Stream| brain
    brain -->|Direct Actions| modules
    modules -->|Push Telemetry| client
    client -->|Human-in-the-loop overrides| pubsub
```

---

## 2. Database Entity-Relationship (ER) Model
The database is structured in Google Cloud Firestore. The diagram below illustrates the relationships between core operational collections.

```mermaid
erDiagram
    USERS ||--o{ TICKETS : purchase
    USERS ||--o{ PARKING_ASSIGNMENTS : hold
    USERS {
        string userId PK
        string name
        string role
        string preferredLanguage
    }
    MATCHES ||--o{ TICKETS : schedules
    MATCHES {
        string matchId PK
        string homeTeam
        string awayTeam
        datetime kickoffTime
        string stadiumVenue
    }
    TICKETS {
        string ticketId PK
        string matchId FK
        string userId FK
        string seatCoordinate
        float purchasePrice
    }
    PARKING_LOTS ||--o{ PARKING_ASSIGNMENTS : slots
    PARKING_LOTS {
        string lotId PK
        string name
        int totalCapacity
        int currentOccupancy
        float pricingRate
    }
    PARKING_ASSIGNMENTS {
        string assignmentId PK
        string lotId FK
        string userId FK
        datetime checkInTime
    }
    CROWD_ZONES ||--o{ IOT_SENSORS : monitors
    CROWD_ZONES {
        string zoneId PK
        string zoneName
        float crowdDensityPct
        string stampedeRiskLevel
    }
    IOT_SENSORS {
        string sensorId PK
        string zoneId FK
        string sensorType
        string operationStatus
    }
    SECURITY_ALERTS {
        string alertId PK
        string incidentDescription
        string severityRank
        string operationalStatus
        string assignedStaff
        datetime alertTime
    }
```

---

## 3. Incident Evacuation Sequence
This sequence diagram demonstrates the flow of events during a crowd surge or stampede warning.

```mermaid
sequenceDiagram
    autonumber
    participant Sensor as IoT Density Sensor
    participant Bus as Cloud Pub/Sub
    participant AI as Gemini & Vision AI
    participant Coord as Emergency Coordinator
    participant Signs as Digital Signboards
    participant Client as Command Center UI

    Sensor->>Bus: Density telemetry alert (> 85%)
    Bus->>AI: Trigger crowd surge message
    AI->>AI: Evaluate stampede probability
    AI->>Coord: Raise Stampede Risk to Critical
    Coord->>AI: Request egress route calculation
    AI-->>Coord: Evacuation paths & safe exits
    Coord->>Signs: Send evacuation route vectors
    Coord->>Client: Broadcast critical alerts to Admin, Security & Medics
    Client->>Client: Draw live exit vectors on Digital Twin map overlay
```

---

## 4. Role-Based Use Cases
StadiumMind AI splits operational capabilities across seven distinct user roles to maintain tight access control:

```mermaid
flowchart LR
    Admin((Stadium Director)) --> UC1[Crisis Simulator Overrides]
    Admin --> UC2[Drone Recon Patrols]
    Security((Security Officer)) --> UC3[Acknowledge CCTV Anomalies]
    Security --> UC4[Dispatch Security Guards]
    Volunteer((Volunteer Guide)) --> UC5[Check Roster Assignments]
    Volunteer --> UC6[Resolve Accessibility Escorts]
    Coach((Team Coach)) --> UC7[Track Player Fatigue Vitals]
    Coach --> UC8[Trigger Match Substitutions]
    Organizer((Tournament Planner)) --> UC9[Optimize Fixture Calendars]
    Organizer --> UC10[Adjust Dynamic pricing Multipliers]
    Medical((EMT Medic)) --> UC11[Respond to Medical Events]
    Fan((Fan Guest)) --> UC12[Seat Navigation]
    Fan --> UC13[Gemini Multilingual Q&A]
```

---

## 5. Autonomous Incident Mitigation Decision Flow
This flowchart details how the AI Decision Engine evaluates, alerts, and resolves anomalies automatically without causing operational gridlock.

```mermaid
flowchart TD
    Start([Telemetry Event Ingested]) --> ThresholdCheck{Exceeds Warning Threshold?}
    ThresholdCheck -->|No| LogState[Log standard telemetry state] --> End([Process Complete])
    ThresholdCheck -->|Yes| RaiseWarning[Generate Alert Log in Queue]
    
    RaiseWarning --> Assessment{Is Anomaly Critical?}
    Assessment -->|No| RecommendAction[AI writes non-blocking guide] --> HumanReview[Human-in-the-loop accepts?]
    HumanReview -->|No| Reject[Log human override & adapt rules] --> End
    HumanReview -->|Yes| ExecAction[Dispatch volunteers / update pricing] --> Resolve[Mark alert resolved] --> End
    
    Assessment -->|Yes| AutoOverride[Autonomous Safety Override triggered]
    AutoOverride --> EvacRoute[Recalculate Egress & Exits]
    EvacRoute --> PushAlerts[Update signboards + dispatch police & medics]
    PushAlerts --> Resolve
```

---

## 6. Development & Deployment Roadmap

1. **Now (Hackathon Core Nucleus)**:
   - Stateful simulation environment mapping 15 operational modules.
   - Live Gemini Conversational API client.
   - split-screen 2.5D interactive Digital Twin map.
2. **Next (Production Sensor Binding)**:
   - Bind CCTV streams to Google Cloud Vision AI API.
   - Configure live Cloud Pub/Sub topics to replace mock simulation loops.
3. **Future (Enterprise Scalability)**:
   - Deploy edge computing nodes at stadiums to run vision inference locally with sub-second latencies.
   - Extend the coach assistant modules into wearable biometric trackers.
