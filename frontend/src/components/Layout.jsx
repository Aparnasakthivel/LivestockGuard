import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg dark:bg-gray-900 text-slate-900 dark:text-slate-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <Navbar />
          <main className="container py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
