import { useState, useEffect, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import StatsWidget from '../components/ui/StatsWidget';
import GlassCard from '../components/ui/GlassCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { aeroApi } from '../api/aeroApi';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { Plane, User, Wrench, Users, Activity, Building2, AlertCircle } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0D1528] border border-white/10 rounded-xl p-3 text-sm">
        <p className="text-white font-semibold">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-white/70">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Statistics() {
  const [flights, setFlights] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [crew, setCrew] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      aeroApi.Flight.list(),
      aeroApi.Pilot.list(),
      aeroApi.Aircraft.list(),
      aeroApi.Crew.list(),
      aeroApi.Airline.list(),
    ]).then(([f, p, a, c, al]) => {
      setFlights(f); setPilots(p); setAircraft(a); setCrew(c); setAirlines(al);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const flightsPerAirline = useMemo(() => {
    const map = {};
    flights.forEach((f) => {
      const name = f.airline?.airlineName || 'Unknown';
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, flights: count }));
  }, [flights]);

  const statusDist = useMemo(() => {
    const map = {};
    flights.forEach((f) => { map[f.status] = (map[f.status] || 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({ name: status.charAt(0).toUpperCase() + status.slice(1), value: count }));
  }, [flights]);

  const capacityBuckets = useMemo(() => {
    const b = { '<50': 0, '50-150': 0, '150-250': 0, '>250': 0 };
    aircraft.forEach((a) => {
      if (a.capacity < 50) b['<50']++;
      else if (a.capacity <= 150) b['50-150']++;
      else if (a.capacity <= 250) b['150-250']++;
      else b['>250']++;
    });
    return Object.entries(b).map(([name, value]) => ({ name, value }));
  }, [aircraft]);

  const avgOccupancy = useMemo(() => {
    const map = {};
    flights.forEach((f) => {
      const name = f.airline?.airlineName || 'Unknown';
      if (!map[name]) map[name] = { total: 0, count: 0 };
      map[name].total += f.occupancy || 0;
      map[name].count++;
    });
    return Object.entries(map).map(([name, d]) => ({ name, avg: Math.round(d.total / d.count) }));
  }, [flights]);

  const STATUS_COLORS = { Scheduled: '#38BDF8', Active: '#22C55E', Landed: '#A78BFA', Delayed: '#EAB308', Cancelled: '#EF4444' };

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

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-white">Statistics</h1>
          <p className="text-white/40 mt-1">Key metrics and analytics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <StatsWidget icon={Plane} label="Total Flights" value={flights.length} color="sky" />
          <StatsWidget icon={User} label="Total Pilots" value={pilots.length} color="purple" />
          <StatsWidget icon={Wrench} label="Total Aircraft" value={aircraft.length} color="green" />
          <StatsWidget icon={Users} label="Total Crews" value={crew.length} color="pink" />
          <StatsWidget icon={Activity} label="Active Flights" value={flights.filter((f) => f.status === 'active').length} color="orange" />
          <StatsWidget icon={Building2} label="Airlines" value={airlines.length} color="sky" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="font-display font-semibold text-white mb-4">Flights per Airline</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={flightsPerAirline}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="flights" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="font-display font-semibold text-white mb-4">Flight Status Distribution</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie data={statusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                    {statusDist.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#38BDF8'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 text-sm">
                {statusDist.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] }} />
                    <span className="text-white/60">{s.name}</span>
                    <span className="text-white font-semibold ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-display font-semibold text-white mb-4">Aircraft Capacity Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={capacityBuckets}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#A78BFA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="font-display font-semibold text-white mb-4">Avg Occupancy by Airline</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={avgOccupancy}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg" fill="#F9A8D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>
    </PageLayout>
  );
}
