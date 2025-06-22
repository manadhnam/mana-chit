

const mockLogs = [
  { id: 1, user: 'Customer', action: 'Joined Chit Group', date: '2024-06-01', details: 'Chit Group A' },
  { id: 2, user: 'Customer', action: 'Uploaded KYC', date: '2024-06-02', details: 'KYC_RaviKumar.pdf' },
];

const AuditLogs = () => {
  const handleExport = () => {
    alert('Exporting logs (CSV/PDF coming soon)');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleExport}>Export Logs</button>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap">{log.user}</td>
                <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap">{log.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs; 