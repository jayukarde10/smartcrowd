# 🚌 SmartCrowd

### Crowdsourced Real-Time Bus Tracking for Cities Without GPS-Equipped Buses

[![Live Demo](https://img.shields.io/badge/Live%20Demo-SmartCrowd-6C63FF?style=for-the-badge)](https://smartcrowd-rho.vercel.app/) [![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge)](https://smartcrowd-backend-rq35.onrender.com) [![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E599?style=for-the-badge)](https://neon.tech/)

SmartCrowd is a **hardware-free, crowdsourced bus tracking platform** that uses passengers' smartphones as temporary location sensors to estimate the real-time position and ETA of buses. Instead of requiring dedicated GPS hardware on every bus, SmartCrowd intelligently processes location signals from passengers and filters unreliable signals using multiple movement and route-based factors.

---

## 🚀 Live Demo

### 🌐 Passenger & Admin Application
**[Open SmartCrowd →](https://smartcrowd-rho.vercel.app/)**

### ⚙️ Backend API
**[Open SmartCrowd API →](https://smartcrowd-backend-rq35.onrender.com)**

### ❤️ API Health Check
**[Check API Status →](https://smartcrowd-backend-rq35.onrender.com/api/health)**

> **Production Status:** 🟢 Live and Verified

---

## 🎯 Problem

Many buses in tier-2 and tier-3 cities operate without dedicated GPS hardware. Traditional transit applications often depend on:
- Dedicated GPS devices installed on buses
- Centralized tracking infrastructure
- Fixed timetable information

Without GPS hardware, passengers may only see scheduled information instead of the **actual bus location and estimated arrival time**. However, passengers already carry GPS-enabled smartphones.

The challenge is that **not every nearby phone belongs to a passenger on the bus**. A phone may belong to:
- 🚌 An actual passenger
- 🚏 A person waiting at a bus stop
- 🚶 A pedestrian
- 🚗 Someone travelling in another vehicle

Simply using raw GPS signals can therefore produce incorrect bus locations.

---

## 💡 Our Solution

SmartCrowd transforms passenger smartphones into **temporary crowdsourced sensors**. The system collects location and movement information from consenting passengers and evaluates each signal using multiple factors before using it for bus estimation.

### Signal Evaluation

SmartCrowd considers:
- **Speed**
- **Direction**
- **Route adherence**
- **Movement continuity**
- **Stop behavior**

Signals are assigned a reliability score and classified as reliable or noisy. Reliable signals are then combined using **crowd consensus** to estimate the actual bus position.

---

## 🧠 How It Works

```text
Passenger Smartphone
       │
       ▼
  GPS Signal
       │
       ▼
  Backend API
       │
       ▼
 PostgreSQL / Neon
       │
       ▼
┌───────────────────────┐
│   Signal Analysis     │
│                       │
│  • Speed              │
│  • Direction          │
│  • Route Adherence    │
│  • Movement Continuity│
│  • Stop Behavior      │
└───────────────────────┘
       │
       ▼
 Reliability Scoring
       │
       ▼
  Noise Filtering
       │
       ▼
  Crowd Consensus
       │
       ▼
Bus Location Estimate
       │
       ▼
    ETA Engine
       │
       ▼
Passenger / Admin UI
```

### 🔍 Signal Intelligence
SmartCrowd does not treat every GPS signal as valid. Each signal is evaluated independently.

| Factor | Purpose |
|--------|---------|
| Speed | Determines whether movement is compatible with bus travel |
| Direction | Checks whether movement follows the route direction |
| Route Adherence | Measures compatibility with the expected bus route |
| Movement Continuity | Detects continuous movement consistent with travelling on a bus |
| Stop Behavior | Helps identify signals remaining around bus stops |

The resulting reliability score is used to separate reliable passenger signals from environmental noise.

### 👥 Crowd Consensus
After unreliable signals are filtered, SmartCrowd combines compatible reliable signals.

```text
P1 ─────┐
P2 ─────┼──► Reliable Signal Cluster
P3 ─────┘
       │
       ▼
 Crowd Consensus
       │
       ▼
Estimated Bus Position
```

Signals that agree on Location, Direction, Speed, Route segment, and Movement pattern contribute toward the estimated bus position. This prevents a single incorrect GPS signal from determining the bus location.

### ⏱️ ETA Calculation
Once the system estimates the bus position, the ETA engine determines:
- Current route position
- Current stop
- Next stop
- Remaining route distance
- Estimated travel time
- Confidence level

The passenger receives an estimated arrival time based on the processed crowd signals.

### 🗺️ Demonstration Route
The project demonstration uses a simulated route in Kalyan-Dombivli, Thane district, Maharashtra:

**Kalyan Station ↓ 90 Feet Road ↓ Gharda Circle ↓ MIDC Dombivli ↓ Dombivli Station**

*(Route 104 — SmartCrowd Demonstration Route)*

> **Note**: This route is used for project demonstration and simulation. It is not presented as official live transit data.

### 🧪 Simulation
SmartCrowd includes a deterministic simulation containing six example users:

| User | Scenario |
|------|----------|
| P1 | 🚌 Passenger on bus |
| P2 | 🚌 Passenger on bus |
| P3 | 🚌 Passenger on bus |
| P4 | 🚏 Waiting at bus stop |
| P5 | 🚗 Nearby vehicle |
| P6 | 🚶 Pedestrian |

The system processes all signals through the same scoring and filtering pipeline. The simulation demonstrates how SmartCrowd separates genuine passenger movement from surrounding location noise.

---

## 🖥️ System Modules

### 👨‍💼 Admin
The admin interface provides operational visibility into the tracking system.
- Dashboard
- Live Tracking
- Signal Analysis
- Crowd Consensus
- Demo Simulation
- How It Works

### 🧑‍🚌 Passenger
The passenger interface focuses on real-time transit information.
- Route search
- Trip details
- Bus tracking
- ETA
- Current / next stop
- My Trips
- Account
- Location permission
- Optional location contribution

---

## 🔐 Location Privacy
SmartCrowd distinguishes between location permission and location contribution.

- **Location Permission**: Browser permission allowing the application to access device location.
- **Location Contribution**: Explicit user consent to contribute the device's location as a bus-tracking signal.

The system does not assume that granting location permission means the user is travelling on the bus.

```text
     Location Permission
              │
              ▼
 Are you currently on this bus?
              │
        ┌─────┴─────┐
        │           │
       YES          NO
        │           │
        ▼           ▼
   Contribute   Track only
     signal        bus
```

If the passenger chooses NO, their location is not treated as an on-bus sensor signal.

---

## 🏗️ Architecture

```text
┌─────────────────────────────┐
│    Passenger Smartphone     │
│       GPS / Location        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Node.js Backend       │
│    Express + TypeScript     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      PostgreSQL / Neon      │
│                             │
│     Passenger Signals       │
│       Bus Estimates         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Signal Processing      │
│                             │
│           Speed             │
│         Direction           │
│      Route Adherence        │
│    Movement Continuity      │
│       Stop Behavior         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Noise Filtering       │
│      + Crowd Consensus      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│   Bus Location Estimator    │
│        + ETA Engine         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       React Frontend        │
│ Passenger + Admin Interface │
└─────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Leaflet, Lucide React
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Neon
- **Deployment**: Vercel (Frontend), Render (Backend), Neon (Database)
- **Development Tools**: Git, GitHub, VS Code

---

## 📁 Project Structure

```text
smartcrowd/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── engine/
│   ├── types/
│   └── ...
│
├── server/
│   └── src/
│       ├── engine/
│       ├── routes/
│       ├── db.ts
│       ├── store.ts
│       └── index.ts
│
├── PROJECT_STATUS.md
├── PROJECT_PLAN.md
├── ARCHITECTURE.md
├── DECISIONS.md
├── DEMO_SCRIPT.md
├── TESTING.md
├── README.md
└── package.json
```

---

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/jayukarde10/smartcrowd.git
cd smartcrowd
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Configure Environment Variables

**Frontend**
Create `.env.local`:
```env
VITE_API_URL=http://localhost:3001
```

**Backend**
Create `server/.env`:
```env
DATABASE_URL=<your-postgresql-connection-string>
PORT=3001
FRONTEND_URL=http://localhost:5173
```
> ⚠️ Never commit `.env`, `.env.local`, database passwords, API keys, or other secrets to GitHub.

### 5. Start the Backend
```bash
cd server
npm run dev
```

### 6. Start the Frontend
Open another terminal:
```bash
npm run dev
```

The frontend will normally be available at:
`http://localhost:5173`

---

## 🧪 Production Verification

The deployed system has been verified for:
- ✅ Frontend availability
- ✅ Backend API availability
- ✅ PostgreSQL connectivity
- ✅ Demo simulation
- ✅ Passenger signal processing
- ✅ Signal scoring
- ✅ Bus estimation
- ✅ ETA calculation
- ✅ Frontend ↔ Backend communication
- ✅ Backend ↔ PostgreSQL communication

### Production API Health Response
The production health endpoint returns:
```json
{
  "status": "ok",
  "service": "SmartCrowd API",
  "version": "1.0.0"
}
```

---

## 🎯 Key Features
- 🚌 Hardware-free bus tracking
- 📍 Crowdsourced passenger GPS
- 🧠 Multi-factor signal validation
- 🚫 Intelligent noise filtering
- 👥 Crowd consensus
- 📊 Reliability scoring
- 📍 Real-time bus position estimation
- ⏱️ Dynamic ETA calculation
- 🗺️ Interactive route tracking
- 👨‍💼 Admin monitoring dashboard
- 🧑‍🚌 Passenger tracking interface
- 🔐 Explicit location contribution consent
- ☁️ Production deployment

---

## 🌍 Potential Impact
SmartCrowd is built around a simple idea: **Use the smartphones passengers already carry instead of requiring every bus to have dedicated tracking hardware.** This approach can potentially reduce the infrastructure barrier for real-time bus tracking in cities where dedicated GPS deployment across the fleet is difficult or unavailable.

---

## 🔮 Future Scope
Potential future enhancements include:
- Machine-learning-based signal classification
- Historical route-speed analysis
- Improved ETA prediction
- Automatic route discovery
- Multi-route support
- Large-scale passenger participation
- Driver/operator dashboard
- Offline-first signal buffering
- Advanced privacy-preserving location processing
- Integration with official transit systems

---

## 📚 Project Documentation
Detailed project documentation is available in the repository:
- [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DECISIONS.md](./DECISIONS.md)
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
- [TESTING.md](./TESTING.md)

---

## 🚀 Deployment

SmartCrowd is deployed using:

```text
┌───────────────────┐
│      Vercel       │
│     Frontend      │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│      Render       │
│      Backend      │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│       Neon        │
│    PostgreSQL     │
└───────────────────┘
```

### Production Links
| Component | Link |
|-----------|------|
| 🌐 Frontend | [SmartCrowd Web App](https://smartcrowd-rho.vercel.app/) |
| ⚙️ Backend | [SmartCrowd API](https://smartcrowd-backend-rq35.onrender.com/) |
| ❤️ Health Check | [API Health](https://smartcrowd-backend-rq35.onrender.com/api/health) |
| 💻 Repository | [GitHub](https://github.com/jayukarde10/smartcrowd) |

> **Production Status:** 🟢 Live and Verified

---

## 🏆 Problem Statement
**CX0403 — The Last-Mile Bus Mystery**
- **Domain**: Smart Cities & Urban Development
- **Theme**: Smart Mobility & Intelligent Public Transportation

SmartCrowd addresses the challenge of obtaining real-time bus location and ETA information in environments where buses may not have dedicated GPS hardware.

---

## 👥 Team
**SmartCrowd**
Developed for the CX0403 – The Last-Mile Bus Mystery problem statement under the Smart Cities & Urban Development domain.

---

## 📄 License
This project is developed for educational, research, and hackathon purposes.
