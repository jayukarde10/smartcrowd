import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bus, MapPin, Search as SearchIcon, X, Clock } from 'lucide-react';
import { usePassengerState } from '../../hooks/usePassengerState';

const MOCK_RESULTS = [
  { id: '104', type: 'bus' as const, title: 'Bus 104', subtext: 'Kalyan Station - Dombivli Station', tag: 'Direct' },
  { id: '104-rev', type: 'bus' as const, title: 'Bus 104', subtext: 'Dombivli Station - Kalyan Station', tag: 'Direct' },
  { id: 'kalyan', type: 'location' as const, title: 'Kalyan Station', subtext: 'Kalyan West' },
];

export default function PassengerSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { recentSearches, addRecentSearch, clearRecentSearches } = usePassengerState();

  const handleSelect = (res: { id: string, type: 'bus' | 'location', title: string }) => {
    addRecentSearch({ query: res.title, type: res.type });
    if (res.type === 'bus') {
      navigate(`/passenger/bus/${res.id}`);
    } else {
      // For location, just go back to home for now in prototype
      navigate('/passenger/home');
    }
  };

  const handleSelectRecent = (search: { query: string, type: 'bus' | 'location' }) => {
    if (search.type === 'bus') {
      const busId = search.query.replace(/\D/g, '') || '104';
      navigate(`/passenger/bus/${busId}`);
    } else {
      navigate('/passenger/home');
    }
  };

  const showResults = query.length > 0;

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header & Input */}
      <div style={{ background: '#FFFFFF', padding: '24px 16px 16px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={24} color="#0F172A" />
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '12px', padding: '0 12px' }}>
            <SearchIcon size={20} color="#64748B" />
            <input
              type="text"
              placeholder="Enter destination or bus number"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 12px',
                fontSize: '16px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#0F172A',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex' }}>
                <X size={16} color="#64748B" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {showResults ? (
          /* Search Results */
          <div style={{ display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
            {MOCK_RESULTS.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.id.includes(query)).map(res => (
              <div key={res.id} onClick={() => handleSelect(res)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {res.type === 'bus' ? <Bus size={20} color="#4F46E5" /> : <MapPin size={20} color="#4F46E5" />}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {res.title}
                    {res.tag && <span style={{ fontSize: '10px', fontWeight: 700, color: '#B45309', background: '#FEF3C7', padding: '2px 6px', borderRadius: '4px' }}>{res.tag}</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{res.subtext}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Recent Searches */
          <div style={{ padding: '24px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Recent Searches</h3>
              {recentSearches.length > 0 && (
                <button onClick={clearRecentSearches} style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
              )}
            </div>
            
            {recentSearches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentSearches.map(search => (
                  <div key={search.id} onClick={() => handleSelectRecent(search)} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                    <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '8px' }}>
                      <Clock size={16} color="#64748B" />
                    </div>
                    <div style={{ flex: 1, fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>{search.query}</div>
                    <ArrowLeft size={16} color="#CBD5E1" style={{ transform: 'rotate(135deg)' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                <SearchIcon size={48} color="#E2E8F0" style={{ marginBottom: '16px' }} />
                <p style={{ fontSize: '15px' }}>No recent searches.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
