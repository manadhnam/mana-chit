import { useState } from 'react';
import { motion } from 'framer-motion';
import {ArrowDownTrayIcon} from '@heroicons/react/24/outline';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';

const CollectionReports = () => {
  const [dateRange, setDateRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - replace with actual data from your API
  const collectionData = [
    {
      id: 1,
      customerName: 'John Doe',
      amount: 5000,
      date: '2024-03-15',
      status: 'Completed',
      paymentMethod: 'Cash',
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      amount: 7500,
      date: '2024-03-14',
      status: 'Pending',
      paymentMethod: 'UPI',
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      amount: 3000,
      date: '2024-03-13',
      status: 'Completed',
      paymentMethod: 'Bank Transfer',
    },
    // Add more sample data as needed
  ];

  const summaryMetrics = [
    {
      title: 'Total Collections',
      value: '₹1,55,000',
      change: '+8.5%',
    },
    {
      title: 'Pending Collections',
      value: '₹25,000',
      change: '-12.3%',
    },
    {
      title: 'Collection Efficiency',
      value: '86%',
      change: '+2.1%',
    },
    {
      title: 'Average Collection',
      value: '₹5,167',
      change: '+5.4%',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Collection Reports
        </h1>
        <Button variant="outline" className="gap-2">
          <ArrowDownTrayIcon className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryMetrics.map((metric, index) => (
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
                  metric.change.startsWith('+')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Select
                value={dateRange}
                onValueChange={setDateRange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="quarter">Last 90 days</SelectItem>
                  <SelectItem value="year">Last 365 days</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search collections..."
                className="pl-8 pr-4 py-2 border rounded-md w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collection Table */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectionData.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>{collection.customerName}</TableCell>
                  <TableCell>₹{collection.amount.toLocaleString()}</TableCell>
                  <TableCell>{collection.date}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        collection.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {collection.status}
                    </span>
                  </TableCell>
                  <TableCell>{collection.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionReports;
