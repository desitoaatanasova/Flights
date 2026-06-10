import { Link } from 'react-router-dom';
import { Users, Plane, Star } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function CrewCard({ crew }) {
  return (
    <Link to={`/crew/${crew.crewId}`}>
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-white">{crew.chiefAttendant}</div>
            <div className="text-white/40 text-xs">Chief Attendant</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/50 mb-2">
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{crew.crewCount} members</span>
          {crew.certification && (
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />{crew.certification}</span>
          )}
        </div>
        <div className="text-xs text-white/30">
          {crew.assignedFlight || 'No flight assigned'}
        </div>
      </GlassCard>
    </Link>
  );
}
