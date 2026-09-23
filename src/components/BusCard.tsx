import type { BusEstimate } from '../types';
import { ROUTE_104_STOPS } from '../data/routes';

interface BusCardProps {
  estimate: BusEstimate | null;
  compact?: boolean;
}

export default function BusCard({ estimate, compact }: BusCardProps) {
  if (!estimate) {
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Bus Status
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#94A3B8' }}>Offline</div>
        <div style={{ color: '#64748B', fontSize: '14px', marginTop: '8px' }}>Simulation not running.</div>
      </div>
    );
  }

  const currentStop = ROUTE_104_STOPS.find(s => s.id === estimate.currentStopId);
  const nextStop = ROUTE_104_STOPS.find(s => s.id === estimate.nextStopId);
  const confidenceColor = estimate.confidence >= 75 ? '#16A34A' : estimate.confidence >= 50 ? '#D97706' : '#DC2626';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '16px' }}>
      
      {/* Primary Bus Identity */}
      <div>
        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Active Bus
        </div>
        <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Bus 104
        </h2>
      </div>

      {/* Primary Metrics List (Unboxed, typographic) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* ETA */}
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
            ETA
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: estimate.etaAvailable ? '#16A34A' : '#94A3B8', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {estimate.etaAvailable ? `${estimate.etaMinutes} min` : '—'}
          </div>
        </div>

        {/* Current Stop */}
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Current Stop
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
            {currentStop?.name ?? '—'}
          </div>
        </div>

        {/* Next Stop */}
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Next Stop
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
            {nextStop?.name ?? '—'}
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Estimated Confidence
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: confidenceColor, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {estimate.confidence}%
          </div>
        </div>

      </div>

      {/* Technical Details (Secondary, only if not compact) */}
      {!compact && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Technical Signal Data
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Signals Merged', value: `${estimate.reliableSignalCount} reliable`, color: '#16A34A' },
              { label: 'Filtered Out', value: `${estimate.rejectedSignalCount} noisy`, color: '#DC2626' },
              { label: 'Calculated Speed', value: `${estimate.avgSpeed} km/h`, color: '#0F172A' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
