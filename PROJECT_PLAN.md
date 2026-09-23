# SmartCrowd — Project Plan

**Objective:** Build a prototype resolving "The Last-Mile Bus Mystery" (CX0403) by using passenger smartphones as crowd-sourced location sensors, correctly filtering out noise (pedestrians, cars) to accurately estimate bus ETAs in tier-2/tier-3 cities.

---

## COMPLETED (Frontend & Backend Phase)
- ✅ Project Initialization (React, TS, Vite, Tailwind).
- ✅ Passenger & Admin UI implementation.
- ✅ Backend Setup (Node/Express/TS).
- ✅ **Database Integration**: PostgreSQL integrated for persisting `passenger_signals` and `bus_estimates`.
- ✅ **Signal Processing Pipeline**: Real and simulated signals pass through Express → PostgreSQL → Processing Engine → Crowd Consensus → Bus Prediction.
- ✅ **Continuity Scoring**: Backend dynamically fetches recent signal history from Postgres to calculate movement continuity.
- ✅ Frontend/Backend Integration via REST API.

---

## CURRENT STATE
The application is functionally complete with a real database. It demonstrates the full end-to-end pipeline required to filter noise and estimate ETAs from crowd-sourced GPS data.

---

## NEXT PHASE: DEPLOYMENT

The deployment phase has been completed.

**Deployment Completed:**
- ✅ **Database**: Managed PostgreSQL instance provisioned on Neon.
- ✅ **Backend (Render)**: Express application deployed with `DATABASE_URL`, `PORT=10000`, and `FRONTEND_URL` environment variables.
- ✅ **Frontend (Vercel)**: React SPA deployed with the `VITE_API_URL` pointing to the live Render backend.
- ✅ **Verification**: Production testing verified that the live signal processing, passenger GPS telemetry, and demo simulation function end-to-end.

---

## FUTURE
- Real-world field testing in Kalyan-Dombivli.
- Advanced machine learning models for signal clustering.
- Integration with transit ticketing systems.
