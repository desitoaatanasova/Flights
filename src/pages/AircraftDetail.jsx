import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wrench, Users, Calendar, Fuel, Map, Plane } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import FlightCard from '../components/cards/FlightCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { aeroApi } from '../api/aeroApi';

export default function AircraftDetail() {
  const { id } = useParams();
  const [aircraft, setAircraft] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      aeroApi.Aircraft.getById(id),
      aeroApi.Flight.list(),
    ]).then(([a, f]) => {
      setAircraft(a);
      setFlights(f.filter((fl) => fl.aircraftId === a.aircraftId));
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLayout><div className="pt-28 pb-20 max-w-7xl mx-auto px-4"><CardSkeleton /></div></PageLayout>;
  if (!aircraft) return <PageLayout><div className="pt-28 pb-20 max-w-7xl mx-auto px-4 text-white/50">Aircraft not found</div></PageLayout>;

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/aircraft" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to aircraft
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {aircraft.imageUrl ? (
            <img src={aircraft.imageUrl} alt="" className="w-full h-72 object-cover rounded-2xl" />
          ) : (
            <div className="w-full h-72 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Wrench className="w-16 h-16 text-white/40" />
            </div>
          )}

          <GlassCard>
            <div className="font-display font-bold text-3xl text-white mb-2">{aircraft.model}</div>
            <div className="text-purple-400 mb-3">{aircraft.type}</div>
            {aircraft.registration && (
              <span className="inline-block text-xs font-mono bg-white/5 text-white/50 px-2 py-0.5 rounded mb-4">{aircraft.registration}</span>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div><span className="text-white/40">Capacity</span><div className="text-white font-semibold flex items-center gap-2 mt-1"><Users className="w-4 h-4 text-white/30" />{aircraft.capacity}</div></div>
              <div><span className="text-white/40">Year</span><div className="text-white font-semibold flex items-center gap-2 mt-1"><Calendar className="w-4 h-4 text-white/30" />{aircraft.manufactureYear}</div></div>
              <div><span className="text-white/40">Engine</span><div className="text-white font-semibold flex items-center gap-2 mt-1"><Fuel className="w-4 h-4 text-white/30" />{aircraft.engineType || 'N/A'}</div></div>
              <div><span className="text-white/40">Range</span><div className="text-white font-semibold flex items-center gap-2 mt-1"><Map className="w-4 h-4 text-white/30" />{aircraft.rangeKm ? `${aircraft.rangeKm} km` : 'N/A'}</div></div>
            </div>
            <div className="mt-4"><span className="text-white/40">Ownership</span><div className="text-white font-semibold mt-1">{aircraft.ownership}</div></div>
          </GlassCard>
        </div>

        <h2 className="font-display font-bold text-2xl text-white mb-6">Flight History</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flights.map((f) => <FlightCard key={f.flightId} flight={f} />)}
          {flights.length === 0 && <p className="text-white/40 col-span-full">No flights assigned to this aircraft yet.</p>}
        </div>
      </div>
    </PageLayout>
  );
}
