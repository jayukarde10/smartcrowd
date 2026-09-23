import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';

export default function LocationSelection() {
  const navigate = useNavigate();
  const [permissionState, setPermissionState] = useState<'prompt' | 'denied' | 'granted'>('prompt');

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setPermissionState('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setPermissionState('granted');
        // Navigate to home after granting permission
        navigate('/passenger/home');
      },
      () => {
        setPermissionState('denied');
      }
    );
  };

  const skipToHome = () => {
    navigate('/passenger/home');
  };

  return (
    <div style={{ 
      background: '#FFFFFF', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '24px'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        <div style={{ 
          width: '64px', height: '64px', 
          background: '#EEF2FF', 
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <MapPin size={32} color="#4F46E5" />
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '16px' }}>
          Where are you?
        </h1>
        
        {permissionState === 'denied' ? (
          <p style={{ fontSize: '16px', color: '#DC2626', lineHeight: 1.5, marginBottom: '40px' }}>
            Location permission is off.
          </p>
        ) : (
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.5, marginBottom: '40px' }}>
            Use your location to find nearby buses, stops and routes.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {permissionState !== 'denied' && (
            <button
              onClick={requestLocation}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                width: '100%',
                padding: '16px',
                background: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Navigation size={20} />
              Use My Location
            </button>
          )}

          <button
            onClick={skipToHome}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              width: '100%',
              padding: '16px',
              background: '#F8FAFC',
              color: '#0F172A',
              border: '2px solid #E2E8F0',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {permissionState === 'denied' ? 'Choose Location Manually' : 'Search Location Manually'}
          </button>
        </div>
        
      </div>
    </div>
  );
}
