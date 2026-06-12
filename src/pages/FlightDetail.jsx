import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plane, MapPin, Clock, Users, Award, Globe, Calendar, Wrench, Star, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { aeroApi } from '../api/aeroApi';
import { format, parseISO } from 'date-fns';

const fmt = (dt) => {
  if (!dt) return '--';
  try { return format(parseISO(dt), 'MMM dd, yyyy HH:mm'); } catch { return dt; }
};

export default function FlightDetail() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    aeroApi.Flight.getById(id).then(setFlight).catch((err) => setError(err.message)).finally(() => setLoading(false));
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
  if (!flight) return <PageLayout><div className="pt-28 pb-20 max-w-7xl mx-auto px-4 text-white/50">Flight not found</div></PageLayout>;

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/flights" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to flights
        </Link>

        <GlassCard className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Plane className="w-6 h-6 text-sky-400" />
              <div>
                <div className="font-display font-bold text-2xl text-white">{flight.flightNumber}</div>
                <div className="text-white/40 text-sm">{flight.airline?.airlineName}</div>
              </div>
            </div>
            <StatusBadge status={flight.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="text-center md:text-right">
              <div className="text-3xl font-bold text-white">{flight.departureLocation}</div>
              <div className="text-sky-400 mt-1">{fmt(flight.departureTime)}</div>
            </div>
            <div className="flex items-center justify-center relative">
              <div className="h-px bg-white/20 flex-1" />
              <Plane className="w-6 h-6 text-sky-400 mx-4" />
              <div className="h-px bg-white/20 flex-1" />
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-white">{flight.arrivalLocation}</div>
              <div className="text-sky-400 mt-1">{fmt(flight.arrivalTime)}</div>
            </div>
          </div>

          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600" style={{ width: `${Math.min(flight.occupancy, 100)}%` }} />
          </div>
          <div className="flex justify-between text-sm text-white/40 mt-1">
            <span>Occupancy</span>
            <span>{flight.occupancy}%</span>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to={`/pilots/${flight.pilot?.pilotId}`}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600"><Award className="w-4 h-4 text-white" /></div>
                <span className="font-display font-bold text-white">Pilot</span>
              </div>
              <div className="text-white text-lg font-semibold">{flight.pilot?.firstName} {flight.pilot?.lastName}</div>
              <div className="text-white/40 text-sm">License: {flight.pilot?.licenseNumber || 'N/A'}</div>
            </GlassCard>
          </Link>

          <Link to={`/aircraft/${flight.aircraft?.aircraftId}`}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600"><Wrench className="w-4 h-4 text-white" /></div>
                <span className="font-display font-bold text-white">Aircraft</span>
              </div>
              <div className="text-white text-lg font-semibold">{flight.aircraft?.model}</div>
              <div className="text-white/40 text-sm">{flight.aircraft?.type} · {flight.aircraft?.registration}</div>
            </GlassCard>
          </Link>

          <Link to={`/crew/${flight.crew?.crewId}`}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600"><Users className="w-4 h-4 text-white" /></div>
                <span className="font-display font-bold text-white">Crew</span>
              </div>
              <div className="text-white text-lg font-semibold">{flight.crew?.chiefAttendant}</div>
              <div className="text-white/40 text-sm">{flight.crew?.crewCount} members</div>
            </GlassCard>
          </Link>

          <Link to={`/airlines/${flight.airline?.airlineId}`}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600"><Globe className="w-4 h-4 text-white" /></div>
                <span className="font-display font-bold text-white">Airline</span>
              </div>
              <div className="text-white text-lg font-semibold">{flight.airline?.airlineName}</div>
              <div className="text-white/40 text-sm">{flight.airline?.iataCode} · {flight.airline?.country}</div>
            </GlassCard>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
