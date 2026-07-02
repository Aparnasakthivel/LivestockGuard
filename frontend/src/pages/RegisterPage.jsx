import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer', farm_name: '', location: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password, role: form.role });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Registration complete. Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register.');
    }
  };

  return (
    <main className="container mx-auto px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-10 shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-secondary">Farm Registration</p>
        <h1 className="mt-4 text-4xl font-display font-bold text-slate-900">Register your farm with compliance oversight</h1>
        <p className="mt-4 text-slate-600">Create an account and start tracking animals, treatments, QR verification, and government reporting.</p>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
          {error && <div className="rounded-3xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}
          {message && <div className="rounded-3xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{message}</div>}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Email" required />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Password" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none">
                <option value="farmer">Farmer</option>
                <option value="veterinarian">Veterinarian</option>
                <option value="government">Government Officer</option>
                <option value="administrator">Administrator</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Farm name</label>
              <input value={form.farm_name} onChange={(e) => setForm({ ...form, farm_name: e.target.value })} type="text" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Farm name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} type="text" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Location" required />
            </div>
          </div>
          <button type="submit" className="rounded-full bg-primary px-6 py-3 text-white">Create account</button>
        </form>
      </div>
    </main>
  );
}
