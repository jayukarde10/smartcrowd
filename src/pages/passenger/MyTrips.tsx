import { Clock, MapPin, Bus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePassengerState } from '../../hooks/usePassengerState';

export default function MyTrips() {
  const navigate = useNavigate();
  const { recentSearches } = usePassengerState();

  const busTrips = recentSearches.filter(s => s.type === 'bus');
  const locationTrips = recentSearches.filter(s => s.type === 'location');

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ background: '#FFFFFF', padding: '24px 16px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '4px' }}>
          <ArrowLeft size={24} color="#0F172A" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>My Trips</h1>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {recentSearches.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <p style={{ fontSize: '15px' }}>No recent trips found.</p>
            </div>
          )}

          {/* Recent Buses Section */}
          {busTrips.length > 0 && (
            <section>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Recent Buses
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {busTrips.map(trip => (
                  <div 
                    key={trip.id}
                    onClick={() => navigate(`/passenger/bus/${trip.query.replace(/\D/g, '') || '104'}`)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1px solid #E2E8F0',
                      display: 'flex', alignItems: 'center', gap: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', background: '#EEF2FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bus size={20} color="#4F46E5" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                        {trip.query}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Tracked recently
                      </div>
                    </div>
                    <div style={{ color: '#94A3B8' }}><Clock size={16} /></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Locations Section */}
          {locationTrips.length > 0 && (
            <section>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Recent Destinations
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {locationTrips.map(trip => (
                  <div 
                    key={trip.id}
                    onClick={() => navigate('/passenger/search')}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1px solid #E2E8F0',
                      display: 'flex', alignItems: 'center', gap: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', background: '#F1F5F9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={20} color="#64748B" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                        {trip.query}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Searched recently
                      </div>
                    </div>
                    <div style={{ color: '#94A3B8' }}><Clock size={16} /></div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
