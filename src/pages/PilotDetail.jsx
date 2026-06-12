import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, Globe, Calendar, User, Plane, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import FlightCard from '../components/cards/FlightCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { aeroApi } from '../api/aeroApi';

export default function PilotDetail() {
  const { id } = useParams();
  const [pilot, setPilot] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      aeroApi.Pilot.getById(id),
      aeroApi.Flight.list(),
    ]).then(([p, f]) => {
      setPilot(p);
      setFlights(f.filter((fl) => fl.pilotId === p.pilotId));
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
  if (!pilot) return <PageLayout><div className="pt-28 pb-20 max-w-7xl mx-auto px-4 text-white/50">Pilot not found</div></PageLayout>;

  const initials = `${pilot.firstName?.charAt(0) || ''}${pilot.lastName?.charAt(0) || ''}`;

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/pilots" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to pilots
        </Link>

        <GlassCard className="mb-8 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full text-sm font-semibold">
              <Plane className="w-3.5 h-3.5" />{flights.length} flights
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            {pilot.avatarUrl ? (
              <img src={pilot.avatarUrl} alt="" className="w-20 h-20 rounded-full ring-2 ring-sky-500/30 object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-bold text-2xl ring-2 ring-sky-500/30">
                {initials || <User className="w-6 h-6" />}
              </div>
            )}
            <div>
              <div className="font-display font-bold text-3xl text-white">{pilot.firstName} {pilot.lastName}</div>
              <div className="text-white/40 text-sm">{pilot.licenseNumber || 'No license'}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-white/50"><Globe className="w-4 h-4" />{pilot.nationality}</div>
            <div className="flex items-center gap-2 text-white/50"><Award className="w-4 h-4" />{pilot.experienceYears}y experience</div>
            <div className="flex items-center gap-2 text-white/50"><Calendar className="w-4 h-4" />Age {pilot.age}</div>
            <div className="flex items-center gap-2 text-white/50"><User className="w-4 h-4" />{pilot.coPilot ? `Co: ${pilot.coPilot}` : 'No co-pilot'}</div>
          </div>
        </GlassCard>

        <h2 className="font-display font-bold text-2xl text-white mb-6">Assigned Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flights.map((f) => <FlightCard key={f.flightId} flight={f} />)}
          {flights.length === 0 && <p className="text-white/40 col-span-full">No flights assigned yet.</p>}
        </div>
      </div>
    </PageLayout>
  );
}
