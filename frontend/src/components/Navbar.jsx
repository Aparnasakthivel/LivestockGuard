import React, { useMemo, useState } from 'react';
import { FaBell, FaQuestionCircle, FaSearch, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const searchSuggestions = [
  { label: 'Animals', path: '/dashboard/animals' },
  { label: 'Treatments', path: '/dashboard/treatments' },
  { label: 'Vaccinations', path: '/dashboard/vaccinations' },
  { label: 'Disease Reports', path: '/dashboard/disease-reports' },
  { label: 'Analytics', path: '/dashboard/analytics' },
  { label: 'Reports', path: '/dashboard/reports' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [search, setSearch] = useState('');

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return searchSuggestions.slice(0, 4);
    return searchSuggestions.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white dark:border-slate-700 dark:bg-gray-900">
      <div className="container flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="text-lg font-semibold">Enterprise Dashboard</div>
        </div>

        <div className="relative w-full max-w-md">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search animals, reports, treatments"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
          {filteredSuggestions.length > 0 && search && (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              {filteredSuggestions.map((item) => (
                <button key={item.label} onClick={() => { navigate(item.path); setSearch(''); }} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/notifications')} className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <FaBell />
            <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-danger px-1.5 text-xs text-white">3</span>
          </button>
          <button onClick={() => navigate('/documentation')} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" title="Documentation">
            <FaQuestionCircle />
          </button>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-2xl text-slate-600 dark:text-slate-200" />
            <div className="text-sm text-slate-700 dark:text-slate-200">{user.name || 'Admin'}</div>
          </div>
          <button onClick={handleLogout} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700">Logout</button>
        </div>
      </div>
    </header>
  );
}
