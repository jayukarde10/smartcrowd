// ============================================================
// SMARTCROWD — Deterministic Simulation Engine
// CX0403: Generates realistic kinematic data for 6 personas
//
// P1, P2, P3 — Actual bus passengers (follow Route 104)
// P4         — Person waiting at 90 Feet Road stop (stationary)
// P5         — Person in nearby car (parallel road, off-route)
// P6         — Pedestrian (slow movement, near route)
// ============================================================

import type { PassengerSignal, ScenarioType } from '../types';
import { ROUTE_104_POLYLINE, ROUTE_104_STOPS } from '../data/routes';
import { scoreSignal, bearing } from './signalScoring';


// Simple ID gen without UUID dependency
let _id = 0;
function genId() { return `sess_${++_id}_${Math.random().toString(36).slice(2, 7)}`; }

// ── Route interpolation ──────────────────────────────────────
// Returns a position along the polyline at fraction t (0–1)
function interpolatePolyline(t: number) {
  const poly = ROUTE_104_POLYLINE;
  const totalSegs = poly.length - 1;
  const scaledT = t * totalSegs;
  const segIndex = Math.min(Math.floor(scaledT), totalSegs - 1);
  const segT = scaledT - segIndex;
  const a = poly[segIndex];
  const b = poly[segIndex + 1];
  return {
    lat: a.lat + segT * (b.lat - a.lat),
    lng: a.lng + segT * (b.lng - a.lng),
  };
}

// ── Add noise to position (simulates GPS jitter) ────────────
function addGpsJitter(lat: number, lng: number, radiusM = 8) {
  const r = radiusM / 111320;
  const angle = Math.random() * 2 * Math.PI;
  return { lat: lat + r * Math.cos(angle), lng: lng + r * Math.sin(angle) };
}

// ── Persona definitions ──────────────────────────────────────
interface PersonaConfig {
  id: string;
  label: string;
  role: PassengerSignal['role'];
  description: string;
  baseSpeed: number;  // km/h (approximate)
}

const PERSONAS: PersonaConfig[] = [
  { id: 'P1', label: 'P1', role: 'PASSENGER',  description: 'Passenger on Bus 104', baseSpeed: 30 },
  { id: 'P2', label: 'P2', role: 'PASSENGER',  description: 'Passenger on Bus 104', baseSpeed: 28 },
  { id: 'P3', label: 'P3', role: 'PASSENGER',  description: 'Passenger on Bus 104', baseSpeed: 32 },
  { id: 'P4', label: 'P4', role: 'WAITING',    description: 'Waiting at 90 Feet Road Stop', baseSpeed: 0 },
  { id: 'P5', label: 'P5', role: 'CAR',        description: 'Person in nearby car', baseSpeed: 40 },
  { id: 'P6', label: 'P6', role: 'PEDESTRIAN', description: 'Pedestrian near route', baseSpeed: 4 },
];

// ── Simulation State ─────────────────────────────────────────
let busT = 0.15; // Starting position along route (fraction 0–1)
const HISTORY_LEN = 8;

// Per-persona history
const posHistories: Record<string, Array<{lat: number; lng: number}>> = {};
const speedHistories: Record<string, number[]> = {};
const sessionIds: Record<string, string> = {};

function initHistory(id: string) {
  if (!posHistories[id]) posHistories[id] = [];
  if (!speedHistories[id]) speedHistories[id] = [];
  if (!sessionIds[id]) sessionIds[id] = genId();
}

