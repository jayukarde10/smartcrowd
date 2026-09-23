import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PassengerSignal, BusEstimate } from '../types';
import { ROUTE_104, ROUTE_104_STOPS } from '../data/routes';

interface BusMapProps {
  signals: PassengerSignal[];
  busEstimate: BusEstimate | null;
  height?: string;
  showLabels?: boolean;
  mode?: 'admin' | 'passenger';
  userLocation?: { lat: number, lng: number } | null;
}

// Fix default icon issue with Leaflet + bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makeCircleIcon(color: string, size: number, glow: string, pulse: boolean) {
  const anim = pulse ? `animation: ping-${color === '#22C55E' ? 'reliable' : 'noise'} 1.5s ease-out infinite;` : '';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative; width:${size}px; height:${size}px;">
        <div style="
          width:${size}px; height:${size}px;
          background:${color};
          border:2px solid rgba(255,255,255,0.8);
          border-radius:50%;
          box-shadow: 0 0 ${size}px ${color}88;
        "></div>
        ${pulse ? `<div style="
          position:absolute; inset:-4px;
          border-radius:50%;
          background:${color}44;
          ${anim}
        "></div>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}

function makeBusIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 44px; height: 44px;
        background: linear-gradient(135deg, #22D3EE, #2563EB);
        border: 2px solid rgba(34,211,238,0.9);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 24px rgba(34,211,238,0.7), 0 0 8px rgba(37,99,235,0.8);
        font-size: 22px;
        animation: bus-pulse 2.5s ease-in-out infinite;
        position: relative;
      ">
        🚌
        <div style="
          position:absolute; inset:-6px;
          border-radius:50%;
          background:rgba(34,211,238,0.15);
          animation: bus-pulse 2.5s ease-in-out infinite;
        "></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

function makeStopIcon(name: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="
          width:12px; height:12px;
          background:#F8FAFC;
          border:3px solid #7C3AED;
          border-radius:50%;
          box-shadow: 0 0 8px rgba(124,58,237,0.6);
        "></div>
        <div style="
          background:rgba(11,18,48,0.9);
          border:1px solid rgba(124,58,237,0.4);
          border-radius:6px;
          padding:2px 6px;
          font-size:10px;
          font-weight:600;
          color:#F8FAFC;
          margin-top:4px;
          white-space:nowrap;
          font-family: Inter, sans-serif;
        ">${name}</div>
      </div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 6],
  });
}

export default function BusMap({ signals, busEstimate, height = '100%', showLabels = true, mode = 'admin', userLocation }: BusMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const stopMarkersRef = useRef<L.Marker[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [19.223, 73.111],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

    // OpenStreetMap tiles (darkened via CSS filter)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Draw route polyline
    const routeCoords = ROUTE_104.polyline.map(p => [p.lat, p.lng] as [number, number]);
    const polyline = L.polyline(routeCoords, {
      color: '#7C3AED',
      weight: 4,
      opacity: 0.85,
      dashArray: undefined,
    }).addTo(map);
    routeLayerRef.current = polyline;
    
    // Fit map viewport to encompass the entire route (which includes all demo passengers)
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    // Add stop markers
    ROUTE_104_STOPS.forEach(stop => {
      const marker = L.marker([stop.position.lat, stop.position.lng], {
        icon: makeStopIcon(stop.name),
        zIndexOffset: 100,
      }).addTo(map);
      stopMarkersRef.current.push(marker);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update signal markers on each tick
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old signal/bus markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add signal markers (only in admin mode)
    if (mode === 'admin') {
      signals.forEach(signal => {
      const isReliable = signal.status === 'RELIABLE';
      const color = isReliable ? '#22C55E' : '#EF4444';
      const size = isReliable ? 14 : 12;

      const marker = L.marker([signal.position.lat, signal.position.lng], {
        icon: makeCircleIcon(color, size, color, isReliable),
        zIndexOffset: isReliable ? 200 : 50,
      });

      const statusLabel = isReliable ? '✅ RELIABLE' : '❌ NOISE';
      const reasonHtml = signal.rejectionReason
        ? `<div style="color:#EF4444;font-size:11px;margin-top:4px;">${signal.rejectionReason}</div>`
        : '';

      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:200px;">
          <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#F8FAFC;">${signal.label}</div>
          <div style="color:${isReliable ? '#22C55E' : '#EF4444'};font-weight:600;font-size:12px;">${statusLabel}</div>
          ${reasonHtml}
          <div style="margin-top:8px;font-size:12px;color:#94A3B8;">
            <div>Speed: <b style="color:#F8FAFC">${signal.speed.toFixed(1)} km/h</b></div>
            <div>Direction: <b style="color:#F8FAFC">${signal.directionMatch}</b></div>
            <div>Route Adherence: <b style="color:#F8FAFC">${signal.scoring.routeAdherenceScore}%</b></div>
            <div>Reliability Score: <b style="color:#A855F7">${signal.scoring.reliabilityScore}%</b></div>
          </div>
        </div>
      `, { className: 'smartcrowd-popup' });

      marker.addTo(map);
      markersRef.current.push(marker);

      // Label above marker
      if (showLabels) {
        const label = L.divIcon({
          className: '',
          html: `<div style="
            background: rgba(11,18,48,0.9);
            border: 1px solid ${color}66;
            border-radius: 4px;
            padding: 1px 5px;
            font-size: 10px;
            font-weight: 700;
            color: ${color};
            font-family: Inter, sans-serif;
            white-space: nowrap;
          ">${signal.label}</div>`,
          iconSize: [24, 16],
          iconAnchor: [12, 24],
        });
        const labelMarker = L.marker([signal.position.lat + 0.0002, signal.position.lng], {
          icon: label,
          interactive: false,
        }).addTo(map);
        markersRef.current.push(labelMarker);
      }
    });
    }

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            width: 16px; height: 16px;
            background: #3B82F6;
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 12px rgba(59,130,246,0.6);
            position: relative;
          ">
            <div style="
              position: absolute; inset: -6px;
              border-radius: 50%;
              background: rgba(59,130,246,0.3);
              animation: ping-reliable 2s ease-out infinite;
            "></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 2000,
      }).addTo(map);
      markersRef.current.push(userMarker);
    }

    // Add bus position marker
    if (busEstimate) {
      const busMarker = L.marker([busEstimate.position.lat, busEstimate.position.lng], {
        icon: makeBusIcon(),
        zIndexOffset: 1000,
      });
      busMarker.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:220px;">
          <div style="font-weight:800;font-size:15px;color:#22D3EE;margin-bottom:8px;">🚌 Bus 104 — Estimated Position</div>
          <div style="font-size:12px;color:#94A3B8;margin-bottom:6px;">
            Based on crowd consensus from ${busEstimate.reliableSignalCount} reliable signal${busEstimate.reliableSignalCount !== 1 ? 's' : ''}
          </div>
          <div style="font-size:12px;color:#F8FAFC;">
            <div>ETA: <b style="color:#22C55E">${busEstimate.etaAvailable ? busEstimate.etaMinutes + ' min' : 'Unavailable'}</b></div>
            <div>Confidence: <b style="color:#A855F7">${busEstimate.confidence}%</b></div>
            <div>Avg Speed: <b style="color:#F8FAFC">${busEstimate.avgSpeed} km/h</b></div>
          </div>
        </div>
      `, { className: 'smartcrowd-popup' });
      busMarker.addTo(map);
      markersRef.current.push(busMarker);

      // Accuracy circle
      const confidenceRadius = Math.max(30, 150 - busEstimate.confidence);
      const circle = L.circle([busEstimate.position.lat, busEstimate.position.lng], {
        radius: confidenceRadius,
        color: '#22D3EE',
        fillColor: '#22D3EE',
        fillOpacity: 0.06,
        weight: 1,
        opacity: 0.4,
        dashArray: '4 4',
      }).addTo(map);
      markersRef.current.push(circle);
    }
  }, [signals, busEstimate, showLabels, mode, userLocation]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}
      />
      
      {/* Live Estimate Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none' // Let clicks pass through to map
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#16A34A',
          animation: 'pulse-badge 2s infinite'
        }}></div>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#16A34A',
          letterSpacing: '0.05em'
        }}>LIVE ESTIMATE</span>
      </div>
    </div>
  );
}
