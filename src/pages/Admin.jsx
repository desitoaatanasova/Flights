import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Building2, Wrench, User, Users, Plus, X, AlertTriangle,
  Menu
} from 'lucide-react';
import NavBar from '../components/layout/NavBar';
import DataTable from '../components/admin/DataTable';
import ModalForm from '../components/admin/ModalForm';
import { aeroApi } from '../api/aeroApi';

const sections = [
  { key: 'flights',  label: 'Flights',  icon: Plane,     color: 'text-sky-400', api: aeroApi.Flight },
  { key: 'airlines', label: 'Airlines', icon: Building2,  color: 'text-pink-400', api: aeroApi.Airline },
  { key: 'aircraft', label: 'Aircraft', icon: Wrench,     color: 'text-purple-400', api: aeroApi.Aircraft },
  { key: 'pilots',   label: 'Pilots',   icon: User,       color: 'text-sky-400', api: aeroApi.Pilot },
  { key: 'crew',     label: 'Crew',     icon: Users,      color: 'text-pink-400', api: aeroApi.Crew },
];

const fieldsMap = {
  flights: [
    { key: 'flightNumber', label: 'Flight Number', type: 'text' },
    { key: 'departureLocation', label: 'Departure', type: 'text' },
    { key: 'arrivalLocation', label: 'Arrival', type: 'text' },
    { key: 'departureTime', label: 'Departure Time', type: 'datetime-local' },
    { key: 'arrivalTime', label: 'Arrival Time', type: 'datetime-local' },
    { key: 'occupancy', label: 'Occupancy', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['scheduled', 'active', 'landed', 'delayed', 'cancelled'] },
    { key: 'airlineId', label: 'Airline ID', type: 'number' },
    { key: 'pilotId', label: 'Pilot ID', type: 'number' },
    { key: 'aircraftId', label: 'Aircraft ID', type: 'number' },
    { key: 'crewId', label: 'Crew ID', type: 'number' },
  ],
  airlines: [
    { key: 'airlineName', label: 'Name', type: 'text' },
    { key: 'iataCode', label: 'IATA Code', type: 'text' },
    { key: 'country', label: 'Country', type: 'text' },
    { key: 'fleetSize', label: 'Fleet Size', type: 'number' },
    { key: 'hubAirport', label: 'Hub Airport', type: 'text' },
    { key: 'foundedYear', label: 'Founded', type: 'number' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'logoUrl', label: 'Logo URL', type: 'text' },
  ],
  aircraft: [
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'type', label: 'Type', type: 'text' },
    { key: 'capacity', label: 'Capacity', type: 'number' },
    { key: 'manufactureYear', label: 'Year', type: 'number' },
    { key: 'ownership', label: 'Ownership', type: 'select', options: ['Private', 'Airline Company'] },
    { key: 'registration', label: 'Registration', type: 'text' },
    { key: 'engineType', label: 'Engine', type: 'text' },
    { key: 'rangeKm', label: 'Range (km)', type: 'number' },
    { key: 'imageUrl', label: 'Image URL', type: 'text' },
  ],
  pilots: [
    { key: 'firstName', label: 'First Name', type: 'text' },
    { key: 'lastName', label: 'Last Name', type: 'text' },
    { key: 'age', label: 'Age', type: 'number' },
    { key: 'experienceYears', label: 'Experience (years)', type: 'number' },
    { key: 'nationality', label: 'Nationality', type: 'text' },
    { key: 'licenseNumber', label: 'License Number', type: 'text' },
    { key: 'avatarUrl', label: 'Avatar URL', type: 'text' },
  ],
  crew: [
    { key: 'chiefAttendant', label: 'Chief Attendant', type: 'text' },
    { key: 'crewCount', label: 'Crew Count', type: 'number' },
    { key: 'crewMembers', label: 'Crew Members', type: 'textarea' },
    { key: 'certification', label: 'Certification', type: 'text' },
    { key: 'languageSkills', label: 'Language Skills', type: 'text' },
  ],
};

export default function Admin() {
  const [section, setSection] = useState('flights');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const api = sections.find((s) => s.key === section).api;

  const load = () => {
    setLoading(true);
    setError(null);
    api.list().then(setData).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [section]);

  const currentFields = fieldsMap[section] || [];
  const currentLabel = sections.find((s) => s.key === section)?.label || section;

  const handleSave = async (form) => {
    if (editing) {
      await api.update(editing[`${section.slice(0, -1)}Id`] || editing.id, form);
    } else {
      await api.create(form);
    }
    load();
  };

  const handleDelete = async (row) => {
    try {
      await api.delete(row[`${section.slice(0, -1)}Id`] || row.id);
      load();
    } catch (err) {
      alert('Cannot delete: ' + err.message);
    }
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#060B17]">
      <NavBar />
      <div className="flex pt-16">
        <aside className="hidden lg:block w-56 bg-[#0A0F1E] border-r border-white/5 min-h-[calc(100vh-4rem)] p-4 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = section === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    active ? 'bg-sky-500/10 text-sky-400' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${s.color}`} />
                  <span className="flex-1 text-left">{s.label}</span>
                  <span className="text-xs text-white/20">{data.length}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0F1E] border-t border-white/5">
          <div className="flex overflow-x-auto no-scrollbar">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = section === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition flex-shrink-0 ${
                    active ? 'text-sky-400 bg-sky-500/10' : 'text-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {error ? (
            <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
              <AlertCircle className="w-16 h-16 text-red-400/60 mx-auto mb-4" />
              <p className="text-white/30 text-lg font-display font-semibold">Could not load data</p>
              <p className="text-white/15 text-sm mt-2">Make sure the backend server is running on port 5185</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-display font-bold text-2xl text-white">{currentLabel}</h1>
                  <p className="text-white/40 text-sm">{data.length} records</p>
                </div>
                <button
                  onClick={() => { setEditing(null); setModalOpen(true); }}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  <Plus className="w-4 h-4" /> Add {currentLabel.slice(0, -1)}
                </button>
              </div>

              <DataTable
                columns={currentFields.map((f) => ({ key: f.key, label: f.label, render: (row) => row[f.key] }))}
                data={data}
                onEdit={(row) => { setEditing(row); setModalOpen(true); }}
                onDelete={setConfirmDelete}
              />
            </>
          )}
        </main>
      </div>

      <ModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${currentLabel.slice(0, -1)}` : `Add ${currentLabel.slice(0, -1)}`}
        fields={currentFields}
        initial={editing}
        onSave={handleSave}
      />

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#0D1528] border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center"
            >
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-white mb-2">Confirm Delete</h3>
              <p className="text-white/50 text-sm mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 rounded-xl text-sm bg-red-500 hover:bg-red-400 text-white font-semibold transition">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
