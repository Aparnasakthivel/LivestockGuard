import { useMemo, useState } from 'react';
import { FaFilePrescription, FaStethoscope, FaCheckCircle, FaClipboardList } from 'react-icons/fa';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

const kpis = [
  { label: 'Prescriptions Issued', value: '124', tone: 'bg-primary/10 text-primary' },
  { label: 'Active Cases', value: '39', tone: 'bg-secondary/10 text-secondary' },
  { label: 'High Risk Farms', value: '7', tone: 'bg-warning/10 text-warning' },
  { label: 'Follow-up Visits', value: '18', tone: 'bg-success/10 text-success' },
];

const prescriptions = [
  { id: 'PRX-221', animal: 'ANM001', drug: 'Oxytetracycline', status: 'Approved', risk: 'Low' },
  { id: 'PRX-224', animal: 'ANM012', drug: 'Ciprofloxacin', status: 'Pending', risk: 'High' },
];

const radarData = [
  { metric: 'Adherence', value: 78 },
  { metric: 'Withdrawal Safety', value: 82 },
  { metric: 'Clinical Confidence', value: 90 },
  { metric: 'MRL Compliance', value: 86 },
  { metric: 'Response Time', value: 74 },
];

export default function VeterinarianDashboard() {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('Prescription review queue is active.');

  const filtered = useMemo(() => prescriptions.filter((item) => [item.id, item.animal, item.drug, item.status].join(' ').toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-gradient-to-br from-secondary/10 via-white to-primary/10 p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-secondary">Veterinarian Portal</p>
            <h1 className="mt-3 text-3xl font-display font-bold text-slate-900 sm:text-4xl">Clinical oversight and prescription review</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Approve prescriptions, monitor withdrawal risks, and keep field cases aligned with MRL standards.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-white"><FaFilePrescription /> Create Prescription</button>
        </div>
      </div>

      {message && <div className="mt-4 rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <div key={item.label} className="rounded-[28px] bg-white p-6 shadow-card">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
            <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-medium ${item.tone}`}>{item.label === 'High Risk Farms' ? 'Escalated' : 'Tracked'}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[32px] bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-secondary/10 p-3 text-secondary"><FaStethoscope /></div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Case readiness</h2>
              <p className="text-sm text-slate-500">Operational confidence across veterinary workflows.</p>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar dataKey="value" stroke="#1565C0" fill="#1565C0" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary"><FaClipboardList /></div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent prescriptions</h2>
              <p className="text-sm text-slate-500">Review pending and approved treatments.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none sm:w-72" placeholder="Search prescriptions" />
            <button onClick={() => setMessage('Prescription queue refreshed.')} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700">Refresh</button>
          </div>
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th className="px-6 py-4">Prescription</th>
                  <th className="px-6 py-4">Animal</th>
                  <th className="px-6 py-4">Drug</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.id}</td>
                    <td className="px-6 py-4">{item.animal}</td>
                    <td className="px-6 py-4">{item.drug}</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Approved' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>{item.status}</span></td>
                    <td className="px-6 py-4"><button onClick={() => setMessage(`Reviewed ${item.id}.`)} className="rounded-full bg-secondary px-4 py-2 text-white">Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
