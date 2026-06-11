import { Link } from 'react-router-dom';
import { User, Globe, Award } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function PilotCard({ pilot }) {
  const initials = `${pilot.firstName?.charAt(0) || ''}${pilot.lastName?.charAt(0) || ''}`;

  return (
    <Link to={`/pilots/${pilot.pilotId}`}>
      <GlassCard>
        <div className="flex items-center gap-3 mb-3">
          {pilot.avatarUrl ? (
            <img src={pilot.avatarUrl} alt="" className="w-14 h-14 rounded-full ring-2 ring-sky-500/30 object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-bold text-lg ring-2 ring-sky-500/30">
              {initials || <User className="w-5 h-5" />}
            </div>
          )}
          <div>
            <div className="font-display font-bold text-white">{pilot.firstName} {pilot.lastName}</div>
            {pilot.licenseNumber && (
              <div className="text-white/40 text-xs">{pilot.licenseNumber}</div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-white/50">
            <Globe className="w-3.5 h-3.5" /> {pilot.nationality}
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <Award className="w-3.5 h-3.5" /> {pilot.experienceYears}y exp
          </div>
        </div>
        {pilot.coPilot && (
          <div className="mt-3 text-xs text-white/30 border-t border-white/5 pt-2">
            Co-pilot: <span className="text-white/50">{pilot.coPilot}</span>
          </div>
        )}
      </GlassCard>
    </Link>
  );
}
