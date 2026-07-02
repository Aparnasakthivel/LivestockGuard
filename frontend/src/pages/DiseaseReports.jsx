import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaUserMd, FaCheckCircle, FaFileExport } from 'react-icons/fa';
import { createDiseaseReport, deleteDiseaseReport, listDiseaseReports, updateDiseaseReport } from '../api';
import { downloadCsv } from '../utils/exportUtils';

export default function DiseaseReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ animal_id: '', disease: '', severity: 'Moderate', assigned_vet: 'Dr. Anjali Sharma' });

  const filtered = useMemo(() => {
    return reports.filter((item) => [item.animal_id, item.disease, item.status].join(' ').toLowerCase().includes(search.toLowerCase()));
  }, [reports, search]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const { data } = await listDiseaseReports();
      setReports(data || []);
    } catch (error) {
      setMessage('Unable to load disease reports.');
    } finally {
      setLoading(false);
    }
  };

  const resolveReport = async (id) => {
    const existing = reports.find((item) => item.report_id === id);
    try {
      await updateDiseaseReport(id, { ...existing, status: 'Resolved' });
      setMessage('Disease report resolved and archived.');
      await loadReports();
    } catch (error) {
      setMessage('Unable to update report.');
    }
  };

  const addReport = async (event) => {
    event.preventDefault();
    try {
      await createDiseaseReport({ ...form, status: 'Under Review' });
      setForm({ animal_id: '', disease: '', severity: 'Moderate', assigned_vet: 'Dr. Anjali Sharma' });
      setShowForm(false);
      setMessage('New disease report submitted to the veterinary team.');
      await loadReports();
    } catch (error) {
      setMessage('Unable to submit disease report.');
    }
  };

  const removeReport = async (id) => {
    try {
      await deleteDiseaseReport(id);
      setMessage('Disease report removed.');
      await loadReports();
    } catch (error) {
      setMessage('Unable to remove report.');
    }
  };

  const exportReports = () => {
    const headers = ['Animal ID', 'Disease', 'Severity', 'Status'];
    const rows = filtered.map((item) => [item.animal_id, item.disease, item.severity, item.status]);
    downloadCsv(`disease-reports-${Date.now()}.csv`, rows, headers);
    setMessage('Disease report export generated.');
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Disease Reports</p>
          <h1 className="mt-3 text-3xl font-display font-bold text-slate-900">Field Incident Management</h1>
          <p className="mt-2 text-slate-600">Coordinate disease observations, assign veterinarians, and resolve incidents quickly.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-white"><FaPlus /> Add Report</button>
          <button onClick={() => setMessage('Veterinary team assignment updated for the next review cycle.')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900"><FaUserMd /> Assign Vet</button>
          <button onClick={exportReports} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900"><FaFileExport /> Export</button>
        </div>
      </header>

      {message && <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="rounded-[28px] bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Search disease or animal ID" />
        </div>
        {showForm && (
          <form onSubmit={addReport} className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
            <input value={form.animal_id} onChange={(e) => setForm({ ...form, animal_id: e.target.value })} className="rounded-3xl border border-slate-200 bg-white px-4 py-3" placeholder="Animal ID" required />
            <input value={form.disease} onChange={(e) => setForm({ ...form, disease: e.target.value })} className="rounded-3xl border border-slate-200 bg-white px-4 py-3" placeholder="Disease" required />
            <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="rounded-3xl border border-slate-200 bg-white px-4 py-3">
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
            <input value={form.assigned_vet} onChange={(e) => setForm({ ...form, assigned_vet: e.target.value })} className="rounded-3xl border border-slate-200 bg-white px-4 py-3" placeholder="Assigned Vet" required />
            <button type="submit" className="rounded-full bg-primary px-4 py-3 text-white md:col-span-2">Submit report</button>
          </form>
        )}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading ? <div className="text-sm text-slate-500">Loading reports…</div> : filtered.map((item) => (
            <div key={item.report_id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.disease}</h2>
                  <p className="text-sm text-slate-500">Animal {item.animal_id}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Resolved' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>{item.status}</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <div>Severity: {item.severity}</div>
                <div>Assigned Vet: {item.assigned_vet}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => resolveReport(item.report_id)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-white"><FaCheckCircle /> Resolve</button>
                <button onClick={() => removeReport(item.report_id)} className="rounded-full bg-danger/10 px-4 py-2 text-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
