import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, MapPin, Search, X, Users, Wrench, Award } from 'lucide-react';
import NavBar from '../components/layout/NavBar';
import StatusBadge from '../components/ui/StatusBadge';
import { aeroApi } from '../api/aeroApi';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import AIRPORT_COORDS from '../data/airportCoords';
import RouteArc from '../components/map/RouteArc';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function getFlightPosition(flight) {
  if (flight.latitude != null && flight.longitude != null) {
    return [flight.latitude, flight.longitude];
  }
  return null;
}

const STATUS_COLORS = {
  active: '#22C55E',
  scheduled: '#3B82F6',
  landed: '#6B7280',
  delayed: '#F59E0B',
  cancelled: '#EF4444',
};

function createStatusIcon(status, active = false) {
  const color = STATUS_COLORS[status?.toLowerCase()] || '#6366F1';
  const size = active ? 24 : 16;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 0 12px ${color}99,0 2px 8px rgba(0,0,0,0.4);transition:all 0.2s;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapBoundsUpdater({ flights, selectedId }) {
  const map = useMap();

  useEffect(() => {
    const positions = flights.map(getFlightPosition).filter(Boolean);
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }, [flights, map]);

  useEffect(() => {
    if (selectedId) {
      const flight = flights.find((f) => f.flightId === selectedId);
      const pos = flight ? getFlightPosition(flight) : null;
      if (pos) {
        map.flyTo(pos, 6, { duration: 0.8 });
      }
    }
  }, [selectedId, flights, map]);

  return null;
}

export default function FlightRadar() {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aeroApi.Flight.list().then(setFlights);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const activeFlights = useMemo(() => flights.filter((f) => f.status === 'active'), [flights]);

  const filtered = useMemo(() => {
    if (!search) return flights;
    const q = search.toLowerCase();
    return flights.filter(
      (f) =>
        f.flightNumber?.toLowerCase().includes(q) ||
        f.departureLocation?.toLowerCase().includes(q) ||
        f.arrivalLocation?.toLowerCase().includes(q)
    );
  }, [flights, search]);

  const selected = flights.find((f) => f.flightId === selectedId);

  const flightsWithCoords = useMemo(() => filtered.filter((f) => getFlightPosition(f)), [filtered]);
  const flightsWithRoute = useMemo(
    () => flights.filter((f) => AIRPORT_COORDS[f.departureLocation] && AIRPORT_COORDS[f.arrivalLocation]),
    [flights]
  );

  return (
    <div className="h-screen flex flex-col bg-[#060B17] overflow-hidden">
      <NavBar solid />
      <div className="flex-1 relative flex pt-16">
        <MapContainer
          center={[48, 10]}
          zoom={3}
          className="absolute inset-0 z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {flightsWithRoute.map((f) => (
            <RouteArc
              key={`arc-${f.flightId}`}
              from={AIRPORT_COORDS[f.departureLocation]}
              to={AIRPORT_COORDS[f.arrivalLocation]}
              status={f.status}
              flightId={f.flightId}
              onClick={setSelectedId}
            />
          ))}
          {flightsWithCoords.map((f) => (
            <Marker
              key={f.flightId}
              position={getFlightPosition(f)}
              icon={createStatusIcon(f.status, selectedId === f.flightId)}
              eventHandlers={{
                click: () => setSelectedId(f.flightId),
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'system-ui, sans-serif', minWidth: 140 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{f.flightNumber}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{f.departureLocation} → {f.arrivalLocation}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    {f.airline?.airlineName || ''}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          <MapBoundsUpdater flights={flightsWithCoords} selectedId={selectedId} />
        </MapContainer>

        {loading && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E] to-[#060B17] flex items-center justify-center z-50 transition-opacity duration-500">
            <div className="text-center">
              <Plane className="w-16 h-16 text-sky-500/20 mx-auto mb-4 animate-bounce" />
              <p className="text-white/20 text-lg font-display font-semibold">Loading Flight Radar...</p>
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 z-[1000] w-80 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search flights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D1528]/90 backdrop-blur-xl border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div className="bg-[#0D1528]/90 backdrop-blur-xl border border-white/10 rounded-xl max-h-[60vh] overflow-y-auto no-scrollbar">
            {filtered.map((f) => (
              <button
                key={f.flightId}
                onClick={() => setSelectedId(f.flightId)}
                className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition last:border-0 ${
                  selectedId === f.flightId ? 'bg-sky-500/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-white text-sm">{f.flightNumber}</span>
                  <StatusBadge status={f.status} />
                </div>
                <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
                  <MapPin className="w-3 h-3" />{f.departureLocation} → {f.arrivalLocation}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-semibold">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {activeFlights.length} active flights
          </div>
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="absolute right-4 top-4 bottom-4 z-[1000] w-96 bg-[#0D1528]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-y-auto no-scrollbar"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-sky-400" />
                    <span className="font-display font-bold text-lg text-white">{selected.flightNumber}</span>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <StatusBadge status={selected.status} />

                <div className="my-6 p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-lg">{selected.departureLocation}</span>
                    <Plane className="w-5 h-5 text-sky-400 mx-2" />
                    <span className="font-bold text-white text-lg">{selected.arrivalLocation}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-white/40 text-xs">Departure</div>
                    <div className="text-white font-semibold text-sm">{selected.departureTime?.slice(11, 16) || '--:--'}</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs">Arrival</div>
                    <div className="text-white font-semibold text-sm">{selected.arrivalTime?.slice(11, 16) || '--:--'}</div>
                  </div>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" style={{ width: `${Math.min((selected.occupancy / 400) * 100, 100)}%` }} />
                </div>
                <div className="text-xs text-white/40 mb-4">{selected.occupancy} passengers</div>

                <div className="space-y-2">
                  <Link to={`/airlines/${selected.airline?.airlineId}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition">
                    <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400"><Plane className="w-4 h-4" /></div>
                    <div><div className="text-white text-sm">{selected.airline?.airlineName}</div><div className="text-white/30 text-xs">{selected.airline?.iataCode}</div></div>
                  </Link>
                  <Link to={`/pilots/${selected.pilot?.pilotId}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition">
                    <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400"><Award className="w-4 h-4" /></div>
                    <div><div className="text-white text-sm">{selected.pilot?.firstName} {selected.pilot?.lastName}</div><div className="text-white/30 text-xs">Pilot</div></div>
                  </Link>
                  <Link to={`/aircraft/${selected.aircraft?.aircraftId}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400"><Wrench className="w-4 h-4" /></div>
                    <div><div className="text-white text-sm">{selected.aircraft?.model}</div><div className="text-white/30 text-xs">{selected.aircraft?.registration}</div></div>
                  </Link>
                  <Link to={`/crew/${selected.crew?.crewId}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition">
                    <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400"><Users className="w-4 h-4" /></div>
                    <div><div className="text-white text-sm">{selected.crew?.chiefAttendant}</div><div className="text-white/30 text-xs">{selected.crew?.crewCount} crew</div></div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
