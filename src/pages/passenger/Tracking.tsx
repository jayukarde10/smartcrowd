import { useLocation, useNavigate } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import BusMap from '../../components/BusMap';
import { ArrowLeft, Navigation, ShieldCheck, Bus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ROUTE_104_STOPS } from '../../data/routes';
import { usePassengerState } from '../../hooks/usePassengerState';

export default function PassengerTracking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signals, busEstimate } = useSimulation();
  const { profile } = usePassengerState();
  
  // Persist state during tracking flow
  const [isSharing] = useState(location.state?.isSharing ?? false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  
  // Generate a consistent session ID for this user's tracking session
  const sessionIdRef = useRef(`passenger-${profile.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now().toString().slice(-4)}`);

  useEffect(() => {
    let lastPost = 0;
    if (navigator.geolocation) {
      // Start watching user's real location
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          
          if (isSharing && Date.now() - lastPost > 2000) {
             lastPost = Date.now();
             const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
             fetch(`${API_URL}/api/signals`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                     signals: [{
                         id: sessionIdRef.current,
                         sessionId: sessionIdRef.current,
                         routeId: 'route-104',
                         label: profile.name || 'Passenger',
                         role: 'PASSENGER',
                         position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
                         timestamp: Date.now(),
                         speed: (pos.coords.speed || 0) * 3.6, // convert m/s to km/h
                         heading: pos.coords.heading || 0,
                     }]
                 })
             }).catch(err => console.error("Failed to post real signal", err));
          }
        },
        (err) => {
          console.warn('Passenger location not available:', err.message);
          setUserLocation(null);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isSharing]);

  const busRoute = '104';
  const destination = 'Dombivli Station';
  
  // Determine current stop dynamically based on simulation or default to 90 Feet Road
  const currentStopIndex = 1; // 90 Feet Road is index 1

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
      
      {/* Map Area - Fills entire background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <BusMap 
          signals={signals} 
          busEstimate={busEstimate} 
          mode="passenger" 
          userLocation={userLocation}
          height="100%" 
        />
      </div>

      {/* Floating Back Button */}
      <button onClick={() => navigate(-1)} style={{
        position: 'absolute', top: '16px', left: '16px', zIndex: 10,
        width: '44px', height: '44px',
        background: '#FFFFFF', border: 'none', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer'
      }}>
        <ArrowLeft size={24} color="#0F172A" />
      </button>

      {/* Bottom Sheet - Overlaps the map */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#FFFFFF',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px 20px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
        zIndex: 10,
        maxHeight: '60%', // Don't cover entire map
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {busRoute}
            </div>
            <div style={{ fontSize: '14px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
              To {destination}
            </div>
          </div>
          <div style={{ background: '#FEF3C7', color: '#B45309', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
            Direct
          </div>
        </div>

        {/* Contribution Status */}
        {isSharing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', padding: '10px 16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #BBF7D0' }}>
            <ShieldCheck size={16} color="#16A34A" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#16A34A' }}>Helping improve this bus estimate</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F1F5F9', padding: '10px 16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
            <Navigation size={16} color="#64748B" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Tracking bus</span>
          </div>
        )}

        {/* Vertical Stop Timeline */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', paddingBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            {/* The vertical line behind the dots */}
            <div style={{ position: 'absolute', top: '16px', bottom: '24px', left: '11px', width: '2px', background: '#E2E8F0', zIndex: 0 }}></div>

            {ROUTE_104_STOPS.map((stop, index) => {
              const isCurrent = index === currentStopIndex;
              const isPast = index < currentStopIndex;
              
              return (
                <div key={stop.id} style={{ display: 'flex', gap: '16px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                  
                  {/* Timeline Dot */}
                  <div style={{ 
                    width: '24px', height: '24px', 
                    background: '#FFFFFF', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '12px', height: '12px',
                      borderRadius: '50%',
                      background: isCurrent ? '#0F172A' : '#FFFFFF',
                      border: isCurrent ? '2px solid #0F172A' : '2px solid #94A3B8',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(15, 23, 42, 0.1)' : 'none',
                    }}></div>
                  </div>

                  {/* Stop Information */}
                  <div style={{ flex: 1, paddingTop: '2px' }}>
                    
                    {isCurrent && (
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '6px' }}>
                        Nearest bus stop
                      </div>
                    )}
                    
                    <div style={{ fontSize: '15px', fontWeight: isCurrent ? 700 : 500, color: isPast ? '#94A3B8' : '#0F172A' }}>
                      {stop.name}
                    </div>

                    {/* Active Bus Card (attached to current stop) */}
                    {isCurrent && (
                      <div style={{ 
                        marginTop: '12px',
                        background: '#FFFFFF', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '12px', 
                        padding: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex', flexDirection: 'column', gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Bus size={16} color="#0F172A" />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{busRoute}</span>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Navigation size={14} />
                          In {busEstimate?.etaAvailable ? busEstimate.etaMinutes : '--'} min
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
