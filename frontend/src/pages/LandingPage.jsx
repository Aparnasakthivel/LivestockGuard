import { motion } from 'framer-motion';
import { FaCheckCircle, FaLeaf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api';

const stats = [
  { label: 'Farms Monitored', value: '1.2K' },
  { label: 'Registered Animals', value: '18.4K' },
  { label: 'Active Veterinarians', value: '560' },
  { label: 'Compliance Rate', value: '93%' },
];

const features = ['AMU Tracking', 'MRL Monitoring', 'AI Prediction', 'Blockchain Verification', 'QR Traceability', 'Government Dashboard'];
const workflowSteps = [
  { title: 'Capture farm data', description: 'Register livestock, treatments, and compliance tasks in one governed workflow.' },
  { title: 'Validate drug safety', description: 'AI scores the treatment risk and recommended withdrawal window before release.' },
  { title: 'Share verified evidence', description: 'Export reports or scan QR codes to prove chain-of-custody to regulators and buyers.' },
];
const testimonials = [
  { name: 'Dr. Asha Menon', role: 'Veterinary Officer', quote: 'The workflow helped us reduce manual follow-ups and keep every compliance action traceable.' },
  { name: 'Ravi Kumar', role: 'Farm Owner', quote: 'I can monitor withdrawal periods and generate audit-ready reports without switching systems.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await loginUser({ email: 'demo@livestockguard.ai', password: 'demo1234' });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'farmer' ? '/dashboard' : '/dashboard');
    } catch (error) {
      navigate('/dashboard');
    }
  };

  const handleRegisterFarm = async () => {
    try {
      const { data } = await registerUser({
        name: 'Demo Farmer',
        email: `demo+${Date.now()}@livestockguard.ai`,
        password: 'demo1234',
        role: 'farmer',
      });
      if (data?.message) {
        localStorage.setItem('registrationMessage', data.message);
      }
    } catch (error) {
      localStorage.setItem('registrationMessage', 'Registration request submitted.');
    }
    navigate('/dashboard/animals');
  };

  const handleExploreDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <section className="grid gap-12 lg:grid-cols-[1.4fr_1fr] items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">LivestockGuard AI</p>
          <h1 className="mt-4 text-5xl font-display font-bold text-slate-900">Ensuring Safe Livestock Products Through Smart Antimicrobial Monitoring</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">AI-Powered livestock health, MRL compliance, and blockchain traceability built for farmers, veterinarians, regulators, and consumers.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={handleLogin} className="rounded-full bg-primary px-6 py-3 text-white shadow-lg shadow-primary/20 transition hover:bg-green-700">Login</button>
            <button onClick={handleRegisterFarm} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:bg-slate-50">Register Farm</button>
            <button onClick={handleExploreDashboard} className="rounded-full bg-secondary px-6 py-3 text-white transition hover:bg-blue-700">Explore Dashboard</button>
            <a href="#about" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:bg-slate-50">About</a>
            <a href="#features" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:bg-slate-50">Features</a>
            <a href="#contact" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:bg-slate-50">Contact</a>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] bg-white/80 p-8 shadow-2xl shadow-slate-300/30 backdrop-blur-xl">
          <div className="grid gap-5">
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard Preview</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">National Compliance Monitoring</h2>
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-inner shadow-slate-200"><FaLeaf className="text-primary text-2xl" /></div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg shadow-slate-900/20">
              <h3 className="text-xl font-semibold">Feature Highlights</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {features.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3">
                    <FaCheckCircle className="text-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="about" className="mt-16 rounded-[32px] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">About LivestockGuard AI</h2>
        <p className="mt-3 max-w-3xl text-slate-600">The platform helps farms, veterinarians, and regulators monitor antimicrobial use, keep withdrawals compliant, and verify product safety through QR-based traceability.</p>
      </section>

      <section id="features" className="mt-8 rounded-[32px] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Why teams use LivestockGuard AI</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {features.map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-700">{item}</div>
          ))}
        </div>
      </section>

      <section id="workflow" className="mt-8 rounded-[32px] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Operational workflow</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-primary">Step {index + 1}</div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="mt-8 rounded-[32px] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Trusted by field teams</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-slate-700">“{item.quote}”</p>
              <div className="mt-4 text-sm font-semibold text-slate-900">{item.name}</div>
              <div className="text-sm text-slate-500">{item.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-8 rounded-[32px] bg-slate-950 p-8 text-white shadow-sm">
        <h2 className="text-2xl font-semibold">Contact the team</h2>
        <p className="mt-3 text-slate-300">For farm onboarding, veterinary support, or compliance demos, reach out at support@livestockguard.ai.</p>
      </section>
    </main>
  );
}
