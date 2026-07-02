export default function Documentation() {
  return (
    <main className="container mx-auto px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-10 shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-secondary">Documentation</p>
        <h1 className="mt-4 text-4xl font-display font-bold text-slate-900">Platform Guide & API Reference</h1>
        <p className="mt-4 text-slate-600">Use this documentation hub to understand navigation, reporting, verification, and the government compliance workflow.</p>

        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Core modules</h2>
            <p className="mt-3 text-slate-600">Animals, treatments, vaccinations, disease reports, analytics, blockchain history, and verification are the main operational modules.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Reports</h2>
            <p className="mt-3 text-slate-600">Export audit-ready PDFs, Excel workbooks, and CSV summaries for farm compliance and government inspections.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Verification</h2>
            <p className="mt-3 text-slate-600">QR-based product verification validates animal origin, treatment safety, MRL compliance, and blockchain records.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
