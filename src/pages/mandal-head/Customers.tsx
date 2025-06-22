import React, { useState } from 'react';

const mockCustomers = [
  { id: 1, name: 'Ravi Kumar', phone: '9876543210', status: 'Active' },
  { id: 2, name: 'Sita Devi', phone: '9123456780', status: 'Inactive' },
];

const MandalHeadCustomers = () => {
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState(mockCustomers);
  const [form, setForm] = useState({ name: '', phone: '', status: 'Active' });

  const handleAdd = () => {
    setCustomers([...customers, { ...form, id: customers.length + 1 }]);
    setShowModal(false);
    setForm({ name: '', phone: '', status: 'Active' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        Add Customer
      </button>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{c.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-4">Add Customer</h2>
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <select
              className="w-full mb-4 p-2 border rounded"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MandalHeadCustomers; 