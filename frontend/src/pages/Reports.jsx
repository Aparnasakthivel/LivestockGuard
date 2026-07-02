import { useEffect, useState } from 'react';
import { FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { getReports } from '../api';
import { downloadCsv, downloadExcel, downloadPdf } from '../utils/exportUtils';

const reports = [
  { title: 'Animal Report', description: 'Detailed livestock records and compliance history.' },
  { title: 'Farm Report', description: 'Farm performance and traceability insights.' },
  { title: 'Treatment Report', description: 'Medicine usage and withdrawal status.' },
  { title: 'Compliance Report', description: 'Regulatory compliance and MRL violations.' },
  { title: 'Government Report', description: 'State-level analytics and policy metrics.' },
];

const exportOptions = [
  { label: 'Generate PDF', icon: FaFilePdf, style: 'bg-danger text-white' },
  { label: 'Export Excel', icon: FaFileExcel, style: 'bg-success text-white' },
  { label: 'Download CSV', icon: FaFileCsv, style: 'bg-secondary text-white' },
];

export default function Reports() {
  const [reportItems, setReportItems] = useState([]);
  const [message, setMessage] = useState('');

  const exportReport = (type) => {
    const headers = ['Report', 'Description', 'Status'];
    const rows = (reportItems.length ? reportItems : reports).map((item) => [item.title, item.description, item.report_id ? 'Stored' : 'Ready']);
    const filename = `report-${Date.now()}.${type.toLowerCase()}`;

    if (type === 'PDF') {
      downloadPdf(filename, 'LivestockGuard AI Compliance Report', rows, headers);
    } else if (type === 'Excel') {
      downloadExcel(filename, rows, headers);
    } else {
      downloadCsv(filename, rows, headers);
    }

    setMessage(`${type} export started.`);
  };

  useEffect(() => {
    getReports().then(({ data }) => setReportItems(data || [])).catch(() => setReportItems([]));
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Reports</p>
          <h1 className="mt-3 text-3xl font-display font-bold text-slate-900">Generate Compliance Reports</h1>
          <p className="mt-2 text-slate-600">Download the latest operational, treatment, and regulatory summaries for your team and auditors.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {exportOptions.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => exportReport(item.label)} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 ${item.style} transition hover:opacity-90`}>
                <Icon /> {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {message && <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportItems.map((report, index) => (
          <div key={`${report.title}-${index}`} className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{report.title}</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{report.description}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{report.report_id ? 'Stored' : 'Report'}</span>
            </div>
            <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>Up to date</span>
              <button onClick={() => exportReport('PDF')} className="rounded-full bg-secondary/10 px-3 py-2 text-secondary transition hover:bg-secondary/15">Create</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