// ── Generate one tick of simulation data ────────────────────
export function simulationTick(scenario: ScenarioType = 'NORMAL'): PassengerSignal[] {
  // Advance bus along route
  const busSpeed = 30; // km/h reference
  // Advance bus ~30m per tick (assuming ~1s tick simulating 3s real time)
  const totalRouteDistance = 2800; // approximate meters for Route 104
  busT = Math.min(0.95, busT + (busSpeed / 3.6 * 3) / totalRouteDistance);

  return PERSONAS.map((persona) => {
    initHistory(persona.id);

    let pos: { lat: number; lng: number };
    let speed: number;
    let heading: number;

    if (scenario === 'LOW_SIGNALS' && ['P2', 'P3'].includes(persona.id)) {
      // In LOW_SIGNALS scenario, P2 and P3 have poor signal / are absent
      speed = 0;
      pos = interpolatePolyline(busT);
      heading = 0;
    } else {
      switch (persona.role) {
        case 'PASSENGER': {
          // Follows the bus closely with small GPS jitter
          const rawPos = interpolatePolyline(busT);
          pos = addGpsJitter(rawPos.lat, rawPos.lng, 6);
          speed = persona.baseSpeed + (Math.random() - 0.5) * 6;
          const routeHead = busT < 0.99 ? bearing(
            ROUTE_104_POLYLINE[Math.floor(busT * (ROUTE_104_POLYLINE.length-1))],
            ROUTE_104_POLYLINE[Math.min(Math.floor(busT * (ROUTE_104_POLYLINE.length-1)) + 1, ROUTE_104_POLYLINE.length-1)]
          ) : 90;
          heading = routeHead + (Math.random() - 0.5) * 15; // small heading jitter
          break;
        }
        case 'WAITING': {
          // Stays near 90 Feet Road stop
          const stopPos = ROUTE_104_STOPS[1].position; // 90 Feet Road
          pos = addGpsJitter(stopPos.lat, stopPos.lng, 8);
          speed = Math.random() < 0.05 ? 1.5 : 0.2; // almost always stationary
          heading = Math.random() * 360;
          break;
        }
        case 'CAR': {
          // Parallel road: offset from route polyline, heading ~45° off
          const rawPos = interpolatePolyline(busT * 0.9 + 0.05); // slightly behind bus
          pos = { lat: rawPos.lat - 0.003, lng: rawPos.lng + 0.002 }; // offset ~300m from route
          speed = persona.baseSpeed + (Math.random() - 0.5) * 10;
          heading = 135 + (Math.random() - 0.5) * 30; // heading mostly south-east (off-route)
          break;
        }
        case 'PEDESTRIAN': {
          // Slow movement in rough direction of route
          const basePos = interpolatePolyline(0.3); // stays near middle of route
          pos = addGpsJitter(basePos.lat + 0.0005, basePos.lng + 0.0002, 20);
          speed = 3.5 + (Math.random() - 0.5) * 1.5;
          heading = 45 + (Math.random() - 0.5) * 60; // walking roughly toward route but slow
          break;
        }
      }
    }

    // Update histories
    posHistories[persona.id] = [pos, ...posHistories[persona.id]].slice(0, HISTORY_LEN);
    speedHistories[persona.id] = [speed!, ...speedHistories[persona.id]].slice(0, HISTORY_LEN);

    const raw: PassengerSignal = {
      id: persona.id,
      sessionId: sessionIds[persona.id],
      routeId: 'route-104',
      label: persona.label,
      role: persona.role,
      position: pos!,
      timestamp: Date.now(),
      speed: Math.max(0, Math.round((speed!) * 10) / 10),
      heading: ((heading!) + 360) % 360,
      nearestStopId: 'stop-90feet', // will be refined in scoring
      distanceFromRoute: 0,
      directionMatch: 'MATCH',  // will be overwritten by scoreSignal()
      scoring: {
        speedScore: 0,
        directionScore: 0,
        routeAdherenceScore: 0,
        continuityScore: 0,
        stopBehaviorScore: 0,
        reliabilityScore: 0,
      },
      status: 'UNKNOWN',
      positionHistory: posHistories[persona.id],
      speedHistory: speedHistories[persona.id],
    };

    return scoreSignal(raw);
  });
}

// ── Reset simulation state ───────────────────────────────────
export function resetSimulation() {
  busT = 0.15;
  _id = 0;
  Object.keys(posHistories).forEach(k => delete posHistories[k]);
  Object.keys(speedHistories).forEach(k => delete speedHistories[k]);
  Object.keys(sessionIds).forEach(k => delete sessionIds[k]);
}
