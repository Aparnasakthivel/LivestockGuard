import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const kpis = [
  { label: 'Total Farms', value: '1.2K' },
  { label: 'Total Livestock', value: '18.4K' },
  { label: 'Active Treatments', value: '620' },
  { label: 'Compliance %', value: '91%' },
];

const usageData = [
  { state: 'MH', value: 68 },
  { state: 'UP', value: 55 },
  { state: 'RJ', value: 50 },
  { state: 'TN', value: 35 },
  { state: 'KA', value: 42 },
];

const riskDistribution = [
  { name: 'Low', value: 40 },
  { name: 'Medium', value: 35 },
  { name: 'High', value: 25 },
];
const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

export default function GovernmentDashboard() {
  return (
    <main className="container mx-auto px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Government Monitoring</p>
          <h1 className="mt-3 text-4xl font-display font-bold text-slate-900">National Livestock Compliance Center</h1>
          <p className="mt-2 text-slate-600">State-wise AMU, risk zones, and MRL enforcement analytics for regulators and agencies.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <div key={item.label} className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">State-wise AMU Usage</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1565C0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Risk Zone Distribution</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
}
