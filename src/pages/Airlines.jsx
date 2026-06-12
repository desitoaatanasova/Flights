import { useState, useEffect, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SearchBar from '../components/search/SearchBar';
import AirlineCard from '../components/cards/AirlineCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { aeroApi } from '../api/aeroApi';
import { Building2, AlertCircle } from 'lucide-react';

export default function Airlines() {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    aeroApi.Airline.list().then(setAirlines).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => airlines.filter((a) => a.airlineName?.toLowerCase().includes(search.toLowerCase())),
    [airlines, search]
  );

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

  if (loading) {
    return (
      <PageLayout>
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
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
            <h1 className="font-display font-bold text-4xl text-white">Airlines</h1>
            <p className="text-white/40 mt-1">All airlines in the network</p>
          </div>
          <SearchBar placeholder="Search airlines..." value={search} onChange={setSearch} onClear={() => setSearch('')} className="w-full md:w-64" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Building2} title="No airlines found" description="Try a different search." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((a) => <AirlineCard key={a.airlineId} airline={a} />)}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
