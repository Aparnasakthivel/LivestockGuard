import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaBell, FaFileExport } from 'react-icons/fa';
import { createVaccination, deleteVaccination, listVaccinations, updateVaccination } from '../api';
import { downloadCsv } from '../utils/exportUtils';

export default function Vaccinations() {
  const [vaccinations, setVaccinations] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ animal_id: '', vaccine: '', scheduled_date: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const filtered = useMemo(() => {
    return vaccinations.filter((item) => [item.animal_id, item.vaccine, item.status].join(' ').toLowerCase().includes(search.toLowerCase()));
  }, [vaccinations, search]);

  const loadVaccinations = async () => {
    try {
      setLoading(true);
      const { data } = await listVaccinations();
      setVaccinations(data || []);
      setMessage('Vaccination reminders are active for this week.');
    } catch (error) {
      setMessage('Unable to load vaccination records.');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (id) => {
    const existing = vaccinations.find((item) => item.vaccination_id === id);
    try {
      await updateVaccination(id, { ...existing, status: 'Completed' });
      setMessage('Vaccination marked as completed.');
      await loadVaccinations();
    } catch (error) {
      setMessage('Unable to update vaccination status.');
    }
  };

  const addVaccination = async (event) => {
    event.preventDefault();
    if (!form.animal_id || !form.vaccine || !form.scheduled_date) {
      setMessage('Please complete all vaccination fields.');
      return;
    }
    try {
      await createVaccination({ ...form, status: 'Pending' });
      setForm({ animal_id: '', vaccine: '', scheduled_date: '' });
      setShowForm(false);
      setMessage('New vaccination reminder scheduled.');
      await loadVaccinations();
    } catch (error) {
      setMessage('Unable to schedule vaccination.');
    }
  };

  const removeVaccination = async (id) => {
    try {
      await deleteVaccination(id);
      setMessage('Vaccination deleted.');
      await loadVaccinations();
    } catch (error) {
      setMessage('Unable to delete vaccination.');
    }
  };

  const exportVaccinations = () => {
    const headers = ['Animal ID', 'Vaccine', 'Scheduled Date', 'Status'];
    const rows = filtered.map((item) => [item.animal_id, item.vaccine, item.scheduled_date, item.status]);
    downloadCsv(`vaccinations-${Date.now()}.csv`, rows, headers);
    setMessage('Vaccination export generated.');
  };

  useEffect(() => {
    loadVaccinations();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Vaccinations</p>
          <h1 className="mt-3 text-3xl font-display font-bold text-slate-900">Immunization Workflow</h1>
          <p className="mt-2 text-slate-600">Track vaccinations, issue reminders, and keep records audit-ready.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-white"><FaPlus /> Add Vaccine</button>
          <button onClick={() => setMessage('Reminder workflow is active for the next 7 days.')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900"><FaBell /> Reminder</button>
          <button onClick={exportVaccinations} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900"><FaFileExport /> Export</button>
        </div>
      </header>

      {message && <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="rounded-[28px] bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Search vaccines or animal IDs" />
        </div>
        {showForm && (
          <form onSubmit={addVaccination} className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
            <input value={form.animal_id} onChange={(e) => setForm({ ...form, animal_id: e.target.value })} className="rounded-3xl border border-slate-200 bg-white px-4 py-3" placeholder="Animal ID" required />
            <input value={form.vaccine} onChange={(e) => setForm({ ...form, vaccine: e.target.value })} className="rounded-3xl border border-slate-200 bg-white px-4 py-3" placeholder="Vaccine" required />
            <input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} className="rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
            <button type="submit" className="rounded-full bg-primary px-4 py-3 text-white md:col-span-3">Schedule reminder</button>
          </form>
        )}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          {loading ? <div className="p-6 text-sm text-slate-500">Loading vaccinations…</div> : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-6 py-4">Animal ID</th>
                  <th className="px-6 py-4">Vaccine</th>
                  <th className="px-6 py-4">Scheduled Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.vaccination_id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">{item.animal_id}</td>
                    <td className="px-6 py-4">{item.vaccine}</td>
                    <td className="px-6 py-4">{item.scheduled_date}</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Completed' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>{item.status}</span></td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => markComplete(item.vaccination_id)} className="rounded-full bg-secondary/10 px-3 py-2 text-secondary">Mark Complete</button>
                      <button onClick={() => removeVaccination(item.vaccination_id)} className="rounded-full bg-danger/10 px-3 py-2 text-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
