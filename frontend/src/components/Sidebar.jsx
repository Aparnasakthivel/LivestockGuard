import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaPills, FaChartBar, FaFileAlt, FaCog, FaSyringe, FaVirus, FaBell, FaSignOutAlt, FaShieldAlt, FaQrcode, FaCube } from 'react-icons/fa';
import { GiCow } from 'react-icons/gi';

const menu = [
  { to: '/dashboard', label: 'Dashboard', icon: FaHome },
  { to: '/dashboard/animals', label: 'Animals', icon: GiCow },
  { to: '/dashboard/treatments', label: 'Treatments', icon: FaPills },
  { to: '/dashboard/vaccinations', label: 'Vaccinations', icon: FaSyringe },
  { to: '/dashboard/disease-reports', label: 'Disease Reports', icon: FaVirus },
  { to: '/dashboard/analytics', label: 'Analytics', icon: FaChartBar },
  { to: '/dashboard/reports', label: 'Reports', icon: FaFileAlt },
  { to: '/dashboard/blockchain', label: 'Blockchain', icon: FaCube },
  { to: '/dashboard/notifications', label: 'Notifications', icon: FaBell },
  { to: '/dashboard/gov', label: 'Government', icon: FaShieldAlt },
  { to: '/dashboard/verify', label: 'Consumer Verification', icon: FaQrcode },
  { to: '/dashboard/settings', label: 'Settings', icon: FaCog },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-gray-800 md:flex">
      <div className="mb-6 px-2">
        <div className="text-2xl font-display font-bold text-primary">LivestockGuard</div>
        <p className="text-sm text-slate-500">Government Grade AI Compliance</p>
      </div>
      <nav className="flex-1">
        {menu.map((m) => {
          const Icon = m.icon;
          return (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-primary/5 ${isActive ? 'bg-primary/10 font-semibold text-primary' : 'text-slate-700 dark:text-slate-200'}`
              }
            >
              <Icon className="text-primary" />
              <span>{m.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <button onClick={handleLogout} className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200">
        <FaSignOutAlt className="text-danger" />
        <span>Logout</span>
      </button>
      <div className="mt-auto px-2 text-sm text-slate-500">v1.2 • SIH 2026</div>
    </aside>
  );
}
