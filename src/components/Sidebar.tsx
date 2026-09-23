import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Map, Activity, Users,
  PlayCircle, HelpCircle, Bus, Radio
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const navItems = [
  { to: '/admin/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/live-tracking',   icon: Map,             label: 'Live Tracking' },
  { to: '/admin/signal-analysis', icon: Activity,        label: 'Signal Analysis' },
  { to: '/admin/crowd-consensus', icon: Users,           label: 'Crowd Consensus' },
  { to: '/admin/demo',            icon: PlayCircle,      label: 'Demo Simulation' },
  { to: '/admin/how-it-works',    icon: HelpCircle,      label: 'How It Works' },
];

export default function Sidebar() {
  const { isRunning, busEstimate } = useSimulation();
  const confidence = busEstimate?.confidence ?? 0;

  return (
    <nav style={{
      width: '240px',
      minWidth: '240px',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 24px',
      gap: '4px',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '40px', padding: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: '#0F172A',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bus size={16} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: '#0F172A' }}>
              SmartCrowd
            </div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em' }}>
          CX0403 SYSTEM
        </div>

        <div style={{
          marginTop: '24px',
          padding: '0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Radio size={14} color={isRunning ? '#2563EB' : '#94A3B8'} style={{
              animation: isRunning ? 'pulse-badge 2s infinite' : 'none',
            }} />
            <span style={{ fontSize: '11px', color: isRunning ? '#2563EB' : '#64748B', fontWeight: 700, letterSpacing: '0.02em' }}>
              {isRunning ? 'SIMULATION ACTIVE' : 'SIMULATION IDLE'}
            </span>
          </div>
          {busEstimate && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: confidence >= 75 ? '#16A34A' : confidence >= 50 ? '#D97706' : '#DC2626',
              }}>
                {confidence}%
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Confidence</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.08em', padding: '12px 16px 8px' }}>
        OPERATIONS
      </div>

      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <Icon size={16} className="sidebar-icon" />
          {label}
        </NavLink>
      ))}

      {/* Bottom disclaimer */}
      <div style={{ marginTop: 'auto', padding: '16px 16px 0', borderTop: '1px solid #E2E8F0' }}>
        <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
          Prompters · CX0403
        </p>
      </div>
    </nav>
  );
}
