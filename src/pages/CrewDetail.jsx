import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Plane, Star, Globe, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import FlightCard from '../components/cards/FlightCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { aeroApi } from '../api/aeroApi';

export default function CrewDetail() {
  const { id } = useParams();
  const [crew, setCrew] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      aeroApi.Crew.getById(id),
      aeroApi.Flight.list(),
    ]).then(([c, f]) => {
      setCrew(c);
      setFlights(f.filter((fl) => fl.crewId === c.crewId));
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
  if (!crew) return <PageLayout><div className="pt-28 pb-20 max-w-7xl mx-auto px-4 text-white/50">Crew not found</div></PageLayout>;

  const members = typeof crew.crewMembers === 'string'
    ? crew.crewMembers.split(',').map((s) => s.trim()).filter(Boolean)
    : (crew.crewMembers || []);

  const languages = typeof crew.languageSkills === 'string'
    ? crew.languageSkills.replace(/[\[\]"]/g, '').split(',').map((s) => s.trim()).filter(Boolean)
    : (crew.languageSkills || []);

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/crew" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to crew
        </Link>

        <GlassCard className="mb-8 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-3xl text-white">{crew.chiefAttendant}</div>
              <div className="text-white/40">Chief Attendant</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/50">
            <span className="flex items-center gap-2"><Users className="w-4 h-4" />{crew.crewCount} members</span>
            {crew.certification && <span className="flex items-center gap-2"><Star className="w-4 h-4" />{crew.certification}</span>}
          </div>
        </GlassCard>

        {members.length > 0 && (
          <GlassCard className="mb-6">
            <h3 className="font-display font-semibold text-white mb-3">Crew Members</h3>
            <div className="flex flex-wrap gap-2">
              {members.map((m, i) => (
                <span key={i} className="bg-white/5 text-white/60 text-xs px-3 py-1.5 rounded-full">{m}</span>
              ))}
            </div>
          </GlassCard>
        )}

        {languages.length > 0 && (
          <GlassCard className="mb-8">
            <h3 className="font-display font-semibold text-white mb-3">Language Skills</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((l, i) => (
                <span key={i} className="bg-sky-500/10 text-sky-400 text-xs px-3 py-1.5 rounded-full">{l}</span>
              ))}
            </div>
          </GlassCard>
        )}

        <h2 className="font-display font-bold text-2xl text-white mb-6">Assigned Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flights.map((f) => <FlightCard key={f.flightId} flight={f} />)}
          {flights.length === 0 && <p className="text-white/40 col-span-full">No flights assigned to this crew yet.</p>}
        </div>
      </div>
    </PageLayout>
  );
}
