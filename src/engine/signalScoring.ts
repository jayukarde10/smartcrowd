// ============================================================
// SMARTCROWD — Signal Scoring Engine
// CX0403: Multi-factor reliability scoring
//
// Weights (configurable):
//   Speed:       20%
//   Direction:   20%
//   Adherence:   25%
//   Continuity:  20%
//   Stop Behav:  15%
//
// NOTE: These are prototype heuristics, not scientifically
// validated weights. Future work: calibrate on real datasets.
// ============================================================

import type {
  PassengerSignal,
  ScoringBreakdown,
  SignalStatus,
  DirectionMatch,
  LatLng,
} from '../types';
import { ROUTE_104_POLYLINE, ROUTE_104_STOPS } from '../data/routes';

// ── Scoring Weights ──────────────────────────────────────────
const WEIGHTS = {
  speed:       0.20,
  direction:   0.20,
  adherence:   0.25,
  continuity:  0.20,
  stopBehavior:0.15,
} as const;

// ── Thresholds ───────────────────────────────────────────────
const BUS_SPEED_MIN  = 8;   // km/h — below this is pedestrian
const BUS_SPEED_MAX  = 55;  // km/h — above this is highway vehicle
const BUS_SPEED_IDEAL_MIN = 12;
const BUS_SPEED_IDEAL_MAX = 50;
const ROUTE_CORRIDOR_M = 120;  // meters max deviation from route polyline
const STOP_PROXIMITY_M = 50;   // meters to be "at a stop"

// ── Haversine Distance (meters) ─────────────────────────────
export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

