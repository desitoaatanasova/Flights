import { useState, useEffect, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SearchBar from '../components/search/SearchBar';
import PilotCard from '../components/cards/PilotCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { aeroApi } from '../api/aeroApi';
import { User } from 'lucide-react';

export default function Pilots() {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    aeroApi.Pilot.list().then(setPilots).finally(() => setLoading(false));
  }, []);

  const nationalities = useMemo(() => [...new Set(pilots.map((p) => p.nationality).filter(Boolean))], [pilots]);

  const filtered = useMemo(() => {
    let list = [...pilots];
    if (nationality) list = list.filter((p) => p.nationality === nationality);
    if (search) list = list.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [pilots, nationality, search]);

  if (loading) {
    return (
      <PageLayout>
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-4xl text-white">Pilots</h1>
            <p className="text-white/40 mt-1">All registered pilots</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select value={nationality} onChange={(e) => setNationality(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/50">
              <option value="">All Nationalities</option>
              {nationalities.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <SearchBar placeholder="Search pilots..." value={search} onChange={setSearch} onClear={() => setSearch('')} className="w-full md:w-56" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={User} title="No pilots found" description="Try a different filter." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => <PilotCard key={p.pilotId} pilot={p} />)}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
