
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MandalPerformanceMetrics = () => {
  // Sample data - replace with actual data from your API
  const performanceData = [
    { month: 'Jan', collections: 4000, targets: 5000 },
    { month: 'Feb', collections: 3000, targets: 5000 },
    { month: 'Mar', collections: 5000, targets: 5000 },
    { month: 'Apr', collections: 4500, targets: 5000 },
    { month: 'May', collections: 6000, targets: 5000 },
    { month: 'Jun', collections: 5500, targets: 5000 },
  ];

  const metrics = [
    {
      title: 'Total Collections',
      value: '₹2,85,000',
      change: '+12.5%',
      trend: 'up',
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: '+5.2%',
      trend: 'up',
    },
    {
      title: 'Collection Efficiency',
      value: '92%',
      change: '+2.1%',
      trend: 'up',
    },
    {
      title: 'Pending Collections',
      value: '₹45,000',
      change: '-8.3%',
      trend: 'down',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Performance Metrics
      </h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p
                className={`text-xs ${
                  metric.trend === 'up'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Collections vs Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="collections"
                  name="Collections"
                  fill="#3B82F6"
                />
                <Bar
                  dataKey="targets"
                  name="Targets"
                  fill="#9CA3AF"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Branch A', 'Branch B', 'Branch C'].map((branch, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{branch}</span>
                  <span className="text-sm text-green-600">
                    {Math.floor(Math.random() * 20 + 80)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Areas Needing Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Branch X', 'Branch Y', 'Branch Z'].map((branch, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{branch}</span>
                  <span className="text-sm text-red-600">
                    {Math.floor(Math.random() * 20 + 60)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MandalPerformanceMetrics;
