
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MandalReports: React.FC = () => {
  // Sample data - replace with actual data from API
  const data = [
    { name: 'Jan', collections: 4000, disbursements: 2400 },
    { name: 'Feb', collections: 3000, disbursements: 1398 },
    { name: 'Mar', collections: 2000, disbursements: 9800 },
    { name: 'Apr', collections: 2780, disbursements: 3908 },
    { name: 'May', collections: 1890, disbursements: 4800 },
    { name: 'Jun', collections: 2390, disbursements: 3800 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mandal Reports</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export Report
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Total Collections</h3>
          <p className="text-3xl font-bold text-blue-600">₹16,060</p>
          <p className="text-sm text-gray-500">Last 6 months</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Total Disbursements</h3>
          <p className="text-3xl font-bold text-green-600">₹23,106</p>
          <p className="text-sm text-gray-500">Last 6 months</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Active Groups</h3>
          <p className="text-3xl font-bold text-purple-600">24</p>
          <p className="text-sm text-gray-500">Current month</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Collections vs Disbursements</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="collections" fill="#3B82F6" name="Collections" />
              <Bar dataKey="disbursements" fill="#10B981" name="Disbursements" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Collection from Group {item}</p>
                <p className="text-sm text-gray-500">₹5,000 - {new Date().toLocaleDateString()}</p>
              </div>
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">Completed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MandalReports; 