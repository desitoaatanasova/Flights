import { Link } from 'react-router-dom';
import { Plane, MapPin, Clock } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import StatusBadge from '../ui/StatusBadge';
import { format, parseISO } from 'date-fns';

export default function FlightCard({ flight }) {
  const t = (dt) => {
    if (!dt) return '--:--';
    try { return format(parseISO(dt), 'HH:mm'); } catch { return dt?.slice(11, 16) || '--:--'; }
  };

  return (
    <Link to={`/flights/${flight.flightId}`}>
      <GlassCard>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-sky-400" />
            <span className="font-display font-bold text-white">{flight.flightNumber}</span>
          </div>
          <StatusBadge status={flight.status} />
        </div>
        <div className="text-white/50 text-xs mb-2">{flight.airline?.airlineName}</div>

        <div className="flex items-center gap-3 my-4">
          <div className="text-right">
            <div className="text-sky-400 font-semibold text-lg">{t(flight.departureTime)}</div>
          </div>
          <div className="flex-1 relative h-px bg-white/20">
            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-sky-400 font-semibold text-lg">{t(flight.arrivalTime)}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{flight.departureLocation}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{flight.arrivalLocation}</span>
        </div>

        {flight.occupancy !== undefined && (
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Occupancy</span>
              <span>{flight.occupancy}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
                style={{ width: `${Math.min(flight.occupancy, 100)}%` }}
              />
            </div>
          </div>
        )}
      </GlassCard>
    </Link>
  );
}
