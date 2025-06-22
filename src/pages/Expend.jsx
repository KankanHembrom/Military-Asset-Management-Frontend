
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Expend() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    asset_type: '',
    asset_name: '',
    quantity: '',
    expended_on: new Date().toISOString().split('T')[0],
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/assets/expend',
        {
          baseId: user.baseId,
          type: form.asset_type,
          name: form.asset_name,
          quantity: form.quantity,
          date: form.expended_on,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('✅ Asset expended successfully!');
      setForm({
        asset_type: '',
        asset_name: '',
        quantity: '',
        expended_on: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error(err);
      setMessage(' Failed to expend asset.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Expend Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="asset_type"
          value={form.asset_type}
          onChange={handleChange}
          placeholder="Asset Type (e.g. Weapon, Vehicle)"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="asset_name"
          value={form.asset_name}
          onChange={handleChange}
          placeholder="Asset Name (e.g. Rifle, Truck)"
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          name="expended_on"
          value={form.expended_on}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-red-600 text-white p-2 w-full rounded">
          Expend Asset
        </button>
      </form>
      {message && <p className="mt-4 text-center font-semibold">{message}</p>}
    </div>
  );
}
