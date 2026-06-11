import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Flights from './pages/Flights';
import FlightDetail from './pages/FlightDetail';
import Airlines from './pages/Airlines';
import AirlineDetail from './pages/AirlineDetail';
import AircraftPage from './pages/AircraftPage';
import AircraftDetail from './pages/AircraftDetail';
import Pilots from './pages/Pilots';
import PilotDetail from './pages/PilotDetail';
import Crew from './pages/Crew';
import CrewDetail from './pages/CrewDetail';
import Statistics from './pages/Statistics';
import Search from './pages/Search';
import FlightRadar from './pages/FlightRadar';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flights/:id" element={<FlightDetail />} />
        <Route path="/airlines" element={<Airlines />} />
        <Route path="/airlines/:id" element={<AirlineDetail />} />
        <Route path="/aircraft" element={<AircraftPage />} />
        <Route path="/aircraft/:id" element={<AircraftDetail />} />
        <Route path="/pilots" element={<Pilots />} />
        <Route path="/pilots/:id" element={<PilotDetail />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/crew/:id" element={<CrewDetail />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/search" element={<Search />} />
        <Route path="/radar" element={<FlightRadar />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
