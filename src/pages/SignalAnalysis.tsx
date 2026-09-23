import { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import type { PassengerSignal } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  PASSENGER: 'Bus Passenger',
  WAITING: 'Waiting at Stop',
  CAR: 'Nearby Vehicle',
  PEDESTRIAN: 'Pedestrian',
};

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ flex: 1, height: '4px', background: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', minWidth: '32px', textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

function SignalDetailPanel({ signal }: { signal: PassengerSignal }) {
  const s = signal.scoring;
  const isReliable = signal.status === 'RELIABLE';
  
  return (
    <div style={{
      padding: '32px 40px',
      background: '#FAFAF9', // Very subtle off-white for the expanded state
      borderBottom: '1px solid #E2E8F0',
      animation: 'fade-in 0.3s ease',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
        
        {/* Left Column: Context & Rejection Reason */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>
              {isReliable ? 'Acceptance Rationale' : 'Rejection Rationale'}
            </div>
            <div style={{
              fontSize: '15px',
              color: '#334155',
              lineHeight: 1.6,
            }}>
              {isReliable
                ? `${signal.label} demonstrates a highly consistent movement profile matching Route 104's expected speed (${signal.speed.toFixed(0)} km/h), direction, and corridor adherence. Multi-factor scoring indicates high probability of on-bus behavior.`
                : signal.rejectionReason ?? 'Insufficient multi-factor reliability score to be considered a passenger.'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>
              Raw Metrics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              {[
                { label: 'Speed', val: `${signal.speed.toFixed(1)} km/h` },
                { label: 'Direction', val: signal.directionMatch },
                { label: 'Route Distance', val: `${signal.distanceFromRoute.toFixed(0)} m from route corridor` },
                { label: 'Inferred Role', val: ROLE_LABELS[signal.role] ?? signal.role },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scoring Breakdown */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>
            Multi-Factor Scoring
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Speed Profile Match', val: s.speedScore, color: '#0F172A' },
              { label: 'Direction Alignment', val: s.directionScore, color: '#0F172A' },
              { label: 'Route Corridor Adherence', val: s.routeAdherenceScore, color: '#0F172A' },
              { label: 'Movement Continuity', val: s.continuityScore, color: '#0F172A' },
              { label: 'Stop-Pattern Behavior', val: s.stopBehaviorScore, color: '#0F172A' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{label}</span>
                </div>
                <ScoreBar value={val} color={color} />
              </div>
            ))}
            
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Final Reliability Score</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: isReliable ? '#16A34A' : '#DC2626', letterSpacing: '-0.02em' }}>
                {s.reliabilityScore}%
              </span>
            </div>
            
            <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace', marginTop: '4px' }}>
              Model: Score = 0.20S + 0.20D + 0.25A + 0.20C + 0.15St
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SignalAnalysis() {
  const { signals } = useSimulation();
  const [selected, setSelected] = useState<string | null>(null);

  const reliable = signals.filter(s => s.status === 'RELIABLE');
  const noise = signals.filter(s => s.status !== 'RELIABLE');

  return (
    <div style={{ padding: '48px 40px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #E2E8F0', paddingBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Data Pipeline
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A', lineHeight: 1 }}>
            Signal Analysis
          </h1>
        </div>

        {signals.length > 0 && (
          <div style={{ display: 'flex', gap: '32px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>Reliable Base</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#16A34A', lineHeight: 1 }}>{reliable.length}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>Filtered Noise</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#DC2626', lineHeight: 1 }}>{noise.length}</div>
            </div>
          </div>
        )}
      </div>

      {signals.length === 0 ? (
        <div style={{ color: '#64748B', fontSize: '15px', padding: '60px 0', textAlign: 'center' }}>
          No incoming data streams. Start the simulation to analyze live signals.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '900px' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 100px 120px 100px 120px 1fr 100px',
              padding: '0 16px 16px 16px',
              fontSize: '12px', fontWeight: 700, color: '#64748B',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              borderBottom: '2px solid #E2E8F0',
            }}>
              <span>Signal ID</span>
              <span>Speed</span>
              <span>Direction</span>
              <span>Adherence</span>
              <span>Continuity</span>
              <span>Inferred Role</span>
              <span style={{ textAlign: 'right' }}>Score</span>
            </div>

            {/* Table Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {signals.map(sig => {
                const isSelected = selected === sig.id;
                const isReliable = sig.status === 'RELIABLE';

                return (
                  <div key={sig.id}>
                    <div
                      onClick={() => setSelected(isSelected ? null : sig.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '100px 100px 120px 100px 120px 1fr 100px',
                        padding: '20px 16px',
                        cursor: 'pointer',
                        borderBottom: isSelected ? 'none' : '1px solid #E2E8F0',
                        alignItems: 'center',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#F8FAFC' }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                    >
                      {/* Signal ID */}
                      <div style={{
                        fontSize: '14px', fontWeight: 800,
                        color: isReliable ? '#16A34A' : '#DC2626',
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}>
                        {sig.label}
                      </div>

                      {/* Speed */}
                      <div style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                        {sig.speed.toFixed(1)} km/h
                      </div>

                      {/* Direction */}
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: sig.directionMatch === 'MATCH' ? '#0F172A' : '#64748B',
                      }}>
                        {sig.directionMatch === 'MATCH' ? 'Match' : sig.directionMatch === 'PARTIAL' ? 'Partial' : sig.directionMatch === 'STATIONARY' ? 'Stationary' : 'Opposite'}
                      </div>

                      {/* Route Adherence */}
                      <div style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                        {sig.scoring.routeAdherenceScore}%
                      </div>

                      {/* Continuity */}
                      <div style={{
                        fontSize: '14px', fontWeight: 500,
                        color: sig.scoring.continuityScore >= 70 ? '#0F172A' : '#64748B',
                      }}>
                        {sig.scoring.continuityScore >= 70 ? 'Good' : sig.scoring.continuityScore >= 45 ? 'Fair' : 'Poor'}
                      </div>

                      {/* Role */}
                      <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>
                        {ROLE_LABELS[sig.role] ?? sig.role}
                      </div>

                      {/* Score and Caret */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: isReliable ? '#16A34A' : '#DC2626' }}>
                          {sig.scoring.reliabilityScore}%
                        </span>
                        {isSelected ? <ChevronUp size={16} color="#94A3B8" /> : <ChevronDown size={16} color="#94A3B8" />}
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isSelected && <SignalDetailPanel signal={sig} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
