import { Outlet, NavLink } from 'react-router-dom';
import { Home, Map as MapIcon, User, List } from 'lucide-react';

export default function PassengerLayout() {
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
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
      }}>
        
        {/* Main Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        <div style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '12px 24px 24px', // Extra bottom padding for safe area
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <NavLink
            to="/passenger/home"
            className={({ isActive }) => `passenger-nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              color: isActive ? '#0F172A' : '#94A3B8',
              textDecoration: 'none',
              flex: 1,
            })}
          >
            <Home size={24} />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Home</span>
          </NavLink>

          <NavLink
            to="/passenger/tracking"
            className={({ isActive }) => `passenger-nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              color: isActive ? '#0F172A' : '#94A3B8',
              textDecoration: 'none',
              flex: 1,
            })}
          >
            <MapIcon size={24} />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Track</span>
          </NavLink>

          <NavLink
            to="/passenger/my-trips"
            className={({ isActive }) => `passenger-nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              color: isActive ? '#0F172A' : '#94A3B8',
              textDecoration: 'none',
              flex: 1,
            })}
          >
            <List size={24} />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Trips</span>
          </NavLink>

          <NavLink
            to="/passenger/account"
            className={({ isActive }) => `passenger-nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              color: isActive ? '#0F172A' : '#94A3B8',
              textDecoration: 'none',
              flex: 1,
            })}
          >
            <User size={24} />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Account</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
