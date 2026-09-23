# 🚌 SmartCrowd

### Crowdsourced Real-Time Bus Tracking for Cities Without GPS-Equipped Buses

[![Live Project](https://img.shields.io/badge/Live%20Demo-SmartCrowd-6C63FF?style=for-the-badge)](https://smartcrowd-rho.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge)](https://smartcrowd-backend-rq35.onrender.com)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E599?style=for-the-badge)](https://neon.tech/)

SmartCrowd is a **hardware-free, crowdsourced bus tracking platform** that uses passengers' smartphones as temporary location sensors to estimate the real-time position and ETA of buses.

Instead of requiring dedicated GPS hardware on every bus, SmartCrowd intelligently processes location signals from passengers and filters unreliable signals using multiple movement and route-based factors.

---

## 🚀 Live Demo

### 🌐 Passenger & Admin Application
**[Open SmartCrowd →](https://smartcrowd-rho.vercel.app/)**

### ⚙️ Backend API
**[Open SmartCrowd API →](https://smartcrowd-backend-rq35.onrender.com)**

### ❤️ API Health Check
**[Check API Status →](https://smartcrowd-backend-rq35.onrender.com/api/health)**

> **Production Status:** 🟢 Live and verified

---

## 🎯 Problem

Many buses in tier-2 and tier-3 cities operate without dedicated GPS hardware.

Traditional transit applications often depend on:

- Dedicated GPS devices installed on buses
- Centralized tracking infrastructure
- Fixed timetable information

Without GPS hardware, passengers may only see scheduled information instead of the **actual bus location and estimated arrival time**.

However, passengers already carry GPS-enabled smartphones.

The challenge is that **not every nearby phone belongs to a passenger on the bus**.

A phone may belong to:

- 🚌 An actual passenger
- 🚏 A person waiting at a bus stop
- 🚶 A pedestrian
- 🚗 Someone travelling in another vehicle

Simply using raw GPS signals can therefore produce incorrect bus locations.

---

## 💡 Our Solution

SmartCrowd transforms passenger smartphones into **temporary crowdsourced sensors**.

The system collects location and movement information from consenting passengers and evaluates each signal using multiple factors before using it for bus estimation.

### Signal Evaluation

SmartCrowd considers:

- **Speed**
- **Direction**
- **Route adherence**
- **Movement continuity**
- **Stop behavior**

Signals are assigned a reliability score and classified as reliable or noisy.

Reliable signals are then combined using **crowd consensus** to estimate the actual bus position.

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
 │ • Speed               │
 │ • Direction           │
 │ • Route Adherence     │
 │ • Movement Continuity │
 │ • Stop Behavior       │
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
 Passenger / Admin
