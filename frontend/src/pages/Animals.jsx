import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaSearch, FaQrcode, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import QRCode from 'react-qr-code';
import { createAnimal, deleteAnimal, listAnimals, updateAnimal } from '../api';

const speciesOptions = ['All', 'Cow', 'Goat', 'Poultry'];

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('All');
  const [showAddAnimal, setShowAddAnimal] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [form, setForm] = useState({ species: 'Cow', breed: '', age: '4', weight: '500', gender: 'Female' });
  const [message, setMessage] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch = [animal.animal_id, animal.species, animal.breed, animal.gender]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesSpecies = species === 'All' || animal.species === species;
      return matchesSearch && matchesSpecies;
    });
  }, [animals, search, species]);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const { data } = await listAnimals();
      setAnimals(data || []);
    } catch (error) {
      setMessage('Unable to load animals right now.');
    } finally {
      setLoading(false);
    }
  };

  const openAddAnimal = () => {
    setSelectedAnimal(null);
    setForm({ species: 'Cow', breed: '', age: '4', weight: '500', gender: 'Female' });
    setShowAddAnimal(true);
  };
  const closeAddAnimal = () => setShowAddAnimal(false);
  const generateQr = () => setQrValue('https://livestockguard.example.com/qr/' + Date.now());

  const submitAnimal = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        farm_id: 'farm-001',
        species: form.species,
        breed: form.breed,
        age: Number(form.age),
        weight: form.weight,
        gender: form.gender,
        qr_code: `QR-${Date.now()}`,
        rfid_tag: `RFID-${Date.now()}`,
        image_url: '',
      };

      if (selectedAnimal) {
        await updateAnimal(selectedAnimal.animal_id, payload);
        setMessage('Animal updated successfully.');
      } else {
        await createAnimal(payload);
        setMessage('Animal added successfully.');
      }

      setShowAddAnimal(false);
      await loadAnimals();
    } catch (error) {
      setMessage('Unable to save animal record.');
    }
  };

  const removeAnimal = async (animalId) => {
    try {
      await deleteAnimal(animalId);
      setMessage('Animal deleted successfully.');
      await loadAnimals();
    } catch (error) {
      setMessage('Unable to delete animal record.');
    }
  };

  const editAnimal = (animal) => {
    setSelectedAnimal(animal);
    setForm({
      species: animal.species,
      breed: animal.breed,
      age: String(animal.age),
      weight: String(animal.weight),
      gender: animal.gender,
    });
    setShowAddAnimal(true);
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Animals</p>
          <h1 className="mt-3 text-3xl font-display font-bold text-slate-900">Livestock Records</h1>
          <p className="mt-2 text-slate-600">Manage your animals with quick search, filtering, and QR generation for traceability.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={openAddAnimal} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-white shadow-lg shadow-primary/20 transition hover:bg-green-700">
            <FaPlus /> Add Animal
          </button>
          <button onClick={generateQr} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900 transition hover:bg-slate-100">
            <FaQrcode /> Generate QR
          </button>
        </div>
      </header>

      {message && <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="grid gap-4 md:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Search animals, breeds, status"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Filter by species</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                {speciesOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          {qrValue && (
            <div className="mt-4 rounded-3xl border border-primary/20 bg-primary/5 p-4 text-slate-900">
              <p className="mb-2 text-sm font-semibold text-primary">QR Code generated</p>
              <div className="inline-flex items-center justify-center rounded-2xl bg-white p-4">
                <QRCode value={qrValue} size={128} />
              </div>
              <p className="mt-3 text-sm text-slate-600">{qrValue}</p>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-surface shadow-card dark:bg-slate-800">
        {loading ? <div className="p-6 text-sm text-slate-500">Loading animal records…</div> : (
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4">Animal ID</th>
                <th className="px-6 py-4">Species</th>
                <th className="px-6 py-4">Breed</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Weight</th>
                <th className="px-6 py-4">Health Status</th>
                <th className="px-6 py-4">QR Code</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnimals.map((animal) => (
                <tr key={animal.animal_id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{animal.animal_id}</td>
                  <td className="px-6 py-4">{animal.species}</td>
                  <td className="px-6 py-4">{animal.breed}</td>
                  <td className="px-6 py-4">{animal.age} yrs</td>
                  <td className="px-6 py-4">{animal.weight}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Recorded</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{animal.qr_code}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => editAnimal(animal)} className="rounded-full bg-secondary/10 px-3 py-2 text-secondary transition hover:bg-secondary/15"><FaEdit className="mr-1 inline" />Edit</button>
                    <button onClick={() => setQrValue(`https://livestockguard.example.com/qr/${animal.animal_id}`)} className="rounded-full bg-primary/10 px-3 py-2 text-primary transition hover:bg-primary/15"><FaEye className="mr-1 inline" />View</button>
                    <button onClick={() => removeAnimal(animal.animal_id)} className="rounded-full bg-danger/10 px-3 py-2 text-danger transition hover:bg-danger/15"><FaTrash className="mr-1 inline" />Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddAnimal && (
        <div className="rounded-[28px] bg-surface p-6 shadow-card dark:bg-slate-800">
          <h2 className="text-xl font-semibold text-slate-900">{selectedAnimal ? 'Edit Animal' : 'Add Animal'}</h2>
          <form onSubmit={submitAnimal} className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Species</label>
              <input value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Breed</label>
              <input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Age</label>
              <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Weight</label>
              <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Gender</label>
              <input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" required />
            </div>
            <div className="flex items-end gap-3">
              <button type="submit" className="rounded-full bg-primary px-5 py-3 text-white">Save</button>
              <button type="button" onClick={closeAddAnimal} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
