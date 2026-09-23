import { useState, useEffect } from 'react';
import { User, MapPin, Search, Shield, Map as MapIcon, Share2, HelpCircle, LogOut, ChevronRight, Edit2, X, Plus, Trash2, Bell } from 'lucide-react';
import { usePassengerState } from '../../hooks/usePassengerState';
import type { SavedPlace } from '../../hooks/usePassengerState';
import { useNavigate } from 'react-router-dom';

export default function PassengerAccount() {
  const navigate = useNavigate();
  const { 
    profile, updateProfile, 
    savedPlaces, addSavedPlace, updateSavedPlace, deleteSavedPlace,
    recentSearches, clearRecentSearches,
    notificationsEnabled, toggleNotifications 
  } = usePassengerState();

  const [activeModal, setActiveModal] = useState<'profile' | 'place' | 'sharing' | 'privacy' | 'help' | 'signout' | null>(null);
  
  // Modal states
  const [editName, setEditName] = useState(profile.name);
  const [editContact, setEditContact] = useState(profile.contact);
  const [editingPlace, setEditingPlace] = useState<SavedPlace | null>(null);
  const [placeLabel, setPlaceLabel] = useState('');
  const [placeAddress, setPlaceAddress] = useState('');

  const [locationPermission, setLocationPermission] = useState<string>('unknown');

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setLocationPermission(result.state);
        result.onchange = () => setLocationPermission(result.state);
      });
    }
  }, []);

  const openPlaceModal = (place?: SavedPlace) => {
    if (place) {
      setEditingPlace(place);
      setPlaceLabel(place.label);
      setPlaceAddress(place.address);
    } else {
      setEditingPlace(null);
      setPlaceLabel('');
      setPlaceAddress('');
    }
    setActiveModal('place');
  };

  const handleSaveProfile = () => {
    updateProfile({ name: editName, contact: editContact });
    setActiveModal(null);
  };

  const handleSavePlace = () => {
    if (!placeLabel.trim()) return;
    if (editingPlace) {
      updateSavedPlace(editingPlace.id, { label: placeLabel, address: placeAddress });
    } else {
      addSavedPlace({ label: placeLabel, address: placeAddress, icon: 'other' });
    }
    setActiveModal(null);
  };

  const handleDeletePlace = () => {
    if (editingPlace) {
      deleteSavedPlace(editingPlace.id);
    }
    setActiveModal(null);
  };

  const ModalContainer = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ background: '#FFFFFF', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', animation: 'slide-up 0.3s ease-out', maxHeight: '90%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>{title}</h2>
          <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748B" /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Header & Profile */}
      <div style={{ background: '#FFFFFF', padding: '32px 24px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', background: '#0F172A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={32} color="#FFFFFF" />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                {profile.name}
              </h1>
              <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                {profile.contact}
              </div>
            </div>
          </div>
          <button onClick={() => setActiveModal('profile')} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Edit2 size={18} color="#0F172A" />
          </button>
        </div>
      </div>

      <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Saved Places */}
        <section>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Saved Places
            <button onClick={() => openPlaceModal()} style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>+ Add</button>
          </div>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            {savedPlaces.map((place, idx) => (
              <div key={place.id} onClick={() => openPlaceModal(place)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: idx < savedPlaces.length - 1 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={20} color="#64748B" />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>{place.label}</div>
                    <div style={{ fontSize: '13px', color: '#94A3B8' }}>{place.address}</div>
                  </div>
                </div>
                <ChevronRight size={18} color="#CBD5E1" />
              </div>
            ))}
            {savedPlaces.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>No saved places.</div>
            )}
          </div>
        </section>

        {/* Location & Privacy */}
        <section>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Location & Privacy</div>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapIcon size={20} color="#64748B" />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Location Permission</div>
                  <div style={{ fontSize: '13px', color: locationPermission === 'granted' ? '#16A34A' : '#DC2626' }}>
                    {locationPermission === 'granted' ? 'Allowed' : locationPermission === 'denied' ? 'Denied (Enable in browser settings)' : 'Not requested'}
                  </div>
                </div>
              </div>
            </div>

            <div onClick={() => setActiveModal('sharing')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Share2 size={20} color="#64748B" />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Location Sharing</div>
                  <div style={{ fontSize: '13px', color: '#94A3B8' }}>How sensor contribution works</div>
                </div>
              </div>
              <ChevronRight size={18} color="#CBD5E1" />
            </div>

            <div onClick={() => setActiveModal('privacy')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={20} color="#64748B" />
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Privacy Policy</span>
              </div>
              <ChevronRight size={18} color="#CBD5E1" />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Preferences</div>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <div onClick={toggleNotifications} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bell size={20} color="#64748B" />
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Notifications</span>
              </div>
              <div style={{ width: '40px', height: '24px', background: notificationsEnabled ? '#16A34A' : '#E2E8F0', borderRadius: '12px', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: '2px', left: notificationsEnabled ? '18px' : '2px', width: '20px', height: '20px', background: '#FFFFFF', borderRadius: '50%', transition: 'left 0.2s' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Help & Support */}
        <section>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <div onClick={() => setActiveModal('help')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HelpCircle size={20} color="#64748B" />
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Help & Support</span>
              </div>
              <ChevronRight size={18} color="#CBD5E1" />
            </div>
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={() => setActiveModal('signout')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px', background: '#FFFFFF', border: '1px solid #FECACA', borderRadius: '16px', color: '#DC2626', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      {/* Modals */}
      {activeModal === 'profile' && (
        <ModalContainer title="Edit Profile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '8px', display: 'block' }}>Full Name</label>
              <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '15px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '8px', display: 'block' }}>Mobile / Email</label>
              <input value={editContact} onChange={e => setEditContact(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '15px', outline: 'none' }} />
            </div>
            <button onClick={handleSaveProfile} style={{ width: '100%', padding: '16px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontSize: '16px', fontWeight: 700, marginTop: '16px', border: 'none' }}>Save Profile</button>
          </div>
        </ModalContainer>
      )}

      {activeModal === 'place' && (
        <ModalContainer title={editingPlace ? "Edit Place" : "Add Place"}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '8px', display: 'block' }}>Label (e.g., Home, Work)</label>
              <input value={placeLabel} onChange={e => setPlaceLabel(e.target.value)} placeholder="Home" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '15px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '8px', display: 'block' }}>Address / Area</label>
              <input value={placeAddress} onChange={e => setPlaceAddress(e.target.value)} placeholder="Enter full address" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '15px', outline: 'none' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {editingPlace && (
                <button onClick={handleDeletePlace} style={{ flex: 1, padding: '16px', background: '#FEE2E2', color: '#DC2626', borderRadius: '12px', fontSize: '16px', fontWeight: 700, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Trash2 size={20} /> Delete
                </button>
              )}
              <button onClick={handleSavePlace} style={{ flex: 2, padding: '16px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontSize: '16px', fontWeight: 700, border: 'none' }}>
                Save Place
              </button>
            </div>
          </div>
        </ModalContainer>
      )}

      {activeModal === 'sharing' && (
        <ModalContainer title="Location Sharing">
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
            SmartCrowd relies on community sensor contribution. Your device only shares location data when you explicitly confirm you are on a bus.
          </p>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
            When you select <strong>"NO, I'M JUST TRACKING"</strong>, no location data is sent to our servers. Sensor contribution automatically stops when your ride ends.
          </p>
        </ModalContainer>
      )}

      {activeModal === 'privacy' && (
        <ModalContainer title="Privacy Policy">
          <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>Location is used strictly to provide nearby transit options and ETA predictions.</li>
            <li>Passenger identities are completely decoupled from location data (fully anonymous).</li>
            <li>Administrators only see aggregated technical signals, not individual user profiles.</li>
            <li>We do not store historical location traces of passengers.</li>
          </ul>
        </ModalContainer>
      )}

      {activeModal === 'help' && (
        <ModalContainer title="Help & Support">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>How is ETA calculated?</h4>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>SmartCrowd calculates ETA based on crowd-sourced GPS data from passengers currently on the bus, combined with live traffic analysis.</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>How to stop sharing location?</h4>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>You can stop sharing your location at any time by tapping the "STOP" button in the active trip banner on the tracking screen.</p>
            </div>
          </div>
        </ModalContainer>
      )}

      {activeModal === 'signout' && (
        <ModalContainer title="Sign Out">
          <p style={{ fontSize: '16px', color: '#0F172A', marginBottom: '24px', textAlign: 'center' }}>Are you sure you want to sign out?</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setActiveModal(null)} style={{ flex: 1, padding: '16px', background: '#F1F5F9', color: '#0F172A', borderRadius: '12px', fontSize: '16px', fontWeight: 700, border: 'none' }}>Cancel</button>
            <button onClick={() => navigate('/login')} style={{ flex: 1, padding: '16px', background: '#DC2626', color: '#FFFFFF', borderRadius: '12px', fontSize: '16px', fontWeight: 700, border: 'none' }}>Sign Out</button>
          </div>
        </ModalContainer>
      )}

      <style>{`
        @keyframes slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
