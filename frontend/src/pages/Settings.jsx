import { useEffect, useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') === 'on');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSave = (event) => {
    event.preventDefault();
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language);
    localStorage.setItem('notifications', notifications ? 'on' : 'off');
    setMessage('Preferences saved successfully.');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Settings</p>
          <h1 className="mt-3 text-3xl font-display font-bold text-slate-900">Account & Preferences</h1>
          <p className="mt-2 text-slate-600">Update your profile, password, notifications, and platform preferences.</p>
        </div>
        <button onClick={handleSave} className="rounded-full bg-primary px-5 py-3 text-white shadow-lg shadow-primary/20 transition hover:bg-green-700">Save Changes</button>
      </header>

      {message && <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Profile Settings</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <input className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" defaultValue="Admin User" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" defaultValue="admin@example.com" />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Preferences</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                <option>light</option>
                <option>dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notifications</label>
              <div className="mt-2 flex items-center gap-3">
                <button onClick={() => setNotifications((value) => !value)} className="rounded-full bg-secondary/10 px-4 py-2 text-secondary">{notifications ? 'Notifications On' : 'Notifications Off'}</button>
                <button onClick={() => setMessage('Password update flow ready.')} className="rounded-full bg-primary/10 px-4 py-2 text-primary">Update Password</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
