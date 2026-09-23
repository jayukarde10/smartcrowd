import { useSimulation } from '../context/SimulationContext';
import BusMap from '../components/BusMap';
import BusCard from '../components/BusCard';

export default function LiveTracking() {
  const { signals, busEstimate } = useSimulation();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 40px 40px', gap: '32px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '40px' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Tracking
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A', lineHeight: 1 }}>
              Live Map
            </h1>
            <div className="badge-live" style={{ padding: '6px 12px', fontSize: '12px' }}>● LIVE</div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px', minHeight: 0 }}>

        {/* Map Container */}
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}>
          {/* Map remains untouched */}
          <BusMap signals={signals} busEstimate={busEstimate} height="100%" />

          {/* Clean Legend Overlay */}
          <div style={{
            position: 'absolute', top: '24px', left: '24px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 400, // Above map elements
          }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
              Map Legend
            </div>
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

        {/* Right Info Sheet */}
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '12px' }}>
          <BusCard estimate={busEstimate} />

          {/* Validation Context (separated by whitespace, not boxed) */}
          <div style={{ marginTop: '48px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '24px' }}>
              Validation Context
            </div>
            
            {busEstimate ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                  Location inferred from{' '}
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>
                    {busEstimate.reliableSignalCount} reliable signal{busEstimate.reliableSignalCount !== 1 ? 's' : ''}
                  </span>
                  {busEstimate.rejectedSignalCount > 0 && (
                    <>
                      {' '}filtering out{' '}
                      <span style={{ color: '#DC2626', fontWeight: 700 }}>
                        {busEstimate.rejectedSignalCount} noisy signal{busEstimate.rejectedSignalCount !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}.
                </div>
                
                {busEstimate.reliableSignalCount === 1 && (
                  <div style={{
                    padding: '16px',
                    background: '#FEF3C7',
                    borderLeft: '4px solid #D97706',
                    fontSize: '13px',
                    color: '#B45309',
                    fontWeight: 500,
                  }}>
                    Single sensor mode — confidence limited. Awaiting crowd consensus.
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                  {[
                    { label: 'Direction Agreement', val: `${busEstimate.directionAgreement}%` },
                    { label: 'Route Adherence', val: `${busEstimate.routeAdherence}%` },
                    { label: 'Movement Continuity', val: `${busEstimate.movementContinuity}%` },
                    { label: 'Consensus Base', val: busEstimate.crowdConsensus },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                      <span style={{ color: '#64748B', fontSize: '14px', fontWeight: 500 }}>{label}</span>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>Awaiting simulation to establish validation context.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
