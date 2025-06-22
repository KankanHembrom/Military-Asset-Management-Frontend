
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Purchase() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    asset_name: '',
    asset_type: '',
    quantity: '',
    purchased_on: new Date().toISOString().split('T')[0],
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
        'http://localhost:5000/api/assets/purchase',
        {
        baseId: user.baseId,
        type: form.asset_type,
        name: form.asset_name,
        quantity: form.quantity,
        date: form.purchased_on
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Purchase recorded successfully!');
      setForm({
        asset_name: '',
        asset_type: '',
        quantity: '',
        purchased_on: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error(err);
      setMessage('Failed to record purchase.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Record Asset Purchase</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="asset_name"
          value={form.asset_name}
          onChange={handleChange}
          placeholder="Asset Name"
          className="border p-2 w-full"
          required
        />
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
          name="purchased_on"
          value={form.purchased_on}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-green-600 text-white p-2 w-full rounded">
          Record Purchase
        </button>
      </form>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
