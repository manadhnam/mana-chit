import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const mockCollections = [
  { id: 'col1', customer: 'Alice', group: 'Gold', amount: 5000, status: 'Paid', date: '2024-06-01' },
  { id: 'col2', customer: 'Bob', group: 'Silver', amount: 5000, status: 'Overdue', date: '2024-06-10' },
];

const CollectionList = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: Replace with API call
    setTimeout(() => {
      setCollections(mockCollections);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = collections.filter(c => c.customer.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500 text-sm">Total Collections</div>
          <div className="text-2xl font-bold">{collections.length}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500 text-sm">Paid</div>
          <div className="text-2xl font-bold">{collections.filter(c => c.status === 'Paid').length}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500 text-sm">Overdue</div>
          <div className="text-2xl font-bold">{collections.filter(c => c.status === 'Overdue').length}</div>
        </div>
      </div>
      {/* Search */}
      <div className="mb-4 flex justify-between items-center">
        <input
          className="border rounded px-3 py-2 w-64"
          placeholder="Search by customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Table */}
      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No collections found.</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Group</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="px-4 py-2">{c.customer}</td>
                <td className="px-4 py-2">{c.group}</td>
                <td className="px-4 py-2">₹{c.amount}</td>
                <td className="px-4 py-2">{c.status}</td>
                <td className="px-4 py-2">{c.date}</td>
                <td className="px-4 py-2">
                  <Link to={`/branch-manager/collections/${c.id}`} className="text-primary-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* TODO: Add pagination */}
    </div>
  );
};

export default CollectionList; 