import { useNavigate } from 'react-router-dom';
import { Search, MapPin, User, Bus, Clock, Navigation } from 'lucide-react';
import { usePassengerState } from '../../hooks/usePassengerState';

export default function PassengerHome() {
  const navigate = useNavigate();
  const { profile, savedPlaces, recentSearches } = usePassengerState();

  return (
    <div style={{ padding: '24px 16px', background: '#F8FAFC', minHeight: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            onClick={() => navigate('/passenger/account')}
            style={{
              width: '40px', height: '40px',
              background: '#0F172A',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer'
            }}
          >
            <User size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Welcome back,</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {profile.name}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div 
        onClick={() => navigate('/passenger/search')}
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          cursor: 'pointer'
        }}
      >
        <Search size={20} color="#4F46E5" />
        <span style={{ fontSize: '15px', color: '#94A3B8', fontWeight: 500 }}>Find a bus or destination...</span>
      </div>

      {/* Saved Places */}
      {savedPlaces.length > 0 && (
        <section>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Saved Places</div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {savedPlaces.map((place) => (
              <div key={place.id} onClick={() => navigate('/passenger/search')} style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 16px',
                minWidth: '140px',
                display: 'flex', flexDirection: 'column', gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                cursor: 'pointer'
              }}>
                <MapPin size={20} color="#4F46E5" />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{place.label}</div>
                <div style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.address}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nearby Buses */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Nearby Buses</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div 
            onClick={() => navigate('/passenger/bus/104')}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '48px', height: '48px', background: '#EEF2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bus size={24} color="#4F46E5" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Bus 104</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>7 min</span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Kalyan <MapPin size={12} /> Dombivli
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Recent Searches</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentSearches.slice(0, 3).map((search) => (
              <div key={search.id} onClick={() => navigate(search.type === 'bus' ? `/passenger/bus/${search.query.replace(/\D/g, '') || '104'}` : `/passenger/search`)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '8px' }}>
                  {search.type === 'bus' ? <Bus size={16} color="#64748B" /> : <MapPin size={16} color="#64748B" />}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{search.query}</div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
