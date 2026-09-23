# SmartCrowd — Project Walkthrough

Welcome to the **SmartCrowd** project walkthrough. SmartCrowd uses crowd-sourced signals from passenger smartphones to accurately track buses in real-time, completely bypassing the need for dedicated GPS hardware on the buses themselves.

This document serves as a complete walkthrough of the core features and dashboard sections.

---

## 1. The Home Dashboard (`/dashboard`)

The Home Dashboard provides a high-level overview of the system's performance.

![Dashboard](./screenshots/dashboard.png)

**Key Metrics Include:**
*   **Total Signals Analyzed:** The overall number of location pings received.
*   **Reliable Signals:** Signals confirmed to be associated with an active bus journey.
*   **Filtered Signals:** Noise—pedestrians walking, passengers driving their own cars, stationary users, etc.
*   **Overall System Confidence (~91%):** An aggregate measure of tracking reliability based on the density and quality of signals.

---

## 2. Live Tracking (`/live-tracking`)

This view offers real-time visualization of bus routes and the crowd-sourced signals tracking them.

![Live Tracking](./screenshots/live-tracking.png)

*   **Green Markers:** Reliable signals clustered around the bus.
*   **Red Markers:** Filtered signals (e.g., users walking off-route).
*   **Cyan Marker:** The estimated, synthesized position of the bus based on the weighted centroid of reliable signals.

---

## 3. Signal Analysis (`/signal-analysis`)

How does SmartCrowd differentiate between a passenger on a bus and a pedestrian near a bus stop? The Signal Analysis engine evaluates every incoming data point.

![Signal Analysis](./screenshots/signal-analysis.png)

The table displays live metrics for incoming signals:
*   **Accepted Signals:** Characterized by speed matching the bus schedule, correct directional bearing, and high route adherence.
*   **Rejected Signals:** Identified by traits like stationary behavior, off-route bearing, or walking-speed movement. 

---

## 4. Crowd Consensus (`/crowd-consensus`)

A deep dive into the algorithm that calculates the exact bus location. 

![Crowd Consensus](./screenshots/crowd-consensus.png)

This view visualizes how reliable clusters converge to establish the bus's true location, while rejected signals branch away and are discarded. The weighted centroid formula is displayed to explain the real-time calculation.

---

## 5. Passenger Mode (`/passenger-mode`)

The mobile-friendly view that acts as the sensor for the system.

![Passenger Mode](./screenshots/passenger-mode.png)

Passengers simply enable location sharing while on their journey. The interface is designed for simplicity, with a clear privacy statement assuring users that data is anonymized and used strictly for transit tracking.

---

## 6. Demo Simulation (`/demo`)

An interactive sandbox to test the algorithm under different constraints.

![Demo Simulation](./screenshots/demo.png)

You can run various scenarios:
*   **Normal:** Standard traffic and user density.
*   **Low Signals:** Sparse data to see how the system maintains tracking.
*   **Noisy Data:** High levels of pedestrian and non-passenger signals to demonstrate the filtering efficiency.
The confidence score honestly adjusts based on the quality of the data in real-time.

---

## 7. How It Works (`/how-it-works`)

A complete technical breakdown of the SmartCrowd pipeline.

![How It Works](./screenshots/how-it-works.png)

This section maps out the journey of a signal: from the passenger's phone, through the 5-factor behavioral scoring engine, into the consensus algorithm, and finally out as a reliable bus location update.

---
*SmartCrowd - No GPS hardware on the bus, passenger phones are the sensors.*
