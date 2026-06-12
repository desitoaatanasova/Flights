import { useState, useEffect, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SearchBar from '../components/search/SearchBar';
import CrewCard from '../components/cards/CrewCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { aeroApi } from '../api/aeroApi';
import { Users, AlertCircle } from 'lucide-react';

export default function CrewPage() {
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    aeroApi.Crew.list().then(setCrew).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => crew.filter((c) => c.chiefAttendant?.toLowerCase().includes(search.toLowerCase())),
    [crew, search]
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
            <h1 className="font-display font-bold text-4xl text-white">Crew Teams</h1>
            <p className="text-white/40 mt-1">Cabin crew teams</p>
          </div>
          <SearchBar placeholder="Search chief attendant..." value={search} onChange={setSearch} onClear={() => setSearch('')} className="w-full md:w-64" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No crew found" description="Try a different search." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((c) => <CrewCard key={c.crewId} crew={c} />)}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
