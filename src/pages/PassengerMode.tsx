import { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Shield, Radio, Navigation, TrendingUp, Eye, EyeOff } from 'lucide-react';

export default function PassengerMode() {
  const { signals } = useSimulation();
  const [sharing, setSharing] = useState(true);

  // Use P1 as the "self" passenger for demo
  const self = signals.find(s => s.id === 'P1');

  const speed = self?.speed ?? 32;
  const direction = self?.directionMatch ?? 'MATCH';
  const reliability = self?.scoring.reliabilityScore ?? 91;
  const status = self?.status ?? 'RELIABLE';

  return (
    <div style={{
      padding: '48px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100%',
    }}>
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Contribution Mode
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A', lineHeight: 1.1, marginBottom: '12px' }}>
            Passenger Sensor
          </h1>
          <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6 }}>
            Your smartphone is acting as an anonymous sensor for Route 104.
          </p>
        </div>

        {/* Big Action Button (Dominant Action) */}
        <button
          onClick={() => setSharing(!sharing)}
          style={{
            width: '100%',
            padding: '20px',
            background: sharing ? '#16A34A' : '#0F172A',
            border: 'none',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: sharing ? '0 12px 24px -8px rgba(22, 163, 74, 0.4)' : '0 12px 24px -8px rgba(15, 23, 42, 0.4)',
            marginBottom: '40px',
          }}
        >
          <Radio size={24} color="#FFFFFF" style={{ animation: sharing ? 'pulse-badge 2s infinite' : 'none' }} />
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            {sharing ? 'STOP SHARING' : 'START SHARING'}
          </span>
        </button>

        {/* Signal metrics list (Clean unboxed rows) */}
        {sharing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <TrendingUp size={20} color="#0F172A" />
                <span style={{ fontSize: '16px', color: '#0F172A', fontWeight: 600 }}>Speed Profile</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#2563EB' }}>{speed.toFixed(1)} km/h</div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>Bus speed ✓</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Navigation size={20} color="#0F172A" />
                <span style={{ fontSize: '16px', color: '#0F172A', fontWeight: 600 }}>Direction Match</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '16px', color: direction === 'MATCH' ? '#16A34A' : '#D97706' }}>{direction}</div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>To Dombivli Station</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Shield size={20} color="#0F172A" />
                <span style={{ fontSize: '16px', color: '#0F172A', fontWeight: 600 }}>Data Reliability</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '16px', color: status === 'RELIABLE' ? '#16A34A' : '#DC2626' }}>{reliability}%</div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>{status === 'RELIABLE' ? 'Contributing to consensus' : 'Filtered out'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B', fontSize: '16px', lineHeight: 1.6, marginBottom: '48px' }}>
            Location sharing is paused.
            <br />Tap above to resume contributing.
          </div>
        )}

        {/* Privacy statement */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Eye size={20} color="#0F172A" />
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              Privacy & Security
            </span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              'Identity is never collected or stored.',
              'Data is strictly anonymous and aggregated.',
              'Location sharing can be stopped at any time.',
            ].map((item) => (
              <li key={item} style={{ fontSize: '14px', color: '#475569', display: 'flex', gap: '12px', alignItems: 'flex-start', lineHeight: 1.5 }}>
                <span style={{ color: '#16A34A', flexShrink: 0, fontWeight: 700 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Session token display */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <EyeOff size={14} color="#94A3B8" />
            <span style={{ fontSize: '13px', color: '#94A3B8', fontFamily: 'monospace' }}>
              Session: {self?.sessionId?.slice(0, 16) ?? 'sess_anon_104_...'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
