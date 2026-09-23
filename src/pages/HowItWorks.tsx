const PIPELINE = [
  { icon: '📱', label: 'Passenger Smartphones', desc: 'Phones opt-in as anonymous sensors, capturing raw GPS data.', color: '#6D28D9' },
  { icon: '📡', label: 'Location Signals', desc: 'Secure transmission of latitude, longitude, speed, and heading.', color: '#2563EB' },
  { icon: '⚡', label: 'Speed Analysis', desc: 'Checking against the bus speed envelope (12–50 km/h) to filter pedestrians.', color: '#0891B2' },
  { icon: '🧭', label: 'Direction Analysis', desc: 'Heading compared against route bearing via cosine similarity.', color: '#0F766E' },
  { icon: '🗺️', label: 'Route Adherence', desc: 'Calculating cross-track distance to the established route polyline.', color: '#16A34A' },
  { icon: '📈', label: 'Movement Continuity', desc: 'Temporal velocity stability assessed over a sliding time window.', color: '#D97706' },
  { icon: '🛑', label: 'Stop Behavior', desc: 'Dwell analysis confirms expected delays at registered bus stops.', color: '#EA580C' },
  { icon: '📊', label: 'Signal Scoring', desc: 'Weighted evaluation yielding a reliability score between 0–100%.', color: '#BE185D' },
  { icon: '👥', label: 'Crowd Consensus', desc: 'High-scoring signals are merged via a weighted centroid calculation.', color: '#0284C7' },
  { icon: '🚌', label: 'Final Bus Location', desc: 'The inferred deterministic position, exposed with a confidence radius.', color: '#16A34A' },
];

const CASES = [
  {
    id: 'A', title: 'True Passenger', icon: '👤', status: 'Reliable', color: '#16A34A',
    details: 'Moves continuously along Route 104 at 25–40 km/h with matching direction and high route adherence.',
    reason: 'Multi-factor behavioral match confirms on-bus passenger. Signal accepted.',
  },
  {
    id: 'B', title: 'Waiting at Stop', icon: '⏸', status: 'Filtered', color: '#DC2626',
    details: 'Stationary near a bus stop with 0 km/h speed. Stop behavior score penalized for extended dwell.',
    reason: 'Not moving with the bus. Identified as a waiting passenger, not a rider.',
  },
  {
    id: 'C', title: 'Nearby Vehicle', icon: '🚗', status: 'Filtered', color: '#DC2626',
    details: 'Travels at 40 km/h but deviates from the route at intersections. Bearing diverges >90° from route.',
    reason: 'Speed compatible, but direction and route adherence disqualify the signal.',
  },
  {
    id: 'D', title: 'Pedestrian', icon: '🚶', status: 'Filtered', color: '#DC2626',
    details: 'Moves at 4–5 km/h parallel to the route corridor.',
    reason: 'Speed profile incompatible with bus transit (minimum 8 km/h threshold).',
  },
];

export default function HowItWorks() {
  return (
    <div style={{ padding: '64px 40px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>

      {/* Hero / Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', lineHeight: 1, marginBottom: '24px' }}>
          Hardware-free transit intelligence.
        </h1>
        <p style={{ color: '#475569', fontSize: '20px', lineHeight: 1.6, fontWeight: 500 }}>
          SmartCrowd turns noisy crowd location data into a reliable, deterministic bus tracking system. No GPS units installed on the bus — just passengers' phones.
        </p>
      </div>

      {/* The Core Insight */}
      <div style={{ borderLeft: '4px solid #0F172A', paddingLeft: '32px', margin: '0 auto', maxWidth: '800px' }}>
        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
          The Core Challenge
        </div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.4, marginBottom: '16px' }}>
          "Most phones near a bus route are not actually on the bus."
        </div>
        <p style={{ color: '#334155', fontSize: '16px', lineHeight: 1.7 }}>
          Instead of installing expensive GPS hardware on every bus, we use passengers' existing smartphones as informal sensors. Our filtering pipeline analyzes speed, direction, route adherence, and continuity to separate true bus passengers from pedestrians, waiting commuters, and nearby cars.
        </p>
      </div>

      {/* Pipeline */}
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginBottom: '40px', letterSpacing: '-0.02em' }}>
          The Signal Pipeline
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {PIPELINE.map((step, i) => (
            <div key={step.label} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{
                fontSize: '24px',
                color: step.color,
                fontWeight: 800,
                width: '40px',
                flexShrink: 0,
                paddingTop: '2px',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '18px', color: '#0F172A', marginBottom: '8px' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Four Cases */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginBottom: '40px', letterSpacing: '-0.02em' }}>
          Handling Complex Scenarios
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px' }}>
          {CASES.map(c => (
            <div key={c.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Case {c.id}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '20px', color: '#0F172A' }}>{c.title}</div>
                </div>
              </div>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                {c.details}
              </p>
              <div style={{
                fontSize: '15px', color: c.color, fontWeight: 700,
                borderLeft: `2px solid ${c.color}`, paddingLeft: '16px'
              }}>
                {c.reason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations (Honesty section) */}
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingTop: '40px', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '13px', color: '#B45309', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Scientific Integrity & Limitations
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            'Prototype heuristics: Scoring weights are logical estimates, not yet calibrated on real transit data.',
            'Requires minimum 2–3 concurrent passengers for high confidence consensus estimates.',
            'A nearby car following the exact same route corridor may temporarily score higher than expected.',
            'GPS accuracy limits (5–15m error) affect centroid precision in dense urban canyons.',
          ].map((item, idx) => (
            <li key={idx} style={{ fontSize: '15px', color: '#475569', display: 'flex', gap: '16px', alignItems: 'flex-start', lineHeight: 1.6 }}>
              <span style={{ color: '#D97706', flexShrink: 0, fontWeight: 800 }}>—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
