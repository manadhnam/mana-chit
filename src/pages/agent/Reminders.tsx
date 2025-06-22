import React, { useState } from 'react';

const mockReminders = [
  { id: 1, message: 'Call customer Ravi Kumar', date: '2024-06-02', status: 'Pending' },
  { id: 2, message: 'Collect payment from Sita Devi', date: '2024-06-03', status: 'Completed' },
];

const Reminders = () => {
  const [reminders, setReminders] = useState(mockReminders);
  const [form, setForm] = useState({ message: '', date: '', status: 'Pending' });

  const handleAdd = () => {
    setReminders([
      ...reminders,
      { ...form, id: reminders.length + 1 },
    ]);
    setForm({ message: '', date: '', status: 'Pending' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Reminders</h1>
      <div className="mb-6 bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Add Reminder</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Reminder Message"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Date"
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />
        <select
          className="w-full mb-2 p-2 border rounded"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAdd}>Add Reminder</button>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reminders.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap">{r.message}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reminders; 