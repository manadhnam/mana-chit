

const mockAnalytics = [
  { role: 'Agent', metric: 'Collections', value: 120 },
  { role: 'Branch Manager', metric: 'Approvals', value: 15 },
  { role: 'Customer', metric: 'Active Chits', value: 40 },
];

const PerformanceAnalytics = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Performance Analytics</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockAnalytics.map((a, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">{a.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.metric}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-gray-400">(Charts and real data integration coming soon)</div>
    </div>
  );
};

export default PerformanceAnalytics; 