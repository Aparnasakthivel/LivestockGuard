import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const stats = [
  { label: 'Total Treatments', value: '132' },
  { label: 'Compliance %', value: '94%' },
  { label: 'Violations', value: '7' },
  { label: 'Risk Alerts', value: '24' },
];

const amuData = [
  { month: 'Jan', value: 43 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 58 },
  { month: 'May', value: 64 },
  { month: 'Jun', value: 72 },
];

const complianceData = [
  { name: 'Compliant', value: 76 },
  { name: 'Non-Compliant', value: 24 },
];

const speciesData = [
  { name: 'Cows', value: 42 },
  { name: 'Goats', value: 28 },
  { name: 'Poultry', value: 20 },
  { name: 'Buffalo', value: 10 },
];

const COLORS = ['#2E7D32', '#1565C0', '#FF9800', '#4CAF50'];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Analytics</p>
          <h1 className="mt-3 text-3xl font-display font-bold text-slate-900">Compliance & Risk Insights</h1>
          <p className="mt-2 text-slate-600">Monitor antimicrobial usage, compliance trends, and high-risk farms with visual dashboards.</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
            <p className="text-sm uppercase tracking-[0.3em] text-secondary">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Monthly AMU Usage</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Trend of antimicrobial usage across farms.</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Updated weekly</span>
          </div>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={amuData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2E7D32" strokeWidth={4} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid gap-4">
          <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">MRL Compliance</h2>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={complianceData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={4}>
                    {complianceData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Species Distribution</h2>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={speciesData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={4}>
                    {speciesData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
