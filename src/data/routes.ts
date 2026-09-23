// ============================================================
// SMARTCROWD — Route 104 Seed Data
// Demo route: Kalyan Station → 90 Feet Road → Gharda Circle
//             → MIDC Dombivli → Dombivli Station
// Uses realistic lat/lng coordinates (Kalyan-Dombivli)
// ============================================================
import type { TransitRoute, BusStop, LatLng } from '../types';

// Route polyline — connected road-following path
export const ROUTE_104_POLYLINE: LatLng[] = [
  { lat: 19.2384, lng: 73.1306 }, // Kalyan Station
  { lat: 19.2350, lng: 73.1250 },
  { lat: 19.2300, lng: 73.1180 },
  { lat: 19.2275, lng: 73.1098 }, // 90 Feet Road
  { lat: 19.2220, lng: 73.1020 },
  { lat: 19.2155, lng: 73.0950 }, // Gharda Circle
  { lat: 19.2120, lng: 73.0920 },
  { lat: 19.2100, lng: 73.0900 }, // MIDC Dombivli
  { lat: 19.2140, lng: 73.0880 },
  { lat: 19.2183, lng: 73.0867 }, // Dombivli Station
];

export const ROUTE_104_STOPS: BusStop[] = [
  {
    id: 'stop-kalyan',
    name: 'Kalyan Station',
    position: { lat: 19.2384, lng: 73.1306 },
    sequenceIndex: 0,
  },
  {
    id: 'stop-90feet',
    name: '90 Feet Road',
    position: { lat: 19.2275, lng: 73.1098 },
    sequenceIndex: 1,
  },
  {
    id: 'stop-gharda',
    name: 'Gharda Circle',
    position: { lat: 19.2155, lng: 73.0950 },
    sequenceIndex: 2,
  },
  {
    id: 'stop-midc',
    name: 'MIDC Dombivli',
    position: { lat: 19.2100, lng: 73.0900 },
    sequenceIndex: 3,
  },
  {
    id: 'stop-dombivli',
    name: 'Dombivli Station',
    position: { lat: 19.2183, lng: 73.0867 },
    sequenceIndex: 4,
  },
];

export const ROUTE_104: TransitRoute = {
  id: 'route-104',
  name: 'Route 104 — SIMULATED',
  shortName: '104',
  stops: ROUTE_104_STOPS,
  polyline: ROUTE_104_POLYLINE,
  color: '#7C3AED',
};

export const ALL_ROUTES: TransitRoute[] = [ROUTE_104];
