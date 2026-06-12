import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Grid3x3, Plane, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import SearchBar from '../components/search/SearchBar';
import FlightCard from '../components/cards/FlightCard';
import { CardSkeleton, TableSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { aeroApi } from '../api/aeroApi';
import { format, parseISO } from 'date-fns';

export default function Flights() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [airlineFilter, setAirlineFilter] = useState('');
  const [sort, setSort] = useState('departure_time');
  const [view, setView] = useState('grid');

  useEffect(() => {
    aeroApi.Flight.list().then(setFlights).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const uniqueAirlines = useMemo(
    () => [...new Set(flights.map((f) => f.airline?.airlineName).filter(Boolean))],
    [flights]
  );

  const filtered = useMemo(() => {
    let list = [...flights];
    if (search) list = list.filter((f) => f.flightNumber?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter) list = list.filter((f) => f.status === statusFilter);
    if (airlineFilter) list = list.filter((f) => f.airline?.airlineName === airlineFilter);
    list.sort((a, b) => {
      if (sort === 'departure_time') return new Date(a.departureTime) - new Date(b.departureTime);
      return 0;
    });
    return list;
  }, [flights, search, statusFilter, airlineFilter, sort]);

  const t = (dt) => {
    if (!dt) return '--';
    try { return format(parseISO(dt), 'MMM dd, HH:mm'); } catch { return dt?.slice(0, 16)?.replace('T', ' ') || '--'; }
  };

  if (error) {
    return (
      <PageLayout>
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center min-h-[60vh]">
          <AlertCircle className="w-16 h-16 text-red-400/60 mx-auto mb-4" />
          <p className="text-white/30 text-lg font-display font-semibold">Could not load data</p>
          <p className="text-white/15 text-sm mt-2">Make sure the backend server is running on port 5185</p>
        </div>
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-white">Flights</h1>
          <p className="text-white/40 mt-1">Browse and manage all flights in the network</p>
        </div>

        <GlassCard className="mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <SearchBar placeholder="Search by flight number..." value={search} onChange={setSearch} onClear={() => setSearch('')} className="flex-1" />
            <select value={airlineFilter} onChange={(e) => setAirlineFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/50">
              <option value="">All Airlines</option>
              {uniqueAirlines.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/50">
              <option value="">All Status</option>
              {['scheduled', 'active', 'landed', 'delayed', 'cancelled'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </GlassCard>

        <div className="flex items-center justify-between mb-6">
          <div className="text-white/40 text-sm">{filtered.length} flights found</div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-sky-500/20 text-sky-400' : 'text-white/40 hover:text-white'}`}>
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView('table')} className={`p-1.5 rounded ${view === 'table' ? 'bg-sky-500/20 text-sky-400' : 'text-white/40 hover:text-white'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Plane} title="No flights found" description="Try adjusting your filters or search query." />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((f) => <FlightCard key={f.flightId} flight={f} />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-white/50 text-left">
                  <th className="px-4 py-3 font-medium">Flight #</th>
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">To</th>
                  <th className="px-4 py-3 font-medium">Departure</th>
                  <th className="px-4 py-3 font-medium">Arrival</th>
                  <th className="px-4 py-3 font-medium">Airline</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr
                    key={f.flightId}
                    onClick={() => navigate(`/flights/${f.flightId}`)}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition"
                  >
                    <td className="px-4 py-3 font-semibold text-white">{f.flightNumber}</td>
                    <td className="px-4 py-3 text-white/60">{f.departureLocation}</td>
                    <td className="px-4 py-3 text-white/60">{f.arrivalLocation}</td>
                    <td className="px-4 py-3 text-white/60">{t(f.departureTime)}</td>
                    <td className="px-4 py-3 text-white/60">{t(f.arrivalTime)}</td>
                    <td className="px-4 py-3 text-white/60">{f.airline?.airlineName}</td>
                    <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
