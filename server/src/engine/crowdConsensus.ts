// ============================================================
// SMARTCROWD — Crowd Consensus Engine (Server port)
// Ported from frontend src/engine/crowdConsensus.ts
// ============================================================

import type { PassengerSignal, BusEstimate, LatLng, ConfidenceLevel } from '../types.js';
import { ROUTE_104_STOPS } from '../data/routes.js';
import { haversineMeters } from './signalScoring.js';

// ── Weighted Centroid ───────────────────────────────────────
function weightedCentroid(signals: PassengerSignal[]): LatLng {
  const totalWeight = signals.reduce((s, p) => s + p.scoring.reliabilityScore, 0);
  const lat = signals.reduce((s, p) => s + p.position.lat * p.scoring.reliabilityScore, 0) / totalWeight;
  const lng = signals.reduce((s, p) => s + p.position.lng * p.scoring.reliabilityScore, 0) / totalWeight;
  return { lat, lng };
}

// ── Cluster Cohesion ────────────────────────────────────────
function clusterCohesion(signals: PassengerSignal[], centroid: LatLng): number {
  if (signals.length === 1) return 0.6;
  const avgDist = signals.reduce((s, p) => s + haversineMeters(p.position, centroid), 0) / signals.length;
  return Math.max(0.3, Math.min(1.0, 1 - avgDist / 200));
}

// ── Find nearest stop ───────────────────────────────────────
function nearestStop(pos: LatLng) {
  return ROUTE_104_STOPS.reduce((best, stop) => {
    const d = haversineMeters(pos, stop.position);
    const bd = haversineMeters(pos, best.position);
    return d < bd ? stop : best;
  }, ROUTE_104_STOPS[0]);
}

// ── Find next stop ──────────────────────────────────────────
function nextStop(currentStopId: string) {
  const idx = ROUTE_104_STOPS.findIndex(s => s.id === currentStopId);
  return ROUTE_104_STOPS[Math.min(idx + 1, ROUTE_104_STOPS.length - 1)];
}

// ── Confidence Level ────────────────────────────────────────
function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 75) return 'HIGH';
  if (confidence >= 50) return 'MEDIUM';
  if (confidence >= 25) return 'LOW';
  return 'INSUFFICIENT';
}

// ── Crowd Consensus Label ───────────────────────────────────
function getCrowdConsensus(reliableCount: number, cohesion: number): 'High' | 'Medium' | 'Low' | 'None' {
  if (reliableCount === 0) return 'None';
  if (reliableCount >= 3 && cohesion > 0.7) return 'High';
  if (reliableCount >= 2) return 'Medium';
  return 'Low';
}

// ── ETA Calculation ─────────────────────────────────────────
function calculateETA(busPos: LatLng, nextStopPos: LatLng, avgSpeedKmh: number): { etaMinutes: number; available: boolean } {
  if (avgSpeedKmh < 2) return { etaMinutes: 0, available: false };
  const distMeters = haversineMeters(busPos, nextStopPos);
  const speedMs = (avgSpeedKmh * 1000) / 3600;
  const etaSeconds = distMeters / speedMs + 30;
  return { etaMinutes: Math.max(1, Math.round(etaSeconds / 60)), available: true };
}

// ── Main Consensus Function ─────────────────────────────────
export function computeBusEstimate(signals: PassengerSignal[]): BusEstimate {
  const reliable = signals.filter(s => s.status === 'RELIABLE');
  const rejected = signals.filter(s => s.status !== 'RELIABLE');
  const now = Date.now();

  if (reliable.length === 0) {
    const firstStop = ROUTE_104_STOPS[0];
    return {
      routeId: 'route-104',
      position: firstStop.position,
      currentStopId: firstStop.id,
      nextStopId: ROUTE_104_STOPS[1].id,
      etaMinutes: 0,
      etaAvailable: false,
      confidence: 0,
      confidenceLevel: 'INSUFFICIENT',
      reliableSignalCount: 0,
      rejectedSignalCount: rejected.length,
      avgSpeed: 0,
      directionAgreement: 0,
      routeAdherence: 0,
      movementContinuity: 0,
      crowdConsensus: 'None',
      timestamp: now,
    };
  }

  const centroid = weightedCentroid(reliable);
  const cohesion = clusterCohesion(reliable, centroid);
  const current = nearestStop(centroid);
  const next = nextStop(current.id);

  const avgSpeed = reliable.reduce((s, p) => s + p.speed, 0) / reliable.length;
  const avgDir = reliable.reduce((s, p) => s + p.scoring.directionScore, 0) / reliable.length;
  const avgAdhere = reliable.reduce((s, p) => s + p.scoring.routeAdherenceScore, 0) / reliable.length;
  const avgCont = reliable.reduce((s, p) => s + p.scoring.continuityScore, 0) / reliable.length;

  const baseScore = reliable.reduce((s, p) => s + p.scoring.reliabilityScore, 0) / reliable.length;
  const countFactor = Math.min(1.0, reliable.length / 3);
  const confidence = Math.round(baseScore * countFactor * cohesion);

  const { etaMinutes, available: etaAvailable } = calculateETA(centroid, next.position, avgSpeed);

  return {
    routeId: 'route-104',
    position: centroid,
    currentStopId: current.id,
    nextStopId: next.id,
    etaMinutes,
    etaAvailable,
    confidence: Math.min(99, confidence),
    confidenceLevel: getConfidenceLevel(confidence),
    reliableSignalCount: reliable.length,
    rejectedSignalCount: rejected.length,
    avgSpeed: Math.round(avgSpeed),
    directionAgreement: Math.round(avgDir),
    routeAdherence: Math.round(avgAdhere),
    movementContinuity: Math.round(avgCont),
    crowdConsensus: getCrowdConsensus(reliable.length, cohesion),
    timestamp: now,
  };
}
