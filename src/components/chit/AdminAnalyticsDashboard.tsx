import React, { useEffect, useState } from 'react';
import { getAdminAnalytics } from '@/services/chitFundApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { saveAs } from 'file-saver';

interface AdminAnalyticsDashboardProps {
  branchId?: string;
}

export const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({ branchId }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchData = () => {
    setLoading(true);
    setError(undefined);
    getAdminAnalytics({ branchId, from: from || undefined, to: to || undefined }).then(res => {
      if (res.error) setError(res.error);
      else setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [branchId]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleExportCSV = () => {
    if (data && data.csv) {
      const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'payments_report.csv');
    }
  };

  const chartData = data && data.collectionsByMonth
    ? Object.entries(data.collectionsByMonth).map(([month, amount]) => ({ month, amount }))
    : [];

  // Pie chart data for user roles
  const rolePieData = data && data.stats && data.stats.totalUsers
    ? [
        { name: 'Agents', value: data.stats.totalAgents || 0 },
        { name: 'High Risk Users', value: data.stats.riskyUsers || 0 },
        { name: 'Other Users', value: (data.stats.totalUsers || 0) - (data.stats.totalAgents || 0) - (data.stats.riskyUsers || 0) },
      ]
    : [];
  const rolePieColors = ['#2563eb', '#dc2626', '#10b981'];

  // Pie chart data for risk levels
  const riskPieData = data && data.stats ? [
    { name: 'High', value: data.stats.riskyUsers || 0 },
    { name: 'Normal', value: (data.stats.totalUsers || 0) - (data.stats.riskyUsers || 0) },
  ] : [];
  const riskPieColors = ['#dc2626', '#10b981'];

  // Line chart data for collections over time
  const lineChartData = chartData;

  if (loading) return <div className="p-4">Loading analytics...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!data || !data.stats) return <div className="p-4">No analytics data found.</div>;

  return (
    <div className="space-y-6">
      <form className="flex flex-wrap gap-4 items-end mb-4" onSubmit={handleFilter}>
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input type="date" className="border rounded px-2 py-1" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input type="date" className="border rounded px-2 py-1" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">₹{data.stats.totalPaid || 0}</div>
          <div className="text-gray-600">Total Paid</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">₹{data.stats.totalFines || 0}</div>
          <div className="text-gray-600">Total Fines</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.stats.missed || 0}</div>
          <div className="text-gray-600">Missed Payments</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.stats.overdue || 0}</div>
          <div className="text-gray-600">Overdue</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.stats.totalLoans || 0}</div>
          <div className="text-gray-600">Total Loans</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.stats.totalUsers || 0}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.stats.totalAgents || 0}</div>
          <div className="text-gray-600">Total Agents</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.stats.riskyUsers || 0}</div>
          <div className="text-gray-600">High Risk Users</div>
        </div>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-4">Collections Per Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Top Overdue Users</h3>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            onClick={handleExportCSV}
            type="button"
          >
            Export CSV
          </button>
        </div>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">User</th>
              <th className="text-right">Total Fine</th>
            </tr>
          </thead>
          <tbody>
            {!data.topOverdueUsers || data.topOverdueUsers.length === 0 ? (
              <tr><td colSpan={2}>No overdue users found.</td></tr>
            ) : data.topOverdueUsers.map((u: any, idx: number) => (
              <tr key={idx}>
                <td>{u.name}</td>
                <td className="text-right">₹{u.fine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-2">Top Agents</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Agent</th>
              <th className="text-right">Total Collections</th>
            </tr>
          </thead>
          <tbody>
            {!data.topAgents || data.topAgents.length === 0 ? (
              <tr><td colSpan={2}>No agent data found.</td></tr>
            ) : data.topAgents.map((a: any, idx: number) => (
              <tr key={idx}>
                <td>{a.name}</td>
                <td className="text-right">₹{a.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-2">Group Breakdown</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Group</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Total Paid</th>
              <th className="text-right">Total Fines</th>
              <th className="text-right">Users</th>
            </tr>
          </thead>
          <tbody>
            {!data.groupBreakdown || data.groupBreakdown.length === 0 ? (
              <tr><td colSpan={5}>No group data found.</td></tr>
            ) : data.groupBreakdown.map((g: any, idx: number) => (
              <tr key={idx}>
                <td>{g.groupName}</td>
                <td className="text-right">₹{g.amount}</td>
                <td className="text-right">₹{g.totalPaid}</td>
                <td className="text-right">₹{g.totalFines}</td>
                <td className="text-right">{g.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-2">Branch Breakdown</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Branch</th>
              <th className="text-right">Total Paid</th>
              <th className="text-right">Total Fines</th>
              <th className="text-right">Users</th>
            </tr>
          </thead>
          <tbody>
            {!data.branchBreakdown || data.branchBreakdown.length === 0 ? (
              <tr><td colSpan={4}>No branch data found.</td></tr>
            ) : data.branchBreakdown.map((b: any, idx: number) => (
              <tr key={idx}>
                <td>{b.branchName}</td>
                <td className="text-right">₹{b.totalPaid}</td>
                <td className="text-right">₹{b.totalFines}</td>
                <td className="text-right">{b.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-2">Mandal Breakdown</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Mandal</th>
              <th className="text-right">Total Paid</th>
              <th className="text-right">Total Fines</th>
              <th className="text-right">Users</th>
            </tr>
          </thead>
          <tbody>
            {!data.mandalBreakdown || data.mandalBreakdown.length === 0 ? (
              <tr><td colSpan={4}>No mandal data found.</td></tr>
            ) : data.mandalBreakdown.map((m: any, idx: number) => (
              <tr key={idx}>
                <td>{m.mandalName}</td>
                <td className="text-right">₹{m.totalPaid}</td>
                <td className="text-right">₹{m.totalFines}</td>
                <td className="text-right">{m.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4">User Roles</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={rolePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {rolePieData.map((entry, idx) => (
                  <Cell key={`cell-role-${idx}`} fill={rolePieColors[idx % rolePieColors.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4">Risk Levels</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {riskPieData.map((entry, idx) => (
                  <Cell key={`cell-risk-${idx}`} fill={riskPieColors[idx % riskPieColors.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4">Collections Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-4">Payment Mode Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.paymentModeBreakdown || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mode" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#2563eb" name="Total Amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-4">Group Collections by Payment Mode</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.groupStacked || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="groupName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cash" stackId="a" fill="#2563eb" name="Cash" />
            <Bar dataKey="online" stackId="a" fill="#10b981" name="Online" />
            <Bar dataKey="phonepe_qr" stackId="a" fill="#f59e42" name="PhonePe QR" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-4">Branch Collections by Payment Mode</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.branchStacked || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branchName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cash" stackId="a" fill="#2563eb" name="Cash" />
            <Bar dataKey="online" stackId="a" fill="#10b981" name="Online" />
            <Bar dataKey="phonepe_qr" stackId="a" fill="#f59e42" name="PhonePe QR" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-4">Mandal Collections by Payment Mode</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.mandalStacked || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mandalName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cash" stackId="a" fill="#2563eb" name="Cash" />
            <Bar dataKey="online" stackId="a" fill="#10b981" name="Online" />
            <Bar dataKey="phonepe_qr" stackId="a" fill="#f59e42" name="PhonePe QR" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 