import React, { useState } from 'react';

const mockAssignments = [
  { id: 1, customer: 'Ravi Kumar', chitGroup: 'Chit Group A', date: '2024-06-01' },
  { id: 2, customer: 'Sita Devi', chitGroup: 'Chit Group B', date: '2024-06-02' },
];

const ChitAssignment = () => {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [form, setForm] = useState({ customer: '', chitGroup: '' });

  const handleAssign = () => {
    setAssignments([
      ...assignments,
      { id: assignments.length + 1, customer: form.customer, chitGroup: form.chitGroup, date: new Date().toISOString().slice(0, 10) },
    ]);
    setForm({ customer: '', chitGroup: '' });
  };

  const handleRemove = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Chit Assignment</h1>
      <div className="mb-6 bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Assign Customer to Chit Group</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Customer Name"
          value={form.customer}
          onChange={e => setForm({ ...form, customer: e.target.value })}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Chit Group Name"
          value={form.chitGroup}
          onChange={e => setForm({ ...form, chitGroup: e.target.value })}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAssign}>Assign</button>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chit Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((a) => (
              <tr key={a.id}>
                <td className="px-6 py-4 whitespace-nowrap">{a.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.chitGroup}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleRemove(a.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChitAssignment; 