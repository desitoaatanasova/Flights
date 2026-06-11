import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plane, Building2, Wrench, User, Users, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import { aeroApi } from '../api/aeroApi';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'Flight', label: 'Flights', icon: Plane, color: 'text-sky-400' },
  { key: 'Airline', label: 'Airlines', icon: Building2, color: 'text-pink-400' },
  { key: 'Aircraft', label: 'Aircraft', icon: Wrench, color: 'text-purple-400' },
  { key: 'Pilot', label: 'Pilots', icon: User, color: 'text-sky-400' },
  { key: 'Crew', label: 'Crew', icon: Users, color: 'text-pink-400' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [crew, setCrew] = useState([]);

  useEffect(() => {
    Promise.all([
      aeroApi.Flight.list(),
      aeroApi.Airline.list(),
      aeroApi.Aircraft.list(),
      aeroApi.Pilot.list(),
      aeroApi.Crew.list(),
    ]).then(([f, al, ac, p, c]) => {
      setFlights(f); setAirlines(al); setAircraft(ac); setPilots(p); setCrew(c);
    });
  }, []);

  const filter = useCallback((items, fields) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return items.filter((item) => fields.some((f) => String(item[f] || '').toLowerCase().includes(q)));
  }, [query]);

  const results = useMemo(() => {
    const f = category === 'all' || category === 'Flight' ? filter(flights, ['flightNumber', 'departureLocation', 'arrivalLocation', 'airline']) : [];
    const al = category === 'all' || category === 'Airline' ? filter(airlines, ['airlineName', 'iataCode', 'country']) : [];
    const ac = category === 'all' || category === 'Aircraft' ? filter(aircraft, ['model', 'type', 'registration']) : [];
    const p = category === 'all' || category === 'Pilot' ? filter(pilots, ['firstName', 'lastName', 'nationality', 'licenseNumber']) : [];
    const c = category === 'all' || category === 'Crew' ? filter(crew, ['chiefAttendant', 'certification']) : [];
    return { Flight: f, Airline: al, Aircraft: ac, Pilot: p, Crew: c };
  }, [category, filter, flights, airlines, aircraft, pilots, crew]);

  const hasResults = Object.values(results).some((r) => r.length > 0);

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-white mb-2">Search</h1>
          <p className="text-white/40">Search across all entities</p>
        </div>

        <GlassCard className="mb-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search flights, airlines, aircraft, pilots, crew..."
              className="w-full bg-transparent border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-sky-500/50 transition"
            />
          </div>
        </GlassCard>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  active ? 'bg-sky-500/20 text-sky-400' : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {cat.label}
              </button>
            );
          })}
        </div>

        {!query && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg">Type to search</p>
          </div>
        )}

        {query && !hasResults && (
          <div className="text-center py-10 text-white/40">No results found for "{query}"</div>
        )}

        {query && hasResults && (
          <div className="space-y-8">
            {Object.entries(results).map(([entity, items]) => {
              if (items.length === 0) return null;
              const cat = categories.find((c) => c.key === entity);
              const Icon = cat?.icon || Search;
              const color = cat?.color || 'text-white';

              return (
                <motion.div key={entity} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <h2 className="font-display font-semibold text-lg text-white">{cat?.label}</h2>
                    <span className="text-white/30 text-sm ml-auto">{items.length} found</span>
                  </div>
                  <div className="space-y-2">
                    {items.slice(0, 5).map((item) => {
                      const link = `/${entity.toLowerCase()}s/${item[`${entity.toLowerCase()}Id`] || item.id}`;
                      return (
                        <Link key={item[`${entity.toLowerCase()}Id`] || item.id} to={link}>
                          <GlassCard className="!p-3 flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${color}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-medium truncate">
                                {entity === 'Flight' && item.flightNumber}
                                {entity === 'Airline' && item.airlineName}
                                {entity === 'Aircraft' && item.model}
                                {entity === 'Pilot' && `${item.firstName} ${item.lastName}`}
                                {entity === 'Crew' && item.chiefAttendant}
                              </div>
                              <div className="text-white/30 text-xs truncate">
                                {entity === 'Flight' && `${item.departureLocation} → ${item.arrivalLocation}`}
                                {entity === 'Airline' && `${item.country} · ${item.iataCode}`}
                                {entity === 'Aircraft' && `${item.type} · ${item.registration || ''}`}
                                {entity === 'Pilot' && `${item.nationality} · ${item.licenseNumber || ''}`}
                                {entity === 'Crew' && `${item.crewCount} members`}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/20" />
                          </GlassCard>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
