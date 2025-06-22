
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Assign() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    asset_type: '',
    asset_name: '',
    quantity: '',
    assignedTo: '',
    assigned_on: new Date().toISOString().split('T')[0],
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
        'http://localhost:5000/api/assets/assign',
        {
          baseId: user.baseId, // ✅ from login
          type: form.asset_type,
          name: form.asset_name,
          quantity: Number(form.quantity),
          assignedTo: form.assignedTo,
          date: form.assigned_on,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Asset assigned successfully!');
      setForm({
        asset_type: '',
        asset_name: '',
        quantity: '',
        assignedTo: '',
        assigned_on: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error(err);
      setMessage('Failed to assign asset.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Assign Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="asset_type"
          value={form.asset_type}
          onChange={handleChange}
          placeholder="Asset Type (e.g. Weapon)"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="asset_name"
          value={form.asset_name}
          onChange={handleChange}
          placeholder="Asset Name (e.g. Rifle)"
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
          type="text"
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          placeholder="Personnel Name or ID"
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          name="assigned_on"
          value={form.assigned_on}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Assign
        </button>
      </form>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
