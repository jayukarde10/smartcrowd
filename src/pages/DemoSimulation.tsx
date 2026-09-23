import { useSimulation } from '../context/SimulationContext';
import BusMap from '../components/BusMap';
import type { ScenarioType, ProcessingPhase } from '../types';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

const SCENARIOS: { id: ScenarioType; label: string; desc: string }[] = [
  { id: 'NORMAL', label: 'Normal', desc: '3 passengers + 3 noise signals' },
  { id: 'LOW_SIGNALS', label: 'Low Signals', desc: 'Only 1 reliable passenger → low confidence' },
  { id: 'NOISY_DATA', label: 'Noisy Data', desc: 'Mostly noise, few reliable signals' },
  { id: 'CONFLICTING', label: 'Conflicting', desc: 'Signals disagree on direction' },
];

const PHASES: { phase: ProcessingPhase; label: string; desc: string; color: string }[] = [
  { phase: 'COLLECTING',       label: '1. Collect', desc: 'Six smartphone signals incoming', color: '#6D28D9' },
  { phase: 'SPEED_ANALYSIS',   label: '2. Speed', desc: 'Checking bus speed envelope (12–50 km/h)', color: '#2563EB' },
  { phase: 'DIRECTION_ANALYSIS', label: '3. Direction', desc: 'Comparing heading vs route bearing', color: '#0891B2' },
  { phase: 'ROUTE_ADHERENCE',  label: '4. Adherence', desc: 'Measuring distance from route polyline', color: '#0F766E' },
  { phase: 'CONTINUITY_CHECK', label: '5. Continuity', desc: 'Assessing trajectory stability', color: '#16A34A' },
  { phase: 'STOP_BEHAVIOR',    label: '6. Stop Dwell', desc: 'Analyzing dwell at bus stops', color: '#D97706' },
  { phase: 'SCORING',          label: '7. Score', desc: 'Computing multi-factor reliability score', color: '#BE185D' },
  { phase: 'FILTERING',        label: '8. Filter', desc: 'Rejecting P4, P5, P6 as noise', color: '#DC2626' },
  { phase: 'CLUSTERING',       label: '9. Cluster', desc: 'Grouping P1, P2, P3 into reliable cluster', color: '#16A34A' },
  { phase: 'CONSENSUS',        label: '10. Consensus', desc: 'Weighted centroid calculation', color: '#7C3AED' },
  { phase: 'ESTIMATING',       label: '11. Estimate', desc: 'Inferring position from cluster centroid', color: '#0284C7' },
  { phase: 'ETA',              label: '12. ETA', desc: 'Distance / speed + dwell allowance', color: '#16A34A' },
  { phase: 'COMPLETE',         label: '✓ Complete', desc: 'Bus 104 location + ETA + confidence ready', color: '#16A34A' },
];

export default function DemoSimulation() {
  const { signals, busEstimate, isRunning, isPaused, scenario, processingPhase, startSimulation, pauseSimulation, resetSim, setScenario } = useSimulation();
  const currentPhaseIndex = PHASES.findIndex(p => p.phase === processingPhase);

  return (
    <div style={{ padding: '0 40px 40px', display: 'flex', flexDirection: 'column', gap: '32px', height: '100%', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>

      {/* Header & Main Controls */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '40px', borderBottom: '1px solid #E2E8F0', paddingBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Interactive Sandbox
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Demo Simulation
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={startSimulation}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 24px',
              background: '#0F172A', color: '#FFFFFF',
              border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
            }}
          >
            <Play size={18} />
            {isRunning && !isPaused ? 'Restart Demo' : 'Start Demo'}
          </button>
          
          <button
            onClick={pauseSimulation}
            disabled={!isRunning}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 24px',
              background: '#F8FAFC', color: isRunning ? '#0F172A' : '#94A3B8',
              border: '1px solid #E2E8F0', borderRadius: '12px',
              fontSize: '15px', fontWeight: 600,
              cursor: isRunning ? 'pointer' : 'not-allowed',
            }}
          >
            <Pause size={18} />
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={resetSim}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 24px',
              background: 'transparent', color: '#DC2626',
              border: '1px solid transparent', borderRadius: '12px',
              fontSize: '15px', fontWeight: 600,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px', flex: 1, minHeight: 0 }}>
        
        {/* Left Side: Map & Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minHeight: 0 }}>
          
          {/* Pipeline */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Execution Pipeline
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', overflowX: 'auto', paddingBottom: '8px' }}>
              {PHASES.map((p, i) => {
                const isActive = i === currentPhaseIndex;
                const isDone = i < currentPhaseIndex;
                return (
                  <div key={p.phase} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      padding: '8px 12px',
                      color: isDone ? '#0F172A' : isActive ? p.color : '#94A3B8',
                      fontWeight: isActive ? 800 : isDone ? 600 : 500,
                      fontSize: '13px',
                      borderBottom: isActive ? `2px solid ${p.color}` : '2px solid transparent',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}>
                      {p.label}
                    </div>
                    {i < PHASES.length - 1 && (
                      <ChevronRight size={14} color={isDone ? '#94A3B8' : '#E2E8F0'} />
                    )}
                  </div>
                );
              })}
            </div>
            {processingPhase !== 'IDLE' && currentPhaseIndex >= 0 && (
              <div style={{ marginTop: '12px', fontSize: '14px', color: '#475569' }}>
                Current Action: <span style={{ color: '#0F172A', fontWeight: 700 }}>{PHASES[currentPhaseIndex]?.desc}</span>
              </div>
            )}
          </div>

          {/* Map */}
          <div style={{
            flex: 1,
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            position: 'relative',
          }}>
            <BusMap signals={signals} busEstimate={busEstimate} height="100%" />
          </div>
        </div>

        {/* Right Side: Scenario & State */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', overflowY: 'auto', paddingRight: '8px' }}>
          
          {/* Scenario Selector */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Test Scenarios
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  style={{
                    textAlign: 'left',
                    padding: '16px',
                    background: scenario === s.id ? '#F8FAFC' : 'transparent',
                    borderLeft: scenario === s.id ? '3px solid #0F172A' : '3px solid transparent',
                    border: 'none', // Overriding the left border above
                    borderLeftWidth: '3px',
                    borderLeftStyle: 'solid',
                    borderLeftColor: scenario === s.id ? '#0F172A' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { if (scenario !== s.id) e.currentTarget.style.background = '#F8FAFC' }}
                  onMouseLeave={(e) => { if (scenario !== s.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 700, color: scenario === s.id ? '#0F172A' : '#475569' }}>{s.label}</div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Live State Summary */}
          {isRunning && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Live Stream State
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {signals.map(sig => (
                  <div key={sig.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: sig.status === 'RELIABLE' ? '#16A34A' : '#DC2626',
                      }} />
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{sig.label}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: sig.status === 'RELIABLE' ? '#16A34A' : '#DC2626' }}>
                      {sig.status === 'RELIABLE' ? '✓' : '✗'} {sig.scoring.reliabilityScore}%
                    </span>
                  </div>
                ))}
              </div>

              {busEstimate && (
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Final Output
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>System Confidence</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: busEstimate.confidence >= 75 ? '#16A34A' : busEstimate.confidence >= 50 ? '#D97706' : '#DC2626' }}>
                      {busEstimate.confidence}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>Bus ETA</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                      {busEstimate.etaAvailable ? `${busEstimate.etaMinutes} min` : '—'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
