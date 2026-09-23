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

The next and final major phase is deployment.

**Deployment Plan:**
1. **Database**: Provision a managed PostgreSQL instance.
2. **Backend (Render)**: Deploy the Express application with `DATABASE_URL`, `PORT`, and `FRONTEND_URL` environment variables.
3. **Frontend (Vercel)**: Deploy the React SPA with the `VITE_API_URL` environment variable pointing to the deployed backend.
4. **Verification**: Perform basic production testing to ensure live signal processing works.

---

## FUTURE
- Real-world field testing in Kalyan-Dombivli.
- Advanced machine learning models for signal clustering.
- Integration with transit ticketing systems.
