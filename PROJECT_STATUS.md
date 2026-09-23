# SmartCrowd — Project Status

**Current Phase:** Production deployment completed and verified
**Last Updated:** 2026-09-23

## Executive Summary
The SmartCrowd application is now fully integrated and deployed to production. The backend Node.js/Express server connects to a production Neon PostgreSQL database for persistence. Real passenger GPS signals and simulated signals flow through the same pipeline.

**BACKEND STATUS = COMPLETE & DEPLOYED**
**FRONTEND INTEGRATION = COMPLETE & DEPLOYED**
**DATABASE = POSTGRESQL (NEON) CONNECTED**

## Current State & Verified Production Deployment

### Frontend (Live)
- **URL**: https://smartcrowd-rho.vercel.app/
- **Status**: WORKING ✅ (Hosted on Vercel)
- **Architecture**: React + TypeScript + Vite + Tailwind CSS + Leaflet.
- **Backend Mode**: `SimulationContext` polls the Express backend at `VITE_API_URL`.

### Backend Engine (Live)
- **URL**: https://smartcrowd-backend-rq35.onrender.com
- **Health**: https://smartcrowd-backend-rq35.onrender.com/api/health (Returns `status="ok"`)
- **Status**: WORKING ✅ (Hosted on Render)
- **Express API**: REST API for signals, bus ETAs, and simulation control.
- **Signal Engine**: Backend scores signals and tracks continuity by querying history from PostgreSQL.
- **Crowd Consensus**: Groups reliable signals to determine bus position.
- **Simulation**: Deterministic scenario with P1-P6 running on the server and persisting to PostgreSQL.

### Database (Live)
- **Status**: CONNECTED AND WORKING ✅
- **Provider**: Neon PostgreSQL
- **Schema**: `passenger_signals` and `bus_estimates` tables storing signal telemetry and computed bus estimates.

## What Remains
- **Field Testing**: Real-world field testing in Kalyan-Dombivli.
- **Machine Learning**: Integration of advanced ML models for clustering.

---

# NEXT AI HANDOFF

**Current project:** SmartCrowd
**Current phase:** Field Testing & Iteration

**What the next AI MUST do first:**
1. The application is completely functional and deployed to production.
2. Frontend is on Vercel, Backend is on Render, and Database is on Neon.
3. If making code modifications, test against local setup before deploying changes.
4. Do NOT expose `DATABASE_URL` or any secrets in documentation.
