import { Link } from 'react-router-dom';
import { Users, Calendar, Wrench } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function AircraftCard({ aircraft }) {
  return (
    <Link to={`/aircraft/${aircraft.aircraftId}`}>
      <GlassCard>
        {aircraft.imageUrl ? (
          <img src={aircraft.imageUrl} alt="" className="w-full h-44 object-cover rounded-xl mb-4" />
        ) : (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
            <Wrench className="w-10 h-10 text-white/40" />
          </div>
        )}
        <div className="font-display font-bold text-white mb-1">{aircraft.model}</div>
        <div className="text-purple-400 text-sm mb-2">{aircraft.type}</div>
        {aircraft.registration && (
          <span className="inline-block text-xs font-mono bg-white/5 text-white/50 px-2 py-0.5 rounded mb-3">
            {aircraft.registration}
          </span>
        )}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col items-center bg-white/5 rounded-lg p-2">
            <Users className="w-3.5 h-3.5 text-white/40 mb-1" />
            <span className="text-white/70">{aircraft.capacity}</span>
          </div>
          <div className="flex flex-col items-center bg-white/5 rounded-lg p-2">
            <Calendar className="w-3.5 h-3.5 text-white/40 mb-1" />
            <span className="text-white/70">{aircraft.manufactureYear}</span>
          </div>
          <div className="flex flex-col items-center bg-white/5 rounded-lg p-2">
            <Wrench className="w-3.5 h-3.5 text-white/40 mb-1" />
            <span className="text-white/70">{aircraft.ownership === 'Airline Company' ? 'Airline' : 'Private'}</span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
