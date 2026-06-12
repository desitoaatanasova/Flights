import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Search, ArrowRight, Radar, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import StatsWidget from '../components/ui/StatsWidget';
import FlightCard from '../components/cards/FlightCard';
import AirlineCard from '../components/cards/AirlineCard';
import AircraftCard from '../components/cards/AircraftCard';
import { aeroApi } from '../api/aeroApi';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';

const planes = [
  { top: '15%', left: '-10%', speed: 25, delay: 0, size: 24 },
  { top: '30%', left: '20%', speed: 35, delay: 2, size: 20 },
  { top: '55%', left: '-5%', speed: 30, delay: 4, size: 28 },
  { top: '70%', left: '30%', speed: 40, delay: 1, size: 18 },
  { top: '85%', left: '-15%', speed: 20, delay: 3, size: 22 },
  { top: '45%', left: '50%', speed: 45, delay: 5, size: 16 },
];

export default function Home() {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      aeroApi.Flight.list(),
      aeroApi.Airline.list(),
      aeroApi.Aircraft.list(),
    ]).then(([f, al, ac]) => {
      setFlights(f);
      setAirlines(al);
      setAircraft(ac);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const activeFlights = flights.filter((f) => f.status === 'active').length;

  if (error) {
    return (
      <PageLayout>
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center min-h-[80vh]">
          <AlertCircle className="w-16 h-16 text-red-400/60 mx-auto mb-4" />
          <p className="text-white/30 text-lg font-display font-semibold">Could not load data</p>
          <p className="text-white/15 text-sm mt-2">Make sure the backend server is running on port 5185</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060B17]/60 via-[#060B17]/40 to-[#060B17] z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920)' }}
        />

        {planes.map((p, i) => (
          <motion.div
            key={i}
            className="absolute z-20 text-sky-500/15"
            style={{ top: p.top }}
            initial={{ left: p.left }}
            animate={{ left: '110%' }}
            transition={{ duration: p.speed, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          >
            <Plane size={p.size} />
          </motion.div>
        ))}

        <div className="relative z-30 text-center max-w-2xl px-4 pt-20">
          <span className="inline-block text-xs font-semibold bg-sky-500/10 text-sky-400 px-3 py-1.5 rounded-full mb-6">
            Live Flight Tracking
          </span>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight mb-4">
            Track Every Flight,{' '}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Anywhere.</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg mb-8 max-w-lg mx-auto">
            Real-time flight tracking, airline management, and crew scheduling — all in one modern dashboard.
          </p>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 max-w-md mx-auto mb-12">
            <Search className="w-5 h-5 text-white/30 ml-3" />
            <input
              type="text"
              placeholder="Search flights, airlines..."
              className="flex-1 bg-transparent text-white text-sm py-2.5 placeholder:text-white/30 focus:outline-none"
            />
            <Link to="/search" className="bg-sky-500 hover:bg-sky-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
              Search
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsWidget icon={Plane} label="Total Flights" value={flights.length} color="sky" delay={0.1} />
            <StatsWidget icon={Plane} label="Active Now" value={activeFlights} color="green" delay={0.2} />
            <StatsWidget icon={Plane} label="Airlines" value={airlines.length} color="purple" delay={0.3} />
            <StatsWidget icon={Plane} label="Aircraft" value={aircraft.length} color="pink" delay={0.4} />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-20 relative z-40">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-white">Latest Flights</h2>
            <p className="text-white/40 mt-1">Most recent scheduled flights</p>
          </div>
          <Link to="/flights" className="flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : flights.slice(0, 6).map((f) => <FlightCard key={f.flightId} flight={f} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-white">Featured Airlines</h2>
            <p className="text-white/40 mt-1">Airlines in the network</p>
          </div>
          <Link to="/airlines" className="flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : airlines.map((a) => <AirlineCard key={a.airlineId} airline={a} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-white">Featured Aircraft</h2>
            <p className="text-white/40 mt-1">Our diverse fleet</p>
          </div>
          <Link to="/aircraft" className="flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : aircraft.slice(0, 4).map((a) => <AircraftCard key={a.aircraftId} aircraft={a} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Link to="/radar">
          <GlassCard className="!p-10 text-center bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-purple-500/10 border-sky-500/20">
            <Radar className="w-12 h-12 text-sky-400 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-white mb-2">Open Flight Radar</h2>
            <p className="text-white/50 mb-4">View all active flights on a live interactive map</p>
            <span className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
              Launch Radar <ArrowRight className="w-4 h-4" />
            </span>
          </GlassCard>
        </Link>
      </section>
    </PageLayout>
  );
}
