import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowDownUp, Calendar, Clock, Bus, CheckCircle2, Navigation, ArrowDown, Activity } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export default function BusResult() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { busEstimate } = useSimulation();
  
  const [showPrompt, setShowPrompt] = useState(false);

  const handleSelection = (isSharing: boolean) => {
    navigate('/passenger/tracking', { state: { isSharing } });
  };

  const isReverse = id === '104-rev';
  const origin = isReverse ? 'Dombivli Station' : 'Kalyan Station';
  const dest = isReverse ? 'Kalyan Station' : 'Dombivli Station';
  
  const travelTimeMinutes = busEstimate?.etaAvailable ? busEstimate.etaMinutes + 25 : 32;

  // Format today's date for the pill
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ background: '#F1F5F9', minHeight: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Header */}
      <div style={{
        background: '#FFFFFF',
        padding: '16px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '4px' }}>
          <ArrowLeft size={24} color="#0F172A" />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Trip Details</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        
        {/* Origin / Destination Card */}
        <div style={{ background: '#FFFFFF', padding: '24px 16px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            
            {/* Timeline UI */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '10px', height: '10px', border: '2px solid #64748B', borderRadius: '50%', background: '#FFFFFF' }} />
              <div style={{ width: '2px', height: '40px', background: '#0F172A' }} />
              <div style={{ width: '10px', height: '10px', background: '#0F172A', borderRadius: '50%' }} />
            </div>

            {/* Inputs */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                <div style={{ fontSize: '15px', color: '#0F172A', fontWeight: 500 }}>Current location</div>
              </div>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                <div style={{ fontSize: '15px', color: '#0F172A', fontWeight: 500 }}>{dest}</div>
              </div>
            </div>

            {/* Swap Button */}
            <div style={{
              position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)',
              width: '32px', height: '32px', background: '#F1F5F9', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ArrowDownUp size={16} color="#0F172A" />
            </div>
          </div>

          {/* Date / Time Pills */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <div style={{ flex: 1, background: '#F8FAFC', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#0F172A" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{dateStr}</span>
            </div>
            <div style={{ flex: 1, background: '#F8FAFC', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#0F172A" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{timeStr}</span>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div style={{ display: 'flex', gap: '12px', padding: '24px 16px 16px', overflowX: 'auto' }}>
          <div style={{ background: '#EA580C', color: '#FFFFFF', padding: '10px 20px', borderRadius: '24px', fontSize: '14px', fontWeight: 700 }}>All</div>
          <div style={{ background: '#FFFFFF', color: '#0F172A', padding: '10px 20px', borderRadius: '24px', fontSize: '14px', fontWeight: 600 }}>SmartCrowd Bus</div>
          <div style={{ background: '#FFFFFF', color: '#0F172A', padding: '10px 20px', borderRadius: '24px', fontSize: '14px', fontWeight: 600 }}>Direct</div>
        </div>

        {/* Route Result Card */}
        <div style={{ padding: '0 16px 24px' }}>
          <div 
            onClick={() => setShowPrompt(true)}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {/* Time and Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                {travelTimeMinutes} min
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#B45309', borderBottom: '1px solid #B45309', paddingBottom: '2px' }}>
                Direct
              </span>
            </div>

            {/* Transport Steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#F1F5F9', padding: '10px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="#64748B" />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>Walk to {origin}</span>
              </div>
              <ArrowLeft size={16} color="#0F172A" style={{ transform: 'rotate(180deg)' }} />
              <div style={{ background: '#F1F5F9', padding: '10px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bus size={16} color="#0F172A" />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>Take <b>Bus 104</b></span>
              </div>
            </div>

            {/* Bottom details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Bus From</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{origin}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Arriving</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <Navigation size={14} />
                  In {busEstimate?.etaAvailable ? busEstimate.etaMinutes : '--'} min
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Are you on this bus?" Modal Slide-Up */}
      {showPrompt && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            background: '#0F172A',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '32px 24px',
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.2)',
            animation: 'slide-up 0.3s ease-out'
          }}>
            <style>{`
              @keyframes slide-up {
                0% { transform: translateY(100%); }
                100% { transform: translateY(0); }
              }
            `}</style>
            
            <button 
              onClick={() => setShowPrompt(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', marginBottom: '16px', cursor: 'pointer' }}
            >
              <ArrowDown size={24} />
            </button>

            <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Are you on this bus?
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.5, marginBottom: '32px' }}>
              SmartCrowd relies on passengers to share their location. By saying yes, you'll anonymously help others track this bus.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                onClick={() => handleSelection(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%',
                  padding: '16px',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <CheckCircle2 size={20} />
                YES, I'M ON THIS BUS
              </button>
              <button
                onClick={() => handleSelection(false)}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '16px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                NO, I'M JUST TRACKING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
