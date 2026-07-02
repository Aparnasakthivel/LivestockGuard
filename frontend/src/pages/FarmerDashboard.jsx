import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaFileAlt, FaPlus, FaQrcode, FaPills } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const initialStats = [
  { title: 'Total Animals', value: '156', tone: 'bg-primary/10 text-primary' },
  { title: 'Healthy Animals', value: '138', tone: 'bg-success/10 text-success' },
  { title: 'Active Treatments', value: '28', tone: 'bg-secondary/10 text-secondary' },
  { title: 'Withdrawal Alerts', value: '5', tone: 'bg-warning/10 text-warning' },
  { title: 'Compliance %', value: '94%', tone: 'bg-accent/10 text-accent' },
  { title: 'Milk Collection', value: '2,180L', tone: 'bg-slate-100 text-slate-700' },
];

const animals = [
  { id: 'ANM001', species: 'Cow', breed: 'Sahiwal', status: 'Healthy', farm: 'Green Valley' },
  { id: 'ANM012', species: 'Goat', breed: 'Kanni', status: 'Under Treatment', farm: 'Green Valley' },
  { id: 'ANM028', species: 'Poultry', breed: 'Broiler', status: 'Warning', farm: 'North Farm' },
];

const trendData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 42 },
  { name: 'Mar', value: 38 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 48 },
  { name: 'Jun', value: 62 },
];

const pieData = [
  { name: 'Cows', value: 45 },
  { name: 'Goats', value: 30 },
  { name: 'Poultry', value: 15 },
  { name: 'Buffalo', value: 10 },
];

const monthlyMilkData = [
  { month: 'Jan', liters: 1900 },
  { month: 'Feb', liters: 2050 },
  { month: 'Mar', liters: 2140 },
  { month: 'Apr', liters: 2210 },
  { month: 'May', liters: 2180 },
  { month: 'Jun', liters: 2260 },
];

const COLORS = ['#2E7D32', '#1565C0', '#FF9800', '#4CAF50'];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filtered, setFiltered] = useState(animals);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
      setMessage('Dashboard refreshed.');
    }, 700);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFiltered(animals.filter((animal) => [animal.id, animal.species, animal.breed, animal.status].join(' ').toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  const recentActivities = useMemo(() => [
    { title: 'Treatment completed', detail: 'ANM012 marked safe for follow-up', time: '12 min ago' },
    { title: 'QR generated', detail: 'Animal ANM001 profile exported', time: '45 min ago' },
    { title: 'Reminder sent', detail: 'Vaccination due for ANM028', time: '1h ago' },
  ], []);

  const refreshDashboard = () => {
    setLoading(true);
    setMessage('Refreshing dashboard metrics...');
    window.setTimeout(() => {
      setLoading(false);
      setMessage('Dashboard refreshed successfully.');
    }, 700);
  };

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-secondary">Farmer Portal</p>
            <h1 className="mt-3 text-3xl font-display font-bold text-slate-900 sm:text-4xl">Farm intelligence and withdrawal monitoring</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Coordinate livestock movement, compliance, treatments, and traceability in one enterprise workspace.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleQuickAction('/dashboard/animals')} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-white shadow-lg shadow-primary/20"><FaPlus /> Add Animal</button>
            <button onClick={() => handleQuickAction('/dashboard/treatments')} className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-white"><FaPills /> Add Treatment</button>
            <button onClick={() => handleQuickAction('/dashboard/reports')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900"><FaFileAlt /> View Reports</button>
          </div>
        </div>
      </div>

      {message && <div className="mt-4 rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => navigate('/dashboard/notifications')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700"><FaBell /> Notifications</button>
        <button onClick={refreshDashboard} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700"><FaRefresh /> Refresh</button>
        <button onClick={() => navigate('/dashboard/verify')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700"><FaQrcode /> Verify QR</button>
      </div>

      {loading ? <div className="mt-6"><LoadingSpinner label="Loading dashboard metrics..." /></div> : <>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {initialStats.map((item) => (
            <div key={item.title} className="rounded-[28px] bg-white p-6 shadow-card">
              <p className="text-sm text-slate-500">{item.title}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
              <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-medium ${item.tone}`}>{item.title === 'Compliance %' ? 'Healthy' : 'Tracked'}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Compliance trend</h2>
                <p className="text-sm text-slate-500">Withdrawal and health performance across the latest cycle.</p>
              </div>
            </div>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                  <XAxis dataKey="name" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Line type="monotone" dataKey="value" stroke="#2E7D32" strokeWidth={4} dot={{ r: 4 }} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-slate-900">Species mix</h2>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                    {pieData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] bg-white p-6 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Animal inventory</h2>
                <p className="text-sm text-slate-500">Search and track the current livestock roster.</p>
              </div>
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none sm:w-72" placeholder="Search by ID or species" />
            </div>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-900">
                  <tr>
                    <th className="px-6 py-4">Animal ID</th>
                    <th className="px-6 py-4">Species</th>
                    <th className="px-6 py-4">Breed</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((animal) => (
                    <tr key={animal.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{animal.id}</td>
                      <td className="px-6 py-4">{animal.species}</td>
                      <td className="px-6 py-4">{animal.breed}</td>
                      <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${animal.status === 'Healthy' ? 'bg-primary/10 text-primary' : animal.status === 'Under Treatment' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>{animal.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-slate-900">Recent activities</h2>
            <div className="mt-6 space-y-4">
              {recentActivities.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                    </div>
                    <span className="text-sm text-slate-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] bg-gradient-to-br from-secondary/10 to-primary/10 p-5">
              <h3 className="font-semibold text-slate-900">Milk collection trend</h3>
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyMilkData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                    <XAxis dataKey="month" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip />
                    <Bar dataKey="liters" fill="#1565C0" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>
      </>}
    </main>
  );
}
