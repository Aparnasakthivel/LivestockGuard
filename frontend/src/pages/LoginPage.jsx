import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@livestockguard.ai');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (remember) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      navigate(data.user.role === 'farmer' ? '/dashboard' : data.user.role === 'veterinarian' ? '/dashboard/vet' : data.user.role === 'government' ? '/dashboard/gov' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials.');
    }
  };

  return (
    <main className="container mx-auto px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-[32px] bg-white p-10 shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-secondary">Login</p>
        <h1 className="mt-4 text-4xl font-display font-bold text-slate-900">Access LivestockGuard AI</h1>
        <p className="mt-4 text-slate-600">Sign in to manage farms, animals, treatments, and compliance workflows with secure role-based access.</p>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
          {error && <div className="rounded-3xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="email@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="Enter your password" required />
          </div>
          <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
              Remember me
            </label>
            <button type="button" onClick={() => navigate('/')} className="text-primary hover:underline">Forgot password?</button>
          </div>
          <button type="submit" className="rounded-full bg-primary px-6 py-3 text-white">Sign in</button>
          <p className="text-center text-sm text-slate-500">New user? <button type="button" onClick={() => navigate('/register')} className="font-semibold text-primary hover:underline">Register a farm</button></p>
        </form>
      </div>
    </main>
  );
}
