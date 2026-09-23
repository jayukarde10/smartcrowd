import { useSimulation } from '../context/SimulationContext';

export default function CrowdConsensus() {
  const { signals, busEstimate } = useSimulation();

  const reliable = signals.filter(s => s.status === 'RELIABLE');
  const rejected = signals.filter(s => s.status !== 'RELIABLE');

  return (
    <div style={{ padding: '48px 40px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '64px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Data Synthesis
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', lineHeight: 1, marginBottom: '24px' }}>
          Crowd Consensus
        </h1>
        <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6 }}>
          A single smartphone is unreliable. By fusing multiple high-quality signals and clustering them geospatially, we synthesize a highly accurate, deterministic location estimate without any installed hardware.
        </p>
      </div>

      {signals.length === 0 ? (
        <div style={{ color: '#64748B', fontSize: '15px', textAlign: 'center', padding: '60px 0' }}>
          Awaiting live data streams. Start the simulation to observe the consensus engine.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', position: 'relative' }}>
          
          {/* STEP 1: Incoming Signals */}
          <div style={{ width: '100%', display: 'flex', gap: '32px' }}>
            {/* Reliable Pool */}
            <div style={{ flex: 2 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '24px', textAlign: 'center' }}>
                Reliable Signal Pool
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                {reliable.map(sig => (
                  <div key={sig.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '48px', height: '48px',
                      background: '#F0FDF4',
                      border: '2px solid #16A34A',
                      borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '18px', color: '#16A34A',
                      boxShadow: '0 4px 12px rgba(22,163,74,0.15)'
                    }}>
                      {sig.label}
                    </div>
                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>{sig.scoring.reliabilityScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtered Pool (quieter, visually de-prioritized) */}
            <div style={{ flex: 1, opacity: 0.8 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#B91C1C', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '24px', textAlign: 'center' }}>
                Filtered Noise
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                {rejected.map(sig => (
                  <div key={sig.id} style={{
                    padding: '8px 12px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '8px',
                    fontSize: '13px', fontWeight: 700, color: '#DC2626'
                  }}>
                    {sig.label} ✗
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DOWN ARROW */}
          {reliable.length > 0 && (
            <div style={{ height: '60px', width: '2px', background: 'linear-gradient(to bottom, #16A34A, transparent)' }} />
          )}

          {/* STEP 2: Mathematical Fusion */}
          {reliable.length > 0 && (
            <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Centroid Fusion
              </div>
              <div style={{
                padding: '24px',
                background: '#F8FAFC',
                borderLeft: '4px solid #0F172A',
                fontFamily: 'monospace',
                fontSize: '15px',
                color: '#334155',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              }}>
                Bus Pos = Σ(w<sub>i</sub> × Pos<sub>i</sub>) / Σ(w<sub>i</sub>)
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                  Weighted by reliability score (w)
                </div>
              </div>
            </div>
          )}

          {/* DOWN ARROW */}
          {busEstimate && reliable.length > 0 && (
            <div style={{ height: '60px', width: '2px', background: 'linear-gradient(to bottom, #0F172A, #2563EB)' }} />
          )}

          {/* STEP 3: Final Output */}
          {busEstimate && reliable.length > 0 && (
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
                Estimated Bus Position
              </div>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '40px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
                boxShadow: '0 20px 40px -10px rgba(37,99,235,0.1)',
                border: '1px solid #EFF6FF',
              }}>
                <div style={{ fontSize: '64px', fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-0.04em' }}>
                  Bus 104
                </div>
                
                <div style={{ display: 'flex', gap: '48px', width: '100%', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>Confidence</div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: busEstimate.confidence >= 75 ? '#16A34A' : '#D97706' }}>
                      {busEstimate.confidence}%
                    </div>
                  </div>
                  <div style={{ width: '1px', background: '#E2E8F0' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>Consensus</div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A' }}>
                      {busEstimate.crowdConsensus}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
