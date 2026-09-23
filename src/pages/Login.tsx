import { useNavigate } from 'react-router-dom';
import { Bus, Settings, Smartphone } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '48px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '56px', height: '56px',
          background: '#0F172A',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <Bus size={32} color="white" />
        </div>
        
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          SmartCrowd
        </h1>
        <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '40px' }}>
          Hardware-free transit tracking.<br/>Select your role to continue.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={() => navigate('/passenger/transition')}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '20px',
              background: '#0F172A',
              border: 'none', borderRadius: '16px',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={24} color="#FFFFFF" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>Passenger App</div>
              <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '2px' }}>Commuter tracking & location sharing</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '20px',
              background: '#FFFFFF',
              border: '2px solid #E2E8F0', borderRadius: '16px',
              color: '#0F172A',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#0F172A';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ width: '48px', height: '48px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={24} color="#0F172A" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>Admin Operations</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>Signal analysis & system dashboard</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
