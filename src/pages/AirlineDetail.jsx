import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Plane, Building2, Calendar, MapPin, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import FlightCard from '../components/cards/FlightCard';
import StatsWidget from '../components/ui/StatsWidget';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { aeroApi } from '../api/aeroApi';

export default function AirlineDetail() {
  const { id } = useParams();
  const [airline, setAirline] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      aeroApi.Airline.getById(id),
      aeroApi.Flight.list({ airlineId: id }),
    ]).then(([a, f]) => {
      setAirline(a);
      setFlights(f);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

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

  if (loading) return <PageLayout><div className="pt-28 pb-20 max-w-7xl mx-auto px-4"><CardSkeleton /></div></PageLayout>;
  if (!airline) return <PageLayout><div className="pt-28 pb-20 max-w-7xl mx-auto px-4 text-white/50">Airline not found</div></PageLayout>;

  const active = flights.filter((f) => f.status === 'active').length;
  const scheduled = flights.filter((f) => f.status === 'scheduled').length;
  const landed = flights.filter((f) => f.status === 'landed').length;

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/airlines" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to airlines
        </Link>

        <GlassCard className="mb-8 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-4 mb-4">
            {airline.logoUrl ? (
              <img src={airline.logoUrl} alt="" className="w-16 h-16 rounded-xl bg-white p-1 object-contain" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center font-bold text-2xl">
                {airline.airlineName?.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-display font-bold text-3xl text-white">{airline.airlineName}</div>
              <span className="inline-block text-xs font-semibold bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded mt-1">
                {airline.iataCode}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-white/50"><Globe className="w-4 h-4" />{airline.country}</div>
            <div className="flex items-center gap-2 text-white/50"><Plane className="w-4 h-4" />{airline.fleetSize} aircraft</div>
            <div className="flex items-center gap-2 text-white/50"><Building2 className="w-4 h-4" />{airline.hubAirport}</div>
            <div className="flex items-center gap-2 text-white/50"><Calendar className="w-4 h-4" />Founded {airline.foundedYear}</div>
          </div>
          {airline.description && <p className="text-white/40 text-sm mt-4">{airline.description}</p>}
        </GlassCard>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatsWidget icon={Plane} label="Total Flights" value={flights.length} color="sky" />
          <StatsWidget icon={Plane} label="Active" value={active} color="green" />
          <StatsWidget icon={Plane} label="Scheduled" value={scheduled} color="purple" />
          <StatsWidget icon={Plane} label="Landed" value={landed} color="pink" />
        </div>

        <h2 className="font-display font-bold text-2xl text-white mb-6">Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flights.map((f) => <FlightCard key={f.flightId} flight={f} />)}
        </div>
      </div>
    </PageLayout>
  );
}
