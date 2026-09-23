// ============================================================
// SMARTCROWD — Signal Scoring Engine (Server port)
// Ported from frontend src/engine/signalScoring.ts
// ============================================================

import type {
  PassengerSignal,
  ScoringBreakdown,
  SignalStatus,
  DirectionMatch,
  LatLng,
} from '../types.js';
import { ROUTE_104_POLYLINE, ROUTE_104_STOPS } from '../data/routes.js';

// ── Scoring Weights ──────────────────────────────────────────
const WEIGHTS = {
  speed:       0.20,
  direction:   0.20,
  adherence:   0.25,
  continuity:  0.20,
  stopBehavior:0.15,
} as const;

// ── Thresholds ───────────────────────────────────────────────
const BUS_SPEED_MIN  = 8;
const BUS_SPEED_MAX  = 55;
const BUS_SPEED_IDEAL_MIN = 12;
const BUS_SPEED_IDEAL_MAX = 50;
const ROUTE_CORRIDOR_M = 120;
const STOP_PROXIMITY_M = 50;

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

// ── Cross-track distance from point to segment ──────────────
function pointToSegmentDistance(p: LatLng, a: LatLng, b: LatLng): number {
  const d_pa = haversineMeters(p, a);
  const d_pb = haversineMeters(p, b);
  const d_ab = haversineMeters(a, b);
  if (d_ab === 0) return d_pa;
  const t = Math.max(0, Math.min(1, (d_pa**2 + d_ab**2 - d_pb**2) / (2 * d_pa * d_ab)));
  const closest: LatLng = {
    lat: a.lat + t * (b.lat - a.lat),
    lng: a.lng + t * (b.lng - a.lng),
  };
  return haversineMeters(p, closest);
}

// ── Minimum distance from signal to route polyline ──────────
export function distanceFromRoute(pos: LatLng, polyline: LatLng[] = ROUTE_104_POLYLINE): number {
  let minDist = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const d = pointToSegmentDistance(pos, polyline[i], polyline[i+1]);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

// ── 1. Speed Score ──────────────────────────────────────────
export function computeSpeedScore(speedKmh: number): number {
  if (speedKmh < 1) return 20;
  if (speedKmh < BUS_SPEED_MIN) return 30;
  if (speedKmh <= BUS_SPEED_IDEAL_MAX) {
    if (speedKmh >= 18 && speedKmh <= 40) return 100;
    if (speedKmh >= BUS_SPEED_IDEAL_MIN) return 90;
    return 80;
  }
  if (speedKmh <= BUS_SPEED_MAX) return 60;
  return 20;
}

// ── 2. Direction Score ──────────────────────────────────────
export function computeDirectionScore(heading: number, pos: LatLng, polyline: LatLng[] = ROUTE_104_POLYLINE): number {
  let minDist = Infinity;
  let bestBearing = 0;
  for (let i = 0; i < polyline.length - 1; i++) {
    const d = pointToSegmentDistance(pos, polyline[i], polyline[i+1]);
    if (d < minDist) {
      minDist = d;
      bestBearing = bearing(polyline[i], polyline[i+1]);
    }
  }
  let diff = Math.abs(heading - bestBearing) % 360;
  if (diff > 180) diff = 360 - diff;
  const score = Math.max(0, 100 - (diff / 180) * 100);
  return Math.round(score);
}

// ── 3. Route Adherence Score ────────────────────────────────
export function computeRouteAdherenceScore(distMeters: number): number {
  if (distMeters <= 25) return 100;
  if (distMeters <= 50) return 92;
  if (distMeters <= 80) return 80;
  if (distMeters <= ROUTE_CORRIDOR_M) return Math.round(80 - ((distMeters - 80) / 40) * 30);
  return Math.max(0, Math.round(50 - ((distMeters - ROUTE_CORRIDOR_M) / 100) * 50));
}

// ── 4. Movement Continuity Score ────────────────────────────
export function computeContinuityScore(
  posHistory: LatLng[],
  speedHistory: number[]
): number {
  if (posHistory.length < 2) return 50;
  const avgSpeed = speedHistory.reduce((a,b) => a+b, 0) / speedHistory.length;
  const variance = speedHistory.reduce((a,b) => a + (b-avgSpeed)**2, 0) / speedHistory.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev < 3) return 95;
  if (stdDev < 8) return 80;
  if (stdDev < 15) return 60;
  if (stdDev < 25) return 40;
  return 20;
}

// ── 5. Stop Behavior Score ──────────────────────────────────
export function computeStopBehaviorScore(speedKmh: number, pos: LatLng): number {
  const isStationary = speedKmh < 3;
  if (!isStationary) return 90;
  let minStopDist = Infinity;
  for (const stop of ROUTE_104_STOPS) {
    const d = haversineMeters(pos, stop.position);
    if (d < minStopDist) minStopDist = d;
  }
  if (minStopDist <= STOP_PROXIMITY_M) return 75;
  if (minStopDist <= 80) return 55;
  return 25;
}

// ── Composite Reliability Score ─────────────────────────────
export function computeReliabilityScore(breakdown: Omit<ScoringBreakdown, 'reliabilityScore'>): number {
  const weighted =
    breakdown.speedScore         * WEIGHTS.speed +
    breakdown.directionScore     * WEIGHTS.direction +
    breakdown.routeAdherenceScore * WEIGHTS.adherence +
    breakdown.continuityScore    * WEIGHTS.continuity +
    breakdown.stopBehaviorScore  * WEIGHTS.stopBehavior;
  return Math.round(weighted);
}

// ── Direction Match Label ───────────────────────────────────
export function getDirectionMatch(heading: number, pos: LatLng, speed: number): DirectionMatch {
  if (speed < 3) return 'STATIONARY';
  const score = computeDirectionScore(heading, pos);
  if (score >= 75) return 'MATCH';
  if (score >= 40) return 'PARTIAL';
  return 'OPPOSITE';
}

// ── Status Classification ───────────────────────────────────
export function classifySignal(score: number): SignalStatus {
  if (score >= 70) return 'RELIABLE';
  if (score >= 45) return 'SUSPECT';
  return 'NOISE';
}

// ── Rejection Reason ────────────────────────────────────────
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

// ── Full signal scoring function ────────────────────────────
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
