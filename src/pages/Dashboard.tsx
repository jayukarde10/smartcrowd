import { useSimulation } from '../context/SimulationContext';
import BusMap from '../components/BusMap';
import BusCard from '../components/BusCard';
import { NavLink } from 'react-router-dom';
import { PlayCircle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { signals, busEstimate, isRunning } = useSimulation();
  const avgConf = busEstimate?.confidence ?? 0;

  return (
    <div style={{ padding: '48px 40px', maxWidth: '1400px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>

      {/* Editorial Overview Section */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '32px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '64px' }}>
          
          {/* Active Route */}
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Active Route
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', lineHeight: 1 }}>
                Bus 104
              </h1>
              {isRunning && <div className="badge-live" style={{ padding: '6px 12px', fontSize: '13px' }}>● LIVE</div>}
            </div>
            <div style={{ fontSize: '15px', color: '#475569', fontWeight: 500, marginTop: '8px' }}>
              Kalyan Station → Dombivli Station
            </div>
          </div>

          {/* ETA */}
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Estimated Arrival
            </div>
            <div style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', color: busEstimate?.etaAvailable ? '#16A34A' : '#94A3B8', lineHeight: 1 }}>
              {busEstimate?.etaAvailable ? `${busEstimate.etaMinutes} min` : '—'}
            </div>
            <div style={{ fontSize: '15px', color: '#475569', fontWeight: 500, marginTop: '8px' }}>
              At MIDC Dombivli Stop
            </div>
          </div>

          {/* Confidence */}
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              System Confidence
            </div>
            <div style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', color: avgConf >= 75 ? '#16A34A' : avgConf >= 50 ? '#D97706' : '#DC2626', lineHeight: 1 }}>
              {avgConf ? `${avgConf}%` : '—'}
            </div>
            <div style={{ fontSize: '15px', color: '#475569', fontWeight: 500, marginTop: '8px' }}>
              Based on crowd consensus
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area: Map + Context */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', flex: 1, minHeight: '0' }}>
        
        {/* Map Section */}
        <div style={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          position: 'relative',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}>
          {/* Map remains untouched per instructions */}
          <BusMap signals={signals} busEstimate={busEstimate} height="100%" />
          
          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: '24px', left: '24px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {[
              { color: '#16A34A', label: 'Reliable signal' },
              { color: '#DC2626', label: 'Filtered signal' },
              { color: '#2563EB', label: 'Estimated position' },
              { color: '#7C3AED', label: 'Route corridor' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Context Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}>
          
          <BusCard estimate={busEstimate} />

          {/* Quick signal list */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={18} color="#0F172A" />
              Live Signal Health
            </div>
            
            {signals.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>Waiting for passenger signals. Start the simulation to observe live tracking data.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {signals.map(sig => (
                  <div key={sig.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: sig.status === 'RELIABLE' ? '#16A34A' : '#DC2626',
                      }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{sig.label}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>{sig.speed.toFixed(0)} km/h</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '14px', fontWeight: 800,
                      color: sig.status === 'RELIABLE' ? '#16A34A' : '#DC2626',
                    }}>
                      {sig.scoring.reliabilityScore}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
