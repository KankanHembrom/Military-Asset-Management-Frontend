
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/assets/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            baseId: user.baseId, // ✅ Send baseId so backend filters correctly
          },
        });
        setMetrics(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };

    fetchDashboard();
  }, [user.baseId]);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Asset Dashboard</h2>

      {Object.keys(metrics.closingBalance).length === 0 ? (
        <p>No asset data yet. Make a purchase to begin tracking.</p>
      ) : (
        <div className="space-y-4">
          {Object.keys(metrics.closingBalance).map((key) => (
            <div key={key} className="border p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{key}</h3>
              <p>Opening Balance: {metrics.openingBalance[key] || 0}</p>
              <p>Net Movement: {metrics.netMovement[key] || 0}</p>
              <p>Assigned Assets: {metrics.assigned[key] || 0}</p>
              <p>Expended Assets: {metrics.expended[key] || 0}</p>
              <p>Closing Balance: {metrics.closingBalance[key] || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}