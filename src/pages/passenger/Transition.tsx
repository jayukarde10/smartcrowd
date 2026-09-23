import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus } from 'lucide-react';

export default function PassengerTransition() {
  const navigate = useNavigate();

  useEffect(() => {
    // Transition to location setup (or home) after 1.5 seconds
    const timer = setTimeout(() => {
      // In a real app we might check if they have already granted location permission here.
      // For this flow, we will navigate to the location setup if it's the first time.
      navigate('/passenger/location');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      background: '#E2E8F0', // Grey background for desktop area
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '430px', // iPhone Pro Max width approximation
        height: '100vh',
        maxHeight: '932px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F172A',
        color: '#FFFFFF',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-bus {
          0% { transform: translateX(-40px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(40px); opacity: 0; }
        }
        @keyframes route-line {
          0% { width: 0%; opacity: 0; }
          30% { width: 100px; opacity: 1; }
          100% { width: 100px; opacity: 1; }
        }
      `}</style>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        animation: 'fade-in-up 0.6s ease-out forwards'
      }}>
        <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '32px' }}>
          SmartCrowd
        </div>
        
        <div style={{ position: 'relative', width: '100px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Route line */}
          <div style={{ 
            position: 'absolute', 
            height: '2px', 
            background: 'rgba(255,255,255,0.2)',
            animation: 'route-line 1s ease-out forwards',
          }} />
          
          {/* Moving Bus */}
          <div style={{ 
            position: 'absolute', 
            animation: 'slide-bus 1.5s ease-in-out forwards' 
          }}>
            <div style={{ 
              width: '32px', height: '32px', 
              background: '#22D3EE', 
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(34,211,238,0.5)'
            }}>
              <Bus size={16} color="#0F172A" />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
