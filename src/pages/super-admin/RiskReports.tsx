import React, { useState } from 'react';

const mockData = [
  { user: 'John Doe', riskLevel: 'High', reason: 'Multiple failed logins', date: '2024-06-01' },
  { user: 'Jane Smith', riskLevel: 'Medium', reason: 'Unusual location', date: '2024-06-02' },
  { user: 'Alice Johnson', riskLevel: 'Low', reason: 'Profile update', date: '2024-06-03' },
  { user: 'Bob Brown', riskLevel: 'High', reason: 'Suspicious transaction', date: '2024-06-04' },
];

const RiskReports = () => {
  const [filter, setFilter] = useState('All');

  const filteredData = filter === 'All' ? mockData : mockData.filter(row => row.riskLevel === filter);

  const exportCSV = () => {
    const header = 'User,Risk Level,Reason,Date';
    const rows = filteredData.map(row => `${row.user},${row.riskLevel},${row.reason},${row.date}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'risk-reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">Risk Reports</h1>
      <div className="flex items-center mb-4 gap-4">
        <label className="font-medium">Filter by Risk Level:</label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={exportCSV}
          className="ml-auto px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">User</th>
              <th className="px-4 py-2 border-b">Risk Level</th>
              <th className="px-4 py-2 border-b">Reason</th>
              <th className="px-4 py-2 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-4 py-2 border-b">{row.user}</td>
                <td className={`px-4 py-2 border-b font-semibold ${row.riskLevel === 'High' ? 'text-red-600' : row.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>{row.riskLevel}</td>
                <td className="px-4 py-2 border-b">{row.reason}</td>
                <td className="px-4 py-2 border-b">{row.date}</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr><td colSpan={4} className="py-4 text-gray-500">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskReports; 