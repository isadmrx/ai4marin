import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';

export default function OwnerDashboard() {
  const { t } = useTranslation();
  const [ships, setShips] = useState([]);
  const [form, setForm] = useState({
    name: '',
    imo_number: '',
    type: '',
    flag: '',
    year_built: ''
  });

  const token = localStorage.getItem('token');

  const fetchShips = async () => {
    try {
      const res = await api.get('/ships', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShips(res.data.ships);
    } catch (err) {
      setShips([]);
    }
  };

  useEffect(() => {
    fetchShips();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ships', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ name: '', imo_number: '', type: '', flag: '', year_built: '' });
      fetchShips();
    } catch (err) {
      alert('Failed to add ship');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{t('myFleet')}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-2 mb-4">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2" />
        <input name="imo_number" placeholder="IMO" value={form.imo_number} onChange={handleChange} className="border p-2" />
        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} className="border p-2" />
        <input name="flag" placeholder="Flag" value={form.flag} onChange={handleChange} className="border p-2" />
        <input name="year_built" placeholder="Year" value={form.year_built} onChange={handleChange} className="border p-2" />
        <button type="submit" className="col-span-5 bg-blue-500 text-white p-2">Add Ship</button>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {ships.map((s) => (
          <div key={s.id} className="border p-2">
            <h2 className="font-bold">{s.name}</h2>
            <p>IMO: {s.imo_number}</p>
            <p>{s.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
