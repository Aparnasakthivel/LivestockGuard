import { useMemo, useState } from 'react';
import { createVerification, getVerification } from '../api';
import { FaDownload, FaPrint, FaQrcode } from 'react-icons/fa';

export default function ConsumerVerification() {
  const [productName, setProductName] = useState('SafeMilk Dairy Batch 001');
  const [verification, setVerification] = useState(null);
  const [message, setMessage] = useState('');

  const verifyProduct = async () => {
    try {
      await createVerification({ animal_id: 'animal-001', product_name: productName, verified: true });
      const { data } = await getVerification('animal-001');
      setVerification(data);
      setMessage('Product verified successfully.');
    } catch (error) {
      setVerification({ verified: true, animal_id: 'animal-001', product_name: productName });
      setMessage('Verification could not be completed, but the demo record is available.');
    }
  };

  useMemo(() => {
    verifyProduct();
  }, []);

  const handlePrint = () => window.print();
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify({ productName, verification }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="rounded-[32px] bg-white p-10 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-secondary">Consumer Verification</p>
        <h1 className="mt-3 text-4xl font-display font-bold text-slate-900">Product Safety & Traceability</h1>
        <p className="mt-4 text-slate-600">Scan a QR code to verify farm origin, animal treatment records, MRL compliance, and government certification.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.6fr_0.4fr]">
          <div className="rounded-[32px] bg-slate-50 p-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm text-slate-500">QR Scanner</p>
              <div className="mt-8 flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-secondary bg-slate-100 text-slate-500">
                <FaQrcode className="text-5xl text-primary" />
                <p className="mt-4 text-center text-sm">Scan or inspect the product QR to verify farm, treatment, and MRL data.</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={verifyProduct} className="rounded-full bg-primary px-4 py-2 text-white">Verify Product</button>
                <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-900"><FaDownload /> Download Report</button>
                <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-900"><FaPrint /> Print</button>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            {message && <div className="mb-4 rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}
            <div className="rounded-3xl bg-primary/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-secondary">Verified Status</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">VERIFIED SAFE FOR CONSUMPTION</h2>
            </div>
            <div className="mt-8 space-y-4">
              {[
                { label: 'Product Name', value: productName },
                { label: 'Farm Name', value: 'Green Valley Farm' },
                { label: 'Animal ID', value: verification?.animal_id || 'animal-001' },
                { label: 'Treatment History', value: 'Oxytetracycline, Withdrawal complete' },
                { label: 'MRL Status', value: 'Within safe limits' },
                { label: 'Compliance Status', value: verification?.verified ? 'Verified' : 'Pending' },
                { label: 'Veterinarian Approval', value: 'Dr. Anjali Sharma' },
                { label: 'Blockchain Reference', value: verification?.verification_id || 'BC-1001' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-1 font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
