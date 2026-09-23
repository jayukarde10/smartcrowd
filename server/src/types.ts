// ============================================================
// SMARTCROWD — Server Types (mirrored from frontend src/types)
// These must stay in sync with the frontend contracts.
// ============================================================

export type SignalStatus = 'RELIABLE' | 'SUSPECT' | 'NOISE' | 'UNKNOWN';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';
export type DirectionMatch = 'MATCH' | 'PARTIAL' | 'OPPOSITE' | 'STATIONARY';
export type SimulatorRole = 'PASSENGER' | 'WAITING' | 'CAR' | 'PEDESTRIAN';
export type ScenarioType = 'NORMAL' | 'LOW_SIGNALS' | 'NOISY_DATA' | 'CONFLICTING';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BusStop {
  id: string;
  name: string;
  position: LatLng;
  sequenceIndex: number;
}

export interface TransitRoute {
  id: string;
  name: string;
  shortName: string;
  stops: BusStop[];
  polyline: LatLng[];
  color: string;
}

export interface ScoringBreakdown {
  speedScore: number;
  directionScore: number;
  routeAdherenceScore: number;
  continuityScore: number;
  stopBehaviorScore: number;
  reliabilityScore: number;
}

export interface PassengerSignal {
  id: string;
  sessionId: string;
  routeId: string;
  label: string;
  role: SimulatorRole;
  position: LatLng;
  timestamp: number;
  speed: number;
  heading: number;
  nearestStopId: string;
  distanceFromRoute: number;
  directionMatch: DirectionMatch;
  scoring: ScoringBreakdown;
  status: SignalStatus;
  rejectionReason?: string;
  positionHistory: LatLng[];
  speedHistory: number[];
}

export interface BusEstimate {
  routeId: string;
  position: LatLng;
  currentStopId: string;
  nextStopId: string;
  etaMinutes: number;
  etaAvailable: boolean;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  reliableSignalCount: number;
  rejectedSignalCount: number;
  avgSpeed: number;
  directionAgreement: number;
  routeAdherence: number;
  movementContinuity: number;
  crowdConsensus: 'High' | 'Medium' | 'Low' | 'None';
  timestamp: number;
}

export type ProcessingPhase =
  | 'IDLE'
  | 'COLLECTING'
  | 'SPEED_ANALYSIS'
  | 'DIRECTION_ANALYSIS'
  | 'ROUTE_ADHERENCE'
  | 'CONTINUITY_CHECK'
  | 'STOP_BEHAVIOR'
  | 'SCORING'
  | 'FILTERING'
  | 'CLUSTERING'
  | 'CONSENSUS'
  | 'ESTIMATING'
  | 'ETA'
  | 'COMPLETE';
