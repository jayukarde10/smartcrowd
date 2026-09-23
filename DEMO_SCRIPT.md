# SmartCrowd — Demo Script

This script outlines the exact flow to demonstrate the CX0403 SmartCrowd solution to hackathon judges.

## Prerequisites
- Open the live production frontend: https://smartcrowd-rho.vercel.app/
- Allow location permissions on the demo device.

---

## Part 1: The Passenger Experience

*Goal: Show how simple and consumer-friendly the solution is. They only see the refined ETA.*

1. **Login**: Navigate to `/login` and select **Passenger**.
2. **Transition**: Observe the smooth opening animation.
3. **Location Prompt**: If prompted, grant location access (explain we don't track them unless they board).
4. **Home Screen**: Show the personalized greeting, saved places, and nearby Route 104.
5. **Search**: Tap the search bar, type "104", and select the Bus 104 result.
6. **Trip Details**: Show the route overview (Kalyan Station ➔ Dombivli Station, 44 min).
7. **The Critical Decision**: Tap the route card to trigger the modal: "Are you currently on this bus?"
   - *Flow A (YES)*: Tap "YES". Explain that this actively enables location sharing for sensor contribution. The Tracking map loads with a green "Helping improve this bus estimate" banner.
   - *Flow B (NO)*: Tap "NO". Explain that this tracks the bus passively without contributing sensor data. The Tracking map loads with a gray "Tracking bus" banner.
8. **Passenger Tracking**: 
   - Show the large, consumer-friendly map.
   - Point out that **no technical signals** (no other passengers) are visible.
   - Show the blue pulsing dot indicating the judge's real device location.
   - Scroll the bottom sheet to show the vertical stop timeline and the emphasized current stop with live ETA.

---

## Part 2: The Admin Experience (Under the Hood)

*Goal: Show the technical complexity of filtering noise and deriving the ETA.*

1. **Login**: Open a new tab, navigate to `/login`, and select **Admin**.
2. **Dashboard**: Show the high-level system overview.
3. **Demo Simulation**: Navigate to the Demo tab and hit "Start Simulation".
4. **Live Tracking**: Open the Live Tracking map.
   - Contrast this heavily with the Passenger map. Here, show the raw signals.
   - Explain that all signals are streaming into a live **PostgreSQL** database on the backend before being processed.
   - **Show P1, P2, P3**: Explain these are clustered inside a green reliability circle (High Confidence). These are actual passengers on the bus.
   - **Show P4 (Waiting)**: Explain the algorithm detects zero speed near a bus stop, scoring it as low reliability.
   - **Show P5 (Car)**: Explain the algorithm detects deviation from the route adherence path.
   - **Show P6 (Pedestrian)**: Explain the algorithm detects speed too low for a moving transit vehicle between stops.
5. **Crowd Consensus**: Show how the algorithm clusters the reliable signals, calculates a centroid, and places the final Bus Estimate marker into PostgreSQL.
6. **Signal Analysis**: Open this view to show the exact numerical breakdown (Speed Score, Direction Score, Adherence Score) that the backend uses to filter the noise.

*(End of Demo)*
