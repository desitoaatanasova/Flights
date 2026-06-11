import { Link } from 'react-router-dom';
import { Plane, Globe, Building2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function AirlineCard({ airline }) {
  const initial = airline.airlineName?.charAt(0) || '?';

  return (
    <Link to={`/airlines/${airline.airlineId}`}>
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          {airline.logoUrl ? (
            <img src={airline.logoUrl} alt="" className="w-12 h-12 rounded-xl bg-white p-1 object-contain" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center font-bold text-lg">
              {initial}
            </div>
          )}
          <div>
            <div className="font-display font-bold text-white">{airline.airlineName}</div>
            <span className="inline-block text-xs font-semibold bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded mt-1">
              {airline.iataCode}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-white/50">
            <Globe className="w-3.5 h-3.5" /> {airline.country}
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <Plane className="w-3.5 h-3.5" /> {airline.fleetSize} aircraft
          </div>
        </div>
        {airline.flightCount > 0 && (
          <div className="mt-3 text-xs text-white/30">{airline.flightCount} flights</div>
        )}
      </GlassCard>
    </Link>
  );
}
