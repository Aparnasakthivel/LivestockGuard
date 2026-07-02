import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  }, [dark]);

  return (
    <button onClick={() => setDark((d) => !d)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
