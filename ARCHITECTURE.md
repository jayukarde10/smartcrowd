# SmartCrowd — Architecture

## High-Level Data Flow

The core architecture filters raw GPS noise to find the reliable "Crowd Consensus" using a PostgreSQL-backed persistence layer.

```text
Passenger Phone (GPS Sensor)
       ↓
[ POST /api/signals ]
       ↓
Express API (Node.js)
       ↓
PostgreSQL Database
  (passenger_signals table)
       ↓
Signal Processing Engine
  - Speed Validation
  - Direction/Heading Check
  - Route Adherence
  - Movement Continuity (fetched from PostgreSQL)
  - Stop Behavior
       ↓
Noise Filtering
  (Drops P4, P5, P6)
       ↓
Crowd Consensus
  (Clusters P1, P2, P3)
       ↓
Bus Location Estimate & ETA
       ↓
PostgreSQL Database
  (bus_estimates table)
       ↓
[ GET /api/bus/:routeId ]
       ↓
Passenger UI & Admin Dashboard
```

## System Components

### 1. Database (PostgreSQL)
We utilize a PostgreSQL database to persist state:
- `passenger_signals`: Stores all incoming real and simulated GPS telemetry data along with their computed reliability scores.
- `bus_estimates`: Stores the aggregated consensus of the bus's location, current stop, and ETA.

*Note: Routes and route stops remain as static code constants to reduce complexity for the prototype. Only streaming data (signals and estimates) are persisted in PostgreSQL.*

### 2. Backend (Node.js/Express)
The `server/` directory hosts a REST API.
- Ingests raw GPS signals (`POST /api/signals`).
- Executes the deterministic scoring pipeline.
- Clusters signals to compute the bus position.
- Simulates the P1-P6 scenarios dynamically.

### 3. Frontend (React/Vite)
- **Passenger Flow**: Lightweight UI. If the user opts-in, it reads `navigator.geolocation` and posts to the API. It polls `GET /api/bus/:routeId` for updates.
- **Admin Flow**: Diagnostic UI. Polls `GET /api/signals` to visualize the scoring, clustering, and filtering of all telemetry data.

## The SmartCrowd Engine

The core IP is located in `server/src/engine/`.

### `signalScoring.ts`
Applies a weighted formula to every GPS coordinate:
1. **Speed**: Is it walking (too slow) or a car (too fast)?
2. **Direction**: Is it moving towards the next bus stop?
3. **Adherence**: Is the coordinate on the polyline of Route 104?
4. **Continuity**: Based on the *last N signals for this session* (queried from PostgreSQL), is the movement consistent?

### `crowdConsensus.ts`
1. Filters out any signal whose reliability score falls below the `RELIABILITY_THRESHOLD`.
2. Clusters the remaining reliable signals based on geospatial proximity (`CLUSTER_RADIUS_METERS`).
3. The centroid of the largest cluster is declared the authoritative Bus Position.
4. Calculates ETA based on the remaining distance to the destination.
