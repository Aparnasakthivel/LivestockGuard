import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-10 text-center shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-secondary">404</p>
        <h1 className="mt-4 text-4xl font-display font-bold text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-600">The route you requested is not available. Return to the dashboard to continue monitoring livestock compliance.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-8 rounded-full bg-primary px-6 py-3 text-white">Return to Dashboard</button>
      </div>
    </main>
  );
}
