import { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaTrash, FaBell, FaFileExport } from 'react-icons/fa';
import { deleteNotification, listNotifications, markNotificationRead } from '../api';
import { downloadCsv } from '../utils/exportUtils';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const filtered = useMemo(() => {
    return items.filter((item) => [item.title, item.message, item.status].join(' ').toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await listNotifications();
      setItems(data || []);
    } catch (error) {
      setMessage('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      setMessage('Notification marked as read.');
      await loadNotifications();
    } catch (error) {
      setMessage('Unable to update notification.');
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteNotification(id);
      setMessage('Notification removed from inbox.');
      await loadNotifications();
    } catch (error) {
      setMessage('Unable to remove notification.');
    }
  };

  const exportNotifications = () => {
    const headers = ['Title', 'Message', 'Status'];
    const rows = filtered.map((item) => [item.title, item.message, item.status]);
    downloadCsv(`notifications-${Date.now()}.csv`, rows, headers);
    setMessage('Notification export generated.');
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Notifications</p>
          <h1 className="mt-3 text-3xl font-display font-bold text-slate-900">Operational Alerts</h1>
          <p className="mt-2 text-slate-600">Review compliance alerts, vaccination reminders, and treatment watches in one place.</p>
        </div>
      </header>

      {message && <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="rounded-[28px] bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Search notifications" />
          <button onClick={exportNotifications} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-900"><FaFileExport /> Export</button>
        </div>
        <div className="mt-6 space-y-4">
          {loading ? <div className="text-sm text-slate-500">Loading notifications…</div> : filtered.map((item) => (
            <div key={item.notification_id} className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary"><FaBell /></div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => markRead(item.notification_id)} className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-2 text-secondary"><FaCheck /> Mark Read</button>
                <button onClick={() => removeItem(item.notification_id)} className="inline-flex items-center gap-2 rounded-full bg-danger/10 px-3 py-2 text-danger"><FaTrash /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
