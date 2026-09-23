# SmartCrowd — Testing Log

**Status:** Frontend Verification Complete. Backend Pending.

## Frontend Validation (Simulated Environment)

| Feature | Test Case | Expected Result | Actual Result | Status |
|---------|-----------|-----------------|---------------|--------|
| **Build** | Run `npm run dev` | Compiles successfully without TS errors. | Compiled successfully. CSS/TS errors resolved. | PASS |
| **Routing** | Navigate `/login` ➔ roles | Routes correctly to Admin or Passenger apps. | Navigated successfully. | PASS |
| **Location Prompt** | Passenger grants location | `navigator.permissions` detects 'granted'. | Detected 'granted', map shows blue dot. | PASS |
| **Location Prompt** | Passenger denies location | Map loads gracefully without user marker. | Fallback handled correctly. | PASS |
| **Trip Details** | Select Route 104 | Renders origin, dest, steps, and ETA card. | Rendered matching UX reference. | PASS |
| **Sensor Opt-in** | Tap 'YES, I'M ON THIS BUS' | Sets `isSharing=true`, shows green contribution banner. | State correctly passed, UI updates. | PASS |
| **Passive Tracking** | Tap 'NO, I'M JUST TRACKING' | Sets `isSharing=false`, shows gray tracking banner. | State correctly passed, UI updates. | PASS |
| **Passenger Map** | Render Tracking Map | Only bus, route, and stops visible. No signals. | P1-P6 successfully hidden via `mode` prop. | PASS |
| **Account State** | Edit Profile Name | Name updates on Account and Home screens. | LocalStorage syncs via custom hook. | PASS |
| **My Trips State** | Search for Bus 104 | Bus 104 appears in Recent Searches and My Trips. | LocalStorage syncs correctly. | PASS |
| **Simulation** | Start Admin Demo | P1-P6 animate along route, bus estimate updates. | Deterministic hook fires correctly. | PASS |
| **Signal Filter** | Evaluate P4 (Waiting) | Scored as noise due to lack of continuity. | Filtered correctly on Admin map. | PASS |

## Backend & Database Validation

| Feature | Test Case | Expected Result | Actual Result | Status |
|---------|-----------|-----------------|---------------|--------|
| **API Ingestion** | POST `/api/signals` | Receives and stores passenger telemetry in PostgreSQL. | Handled async Postgres insert. | PASS |
| **Processing** | Score calculation | Replicates frontend logic accurately on server. | Logic ported and scores correctly. | PASS |
| **Continuity** | Signal history | Fetches previous signals from PostgreSQL. | Continuity scores calculate successfully. | PASS |
| **Consensus** | Spatial clustering | Derives accurate bus estimate centroid. | Estimate computed and saved to DB. | PASS |
| **Data Layer** | PostgreSQL persistence | Stores active signals and current bus estimate. | Verified `passenger_signals` and `bus_estimates` tables. | PASS |
