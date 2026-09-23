import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import PassengerLayout from './components/PassengerLayout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import LiveTracking from './pages/LiveTracking';
import SignalAnalysis from './pages/SignalAnalysis';
import CrowdConsensus from './pages/CrowdConsensus';
import DemoSimulation from './pages/DemoSimulation';
import HowItWorks from './pages/HowItWorks';

// Entry Page
import Login from './pages/Login';

// Passenger Pages
import PassengerHome from './pages/passenger/Home';
import LocationSelection from './pages/passenger/LocationSelection';
import PassengerSearch from './pages/passenger/Search';
import BusResult from './pages/passenger/BusResult';
import PassengerTracking from './pages/passenger/Tracking';
import PassengerAccount from './pages/passenger/Account';
import PassengerTransition from './pages/passenger/Transition';
import PassengerMyTrips from './pages/passenger/MyTrips';

import { SimulationProvider } from './context/SimulationContext';

function App() {
  return (
    <BrowserRouter>
      <SimulationProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"       element={<Dashboard />} />
            <Route path="live-tracking"   element={<LiveTracking />} />
            <Route path="signal-analysis" element={<SignalAnalysis />} />
            <Route path="crowd-consensus" element={<CrowdConsensus />} />
            <Route path="demo"            element={<DemoSimulation />} />
            <Route path="how-it-works"    element={<HowItWorks />} />
          </Route>

          {/* Passenger Transition outside of layout */}
          <Route path="/passenger/transition" element={<PassengerTransition />} />

          {/* Passenger Routes */}
          <Route path="/passenger" element={<PassengerLayout />}>
            <Route index element={<Navigate to="/passenger/home" replace />} />
            <Route path="home" element={<PassengerHome />} />
            <Route path="location" element={<LocationSelection />} />
            <Route path="search" element={<PassengerSearch />} />
            <Route path="bus/:id" element={<BusResult />} />
            <Route path="tracking" element={<PassengerTracking />} />
            <Route path="account" element={<PassengerAccount />} />
            <Route path="my-trips" element={<PassengerMyTrips />} />
          </Route>
        </Routes>
      </SimulationProvider>
    </BrowserRouter>
  );
}

export default App;
