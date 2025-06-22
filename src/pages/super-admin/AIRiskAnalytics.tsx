

const mockAnalytics = [
  { user: 'John Doe', score: 92, lastAnalysis: '2024-06-01' },
  { user: 'Jane Smith', score: 67, lastAnalysis: '2024-06-02' },
  { user: 'Alice Johnson', score: 45, lastAnalysis: '2024-06-03' },
  { user: 'Bob Brown', score: 80, lastAnalysis: '2024-06-04' },
  { user: 'Charlie Green', score: 30, lastAnalysis: '2024-06-05' },
];

const getRiskLevel = (score: number) => {
  if (score >= 80) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
};

const riskColors = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

const AIRiskAnalytics = () => {
  // Calculate risk distribution for chart
  const distribution = mockAnalytics.reduce(
    (acc, row) => {
      const level = getRiskLevel(row.score);
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 } as Record<string, number>
  );

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">AI Risk Analytics</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Risk Distribution</h2>
        <div className="flex gap-6 items-end h-32">
          {Object.entries(distribution).map(([level, count]) => (
            <div key={level} className="flex flex-col items-center">
              <div
                className={`w-12 ${riskColors[level as keyof typeof riskColors]} rounded-t`}
                style={{ height: `${count * 30}px` }}
                title={`${level}: ${count}`}
              ></div>
              <span className="mt-2 font-medium">{level}</span>
              <span className="text-xs text-gray-500">{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">User</th>
              <th className="px-4 py-2 border-b">Risk Score</th>
              <th className="px-4 py-2 border-b">Risk Level</th>
              <th className="px-4 py-2 border-b">Last Analysis</th>
            </tr>
          </thead>
          <tbody>
            {mockAnalytics.map((row, idx) => {
              const level = getRiskLevel(row.score);
              return (
                <tr key={idx} className="text-center">
                  <td className="px-4 py-2 border-b">{row.user}</td>
                  <td className="px-4 py-2 border-b font-semibold">{row.score}</td>
                  <td className={`px-4 py-2 border-b font-semibold ${level === 'High' ? 'text-red-600' : level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>{level}</td>
                  <td className="px-4 py-2 border-b">{row.lastAnalysis}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AIRiskAnalytics; 