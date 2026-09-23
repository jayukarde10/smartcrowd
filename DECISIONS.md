# SmartCrowd — Key Decisions

This log documents the crucial product and technical decisions established for the CX0403 prototype.

### 1. Prototype Geography
**Decision**: Use Kalyan-Dombivli (Maharashtra) rather than Bengaluru.
**Reason**: To address tier-2/tier-3 city environments where GPS infrastructure is actually lacking.

### 2. Route Data
**Decision**: Use "Route 104" (Kalyan Station ➔ Dombivli Station) as simulated prototype data. It must clearly be labeled as simulated/prototype.
**Reason**: To avoid falsely presenting our prototype demo as official live transit data.

### 3. Application Separation
**Decision**: Split the UI into completely distinct Admin and Passenger apps.
**Reason**: The Admin needs to see the internal algorithmic noise (the "Why"), while the Passenger just needs the refined ETA (the "Where").

### 4. Passenger Location Tracking
**Decision**: Use real `navigator.geolocation` for the passenger's "My Location" marker, while keeping the bus location simulated.
**Reason**: Makes the Passenger Tracking experience feel real and native on the judge's device.

### 5. Location Permission ≠ Sensor Contribution
**Decision**: Granting browser GPS permissions does NOT automatically make the user a bus sensor. The user must explicitly tap "YES, I'M ON THIS BUS".
**Reason**: Fundamental privacy and data accuracy requirement. We only want signals from people actually riding.

### 6. In-Browser Simulation to Server-Side Simulation
Originally, the simulation of P1-P6 ran in the browser. It has now been ported to the Node.js backend.
**Reason**: To prove that the frontend can remain "dumb" and simply consume the final bus estimate. The backend now runs the simulation tick and updates the PostgreSQL database, perfectly mimicking real-world streaming data.

### 7. Real PostgreSQL Database
We replaced the transient in-memory store with a real PostgreSQL database.
**Reason**: To demonstrate a complete, production-ready pipeline to judges: `GPS → API → DB → Engine → Consensus → Frontend`. It proves the architecture can handle persistent state and historical queries.

### 8. Static Route Data vs Database
Route definitions and stops (e.g., Route 104) are kept as static TypeScript constants rather than being migrated into the PostgreSQL database.
**Reason**: To avoid over-engineering the prototype. Real-world transit routes change rarely. Keeping them in code reduces database schema complexity while still allowing us to demonstrate the core value proposition: processing streaming telemetry data.

### 9. Deterministic vs AI ML Models
**Decision**: The signal scoring uses deterministic, rules-based algorithms (speed limits, route polyline distances) rather than a black-box AI model.
**Reason**: Explainability. The Admin dashboard can show exactly *why* P5 (the car) was rejected. An AI model would be harder to visualize and debug for a prototype demonstration.
