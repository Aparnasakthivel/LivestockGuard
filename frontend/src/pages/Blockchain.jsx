import { useEffect, useMemo, useState } from 'react';
import { FaCopy, FaFileExport, FaSearch, FaShieldAlt } from 'react-icons/fa';
import { listBlockchainLogs, logBlockchain } from '../api';

export default function Blockchain() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => [item.transaction_id, item.animal_id, item.details].join(' ').toLowerCase().includes(search.toLowerCase()));
  }, [logs, search]);

  const loadLogs = async () => {
    try {
      const { data } = await listBlockchainLogs();
      setLogs(data || []);
    } catch (error) {
      setMessage('Unable to load blockchain ledger.');
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const addRecord = async () => {
    try {
      await logBlockchain({ animal_id: 'animal-001', block_number: 5142, details: 'Treatment and withdrawal verification recorded' });
      setMessage('Blockchain entry created.');
      await loadLogs();
    } catch (error) {
      setMessage('Blockchain logging is currently unavailable.');
    }
  };

  const copyHash = async (hash) => {
    try {
      await navigator.clipboard.writeText(hash);
      setMessage('Hash copied to clipboard.');
    } catch (error) {
      setMessage('Copy failed.');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Blockchain</p>
          <h1 className="mt-3 text-3xl font-display font-bold text-slate-900">Tamper-proof compliance ledger</h1>
          <p className="mt-2 text-slate-600">Every treatment, verification, and compliance event produces an auditable blockchain record.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={addRecord} className="rounded-full bg-primary px-5 py-3 text-white">Create Record</button>
          <button onClick={() => setMessage('Chain export queued.')} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900"><FaFileExport className="mr-2 inline" />Export Chain</button>
        </div>
      </header>

      {message && <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="rounded-[28px] bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3" placeholder="Search transaction, animal, details" />
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {filteredLogs.map((item) => (
            <div key={item.transaction_id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary"><FaShieldAlt /> <span className="text-sm font-semibold">Verified</span></div>
                  <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.details}</h2>
                  <p className="mt-2 text-sm text-slate-600">Animal: {item.animal_id}</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p>Transaction ID: {item.transaction_id}</p>
                  <p>Block Number: {item.block_number}</p>
                  <p>Timestamp: {item.timestamp || 'Recorded now'}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => copyHash(item.transaction_id)} className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-2 text-secondary"><FaCopy /> Copy Hash</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
