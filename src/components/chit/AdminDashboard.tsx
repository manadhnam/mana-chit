import React, { useEffect, useState } from 'react';
import { branchSummary } from '@/services/chitFundApi';

interface AdminDashboardProps {
  adminId: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminId }) => {
  const [summary, setSummary] = useState<any>(null);
  const [riskUsers, setRiskUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(undefined);
    branchSummary(adminId).then(res => {
      if (!mounted) return;
      if (res.error) {
        setError(res.error);
      } else {
        setSummary(res.summary);
        setRiskUsers(res.riskUsers);
      }
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [adminId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!summary) return <div className="p-4">No summary data found.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-2">Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>Paid: <span className="font-semibold">{summary.paid}</span></div>
          <div>Missed: <span className="font-semibold">{summary.missed}</span></div>
          <div>Overdue: <span className="font-semibold">{summary.overdue}</span></div>
          <div>Fine Collected: <span className="font-semibold">₹{summary.fineCollected}</span></div>
          <div>Flagged Users: <span className="font-semibold">{summary.flaggedUsers}</span></div>
          <div>Flagged Agents: <span className="font-semibold">{summary.flaggedAgents}</span></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-2">Risk-Level Users & Overdue</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Group</th>
              <th>Risk</th>
              <th>Overdue</th>
            </tr>
          </thead>
          <tbody>
            {riskUsers.length === 0 ? (
              <tr><td colSpan={4}>No risk users found.</td></tr>
            ) : riskUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{user.name}</td>
                <td>{user.group}</td>
                <td>{user.risk}</td>
                <td>{user.overdue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 