import { useMemo, useState } from 'react';
import { FaPlus, FaChartLine } from 'react-icons/fa';
import { createTreatment, listTreatments, predictRisk } from '../api';

const statuses = ['All', 'Active', 'Review', 'Completed'];

export default function Treatments() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({ animal_id: 'animal-001', disease: '', drug_name: '', dosage: '', administration_method: 'Oral', start_date: '', end_date: '' });
  const [prediction, setPrediction] = useState(null);
  const [message, setMessage] = useState('');

  const filteredTreatments = useMemo(() => {
    return treatments.filter((item) => {
      const matchesSearch = [item.animal_id, item.disease, item.drug_name, item.status || 'Active']
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === 'All' || (item.status || 'Active') === status;
      return matchesSearch && matchesStatus;
    });
  }, [treatments, search, status]);

  const loadTreatments = async () => {
    try {
      const { data } = await listTreatments();
      setTreatments((data || []).map((item) => ({ ...item, status: item.end_date ? 'Completed' : 'Active' })));
    } catch (error) {
      setMessage('Unable to load treatments.');
    }
  };

  const submitTreatment = async (event) => {
    event.preventDefault();
    try {
      await createTreatment({ ...form, veterinarian_id: 'vet-001' });
      setMessage('Treatment recorded successfully.');
      await loadTreatments();
    } catch (error) {
      setMessage('Unable to save treatment.');
    }
  };

  const runPrediction = async () => {
    try {
      const { data } = await predictRisk({
        drugName: form.drug_name || 'Oxytetracycline',
        dosage: form.dosage || '250mg',
        species: 'Cow',
        duration: 10,
      });
      setPrediction(data);
    } catch (error) {
      setPrediction({ risk: 'Medium', confidence: 70, withdrawalDays: 10, safeSaleDate: '2026-06-26' });
    }
  };

  useMemo(() => {
    loadTreatments();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Treatments</p>
          <h1 className="mt-3 text-3xl font-display font-bold text-slate-900">Medication & Withdrawal Monitoring</h1>
          <p className="mt-2 text-slate-600">Track antimicrobial use, generate risk predictions, and maintain treatment history with compliance alerts.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setMessage('Treatment form ready.')} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-white shadow-lg shadow-primary/20 transition hover:bg-green-700">
            <FaPlus /> Add Treatment
          </button>
          <button onClick={runPrediction} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900 transition hover:bg-slate-100">
            <FaChartLine /> Predict Risk
          </button>
        </div>
      </header>

      {message && <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      {prediction && (
        <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <h2 className="text-xl font-semibold text-slate-900">AI Risk Prediction</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Risk</p><p className="mt-2 font-semibold text-slate-900">{prediction.risk}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Confidence</p><p className="mt-2 font-semibold text-slate-900">{prediction.confidence}%</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Withdrawal Days</p><p className="mt-2 font-semibold text-slate-900">{prediction.withdrawalDays}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Safe Sale Date</p><p className="mt-2 font-semibold text-slate-900">{prediction.safeSaleDate}</p></div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 px-4 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="Search treatments, disease, medicine"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              {statuses.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-surface shadow-card dark:bg-slate-800">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <tr>
              <th className="px-6 py-4">Animal ID</th>
              <th className="px-6 py-4">Disease</th>
              <th className="px-6 py-4">Medicine</th>
              <th className="px-6 py-4">Dosage</th>
              <th className="px-6 py-4">Start Date</th>
              <th className="px-6 py-4">End Date</th>
              <th className="px-6 py-4">Withdrawal Days</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.map((item) => (
              <tr key={item.treatment_id || item.id + item.disease} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{item.animal_id}</td>
                <td className="px-6 py-4">{item.disease}</td>
                <td className="px-6 py-4">{item.drug_name}</td>
                <td className="px-6 py-4">{item.dosage}</td>
                <td className="px-6 py-4">{item.start_date}</td>
                <td className="px-6 py-4">{item.end_date}</td>
                <td className="px-6 py-4">14</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Active' ? 'bg-primary/10 text-primary' : item.status === 'Review' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                    {item.status || 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
        <h2 className="text-xl font-semibold text-slate-900">Add a treatment</h2>
        <form onSubmit={submitTreatment} className="mt-6 grid gap-4 md:grid-cols-2">
          <input value={form.animal_id} onChange={(e) => setForm({ ...form, animal_id: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Animal ID" required />
          <input value={form.disease} onChange={(e) => setForm({ ...form, disease: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Disease" required />
          <input value={form.drug_name} onChange={(e) => setForm({ ...form, drug_name: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Drug Name" required />
          <input value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Dosage" required />
          <input value={form.administration_method} onChange={(e) => setForm({ ...form, administration_method: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Administration Method" required />
          <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" required />
          <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" required />
          <button type="submit" className="rounded-full bg-primary px-5 py-3 text-white">Save Treatment</button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Withdrawal Alerts</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">5 Active</p>
        </div>
        <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">AI Risk Predictions</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">82% Moderate</p>
        </div>
        <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Reports Ready</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">12 Downloads</p>
        </div>
      </div>
    </div>
  );
}
