import { useState, useEffect, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SearchBar from '../components/search/SearchBar';
import AircraftCard from '../components/cards/AircraftCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { aeroApi } from '../api/aeroApi';
import { Wrench } from 'lucide-react';

export default function AircraftPage() {
  const [aircraft, setAircraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    aeroApi.Aircraft.list().then(setAircraft).finally(() => setLoading(false));
  }, []);

  const types = useMemo(() => [...new Set(aircraft.map((a) => a.type).filter(Boolean))], [aircraft]);

  const filtered = useMemo(() => {
    let list = [...aircraft];
    if (typeFilter) list = list.filter((a) => a.type === typeFilter);
    if (search) list = list.filter((a) => a.model?.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [aircraft, typeFilter, search]);

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
            <h1 className="font-display font-bold text-4xl text-white">Aircraft</h1>
            <p className="text-white/40 mt-1">Fleet overview</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/50">
              <option value="">All Types</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <SearchBar placeholder="Search model..." value={search} onChange={setSearch} onClear={() => setSearch('')} className="w-full md:w-56" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Wrench} title="No aircraft found" description="Try a different filter." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((a) => <AircraftCard key={a.aircraftId} aircraft={a} />)}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