// ── Bearing between two points (degrees) ────────────────────
export function bearing(a: LatLng, b: LatLng): number {
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// ── Cross-track distance (meters) from point to segment ─────
function pointToSegmentDistance(p: LatLng, a: LatLng, b: LatLng): number {
  const d_pa = haversineMeters(p, a);
  const d_pb = haversineMeters(p, b);
  const d_ab = haversineMeters(a, b);
  if (d_ab === 0) return d_pa;
  const t = Math.max(0, Math.min(1, (d_pa**2 + d_ab**2 - d_pb**2) / (2 * d_pa * d_ab)));
  // Approximate: linear interpolation
  const closest: LatLng = {
    lat: a.lat + t * (b.lat - a.lat),
    lng: a.lng + t * (b.lng - a.lng),
  };
  return haversineMeters(p, closest);
}

// ── Minimum distance from signal to route polyline ───────────
export function distanceFromRoute(pos: LatLng, polyline: LatLng[] = ROUTE_104_POLYLINE): number {
  let minDist = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const d = pointToSegmentDistance(pos, polyline[i], polyline[i+1]);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

// ── 1. Speed Score ───────────────────────────────────────────
// Bus speed envelope: 12-50 km/h. Penalty for stopped (0-8),
// very slow (pedestrian), or fast (car/motorcycle).
export function computeSpeedScore(speedKmh: number): number {
  if (speedKmh < 1) return 20;           // Stationary — could be stopped bus, but likely waiter
  if (speedKmh < BUS_SPEED_MIN) return 30;  // Pedestrian-range
  if (speedKmh <= BUS_SPEED_IDEAL_MAX) {
    // Peak score at 18-40 km/h
    if (speedKmh >= 18 && speedKmh <= 40) return 100;
    if (speedKmh >= BUS_SPEED_IDEAL_MIN) return 90;
    return 80;
  }
  if (speedKmh <= BUS_SPEED_MAX) return 60;  // Fast but possible
  return 20;                              // Highway speed — very likely car
}

// ── 2. Direction Score ───────────────────────────────────────
// Compare heading against nearest route segment bearing.
// Returns 0-100.
export function computeDirectionScore(heading: number, pos: LatLng, polyline: LatLng[] = ROUTE_104_POLYLINE): number {
  // Find nearest segment
  let minDist = Infinity;
  let bestBearing = 0;
  for (let i = 0; i < polyline.length - 1; i++) {
    const d = pointToSegmentDistance(pos, polyline[i], polyline[i+1]);
    if (d < minDist) {
      minDist = d;
      bestBearing = bearing(polyline[i], polyline[i+1]);
    }
  }
  // Angular difference (accounting for wrap-around)
  let diff = Math.abs(heading - bestBearing) % 360;
  if (diff > 180) diff = 360 - diff;
  // Convert to score: 0 deg = 100, 90 deg = 50, 180 deg = 0
  const score = Math.max(0, 100 - (diff / 180) * 100);
  return Math.round(score);
}

// ── 3. Route Adherence Score ─────────────────────────────────
// Lower score the further the phone is from the route polyline.
export function computeRouteAdherenceScore(distMeters: number): number {
  if (distMeters <= 25) return 100;
  if (distMeters <= 50) return 92;
  if (distMeters <= 80) return 80;
  if (distMeters <= ROUTE_CORRIDOR_M) return Math.round(80 - ((distMeters - 80) / 40) * 30);
  return Math.max(0, Math.round(50 - ((distMeters - ROUTE_CORRIDOR_M) / 100) * 50));
}

// ── 4. Movement Continuity Score ─────────────────────────────
// Evaluates temporal trajectory stability.
// Uses position history to detect erratic movement.
export function computeContinuityScore(
  posHistory: LatLng[],
  speedHistory: number[]
): number {
  if (posHistory.length < 2) return 50; // Insufficient data
  // Speed variance
  const avgSpeed = speedHistory.reduce((a,b) => a+b, 0) / speedHistory.length;
  const variance = speedHistory.reduce((a,b) => a + (b-avgSpeed)**2, 0) / speedHistory.length;
  const stdDev = Math.sqrt(variance);
  // Low variance → continuous movement → high score
  if (stdDev < 3) return 95;
  if (stdDev < 8) return 80;
  if (stdDev < 15) return 60;
  if (stdDev < 25) return 40;
  return 20; // Highly erratic
}

// ── 5. Stop Behavior Score ───────────────────────────────────
// If stationary, check if near an official stop (legitimate dwell)
// or mid-road (suspicious stationary pattern).
export function computeStopBehaviorScore(speedKmh: number, pos: LatLng): number {
  const isStationary = speedKmh < 3;
  if (!isStationary) return 90; // Moving — stop behavior not penalizing

  // Check distance to nearest stop
  let minStopDist = Infinity;
  for (const stop of ROUTE_104_STOPS) {
    const d = haversineMeters(pos, stop.position);
    if (d < minStopDist) minStopDist = d;
  }

  if (minStopDist <= STOP_PROXIMITY_M) {
    // Near a legitimate bus stop — could be temporary dwell
    return 75; // Possible: bus stopped at stop; or passenger waiting (penalty because stationary)
  }

  // Stationary far from stops — strongly penalize (person waiting elsewhere, red light < 60s is ok)
  if (minStopDist <= 80) return 55;
  return 25; // Stationary far from route — very suspicious
}

// ── Composite Reliability Score ──────────────────────────────
export function computeReliabilityScore(breakdown: Omit<ScoringBreakdown, 'reliabilityScore'>): number {
  const weighted =
    breakdown.speedScore         * WEIGHTS.speed +
    breakdown.directionScore     * WEIGHTS.direction +
    breakdown.routeAdherenceScore * WEIGHTS.adherence +
    breakdown.continuityScore    * WEIGHTS.continuity +
    breakdown.stopBehaviorScore  * WEIGHTS.stopBehavior;
  return Math.round(weighted);
}

// ── Direction Match Label ────────────────────────────────────
export function getDirectionMatch(heading: number, pos: LatLng, speed: number): DirectionMatch {
  if (speed < 3) return 'STATIONARY';
  const score = computeDirectionScore(heading, pos);
  if (score >= 75) return 'MATCH';
  if (score >= 40) return 'PARTIAL';
  return 'OPPOSITE';
}

// ── Status Classification ────────────────────────────────────
export function classifySignal(score: number): SignalStatus {
  if (score >= 70) return 'RELIABLE';
  if (score >= 45) return 'SUSPECT';
  return 'NOISE';
}

// ── Rejection Reason ─────────────────────────────────────────
export function getRejectionReason(signal: PassengerSignal): string | undefined {
  if (signal.status === 'RELIABLE') return undefined;
  const { scoring, speed, distanceFromRoute: dist } = signal;
  if (speed < 3) {
    if (dist < 60) return 'Stationary near bus stop — likely waiting passenger';
    return 'Stationary at non-stop location';
  }
  if (speed > 55) return 'Speed profile matches private vehicle (highway speed)';
  if (scoring.directionScore < 30) return 'Bearing deviates significantly from route corridor';
  if (scoring.routeAdherenceScore < 35) return 'Location outside route corridor (>120 m deviation)';
  if (speed < 8) return 'Pedestrian-range speed profile (<8 km/h)';
  if (scoring.continuityScore < 40) return 'Erratic movement pattern inconsistent with bus transit';
  return 'Low multi-factor reliability score';
}

// ── Full signal scoring function ─────────────────────────────
export function scoreSignal(signal: PassengerSignal): PassengerSignal {
  const dist = distanceFromRoute(signal.position);
  const speedScore = computeSpeedScore(signal.speed);
  const directionScore = computeDirectionScore(signal.heading, signal.position);
  const routeAdherenceScore = computeRouteAdherenceScore(dist);
  const continuityScore = computeContinuityScore(signal.positionHistory, signal.speedHistory);
  const stopBehaviorScore = computeStopBehaviorScore(signal.speed, signal.position);

  const partialBreakdown = {
    speedScore,
    directionScore,
    routeAdherenceScore,
    continuityScore,
    stopBehaviorScore,
  };

  const reliabilityScore = computeReliabilityScore(partialBreakdown);
  const scoring: ScoringBreakdown = { ...partialBreakdown, reliabilityScore };
  const status = classifySignal(reliabilityScore);
  const directionMatch = getDirectionMatch(signal.heading, signal.position, signal.speed);

  const scored: PassengerSignal = {
    ...signal,
    distanceFromRoute: dist,
    directionMatch,
    scoring,
    status,
  };

  scored.rejectionReason = getRejectionReason(scored);
  return scored;
}
