
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Transfer() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    asset_id: '',
    quantity: '',
    to_base_id: '',
    transfer_date: new Date().toISOString().split('T')[0],
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
        'http://localhost:5000/api/assets/transfer',
        {
          ...form,
          from_base_id: user.base_id, // current user's base
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Asset transferred successfully!');
      setForm({
        asset_id: '',
        quantity: '',
        to_base_id: '',
        transfer_date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error(err);
      setMessage('Failed to transfer asset.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Transfer Asset Between Bases</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="asset_id"
          value={form.asset_id}
          onChange={handleChange}
          placeholder="Asset ID"
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
          name="to_base_id"
          value={form.to_base_id}
          onChange={handleChange}
          placeholder="Destination Base ID"
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          name="transfer_date"
          value={form.transfer_date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-yellow-600 text-white p-2 w-full rounded">
          Transfer Asset
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
