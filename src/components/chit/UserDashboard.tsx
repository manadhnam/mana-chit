import React, { useEffect, useState } from 'react';
import { getUserGroup, getUserPassbook, getUserLoanStatus, requestLoan } from '@/services/chitFundApi';

interface UserDashboardProps {
  userId: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ userId }) => {
  const [group, setGroup] = useState<any>(null);
  const [passbook, setPassbook] = useState<any[]>([]);
  const [loanStatus, setLoanStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loanLoading, setLoanLoading] = useState(false);
  const [loanError, setLoanError] = useState<string | null>(null);
  const [loanSuccess, setLoanSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    Promise.all([
      getUserGroup(userId),
      getUserPassbook(userId),
      getUserLoanStatus(userId),
    ]).then(([groupRes, passbookRes, loanRes]) => {
      if (!mounted) return;
      if (groupRes.error || passbookRes.error || loanRes.error) {
        setError(groupRes.error || passbookRes.error || loanRes.error);
      } else {
        setGroup(groupRes.group);
        setPassbook(passbookRes.passbook);
        setLoanStatus(loanRes.loanStatus);
      }
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [userId]);

  const handleRequestLoan = async () => {
    setLoanLoading(true);
    setLoanError(null);
    setLoanSuccess(false);
    if (!group) return;
    const res = await requestLoan(userId, group.id);
    setLoanLoading(false);
    if (res.success) {
      setLoanSuccess(true);
    } else {
      setLoanError(res.error || 'Failed to request loan');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-2">Group Info</h2>
        {group ? (
          <>
            <div>Group: {group.name}</div>
            <div>Amount: ₹{group.amount}</div>
            <div>Members: {group.members?.length || 0}</div>
            <div>Status: {group.active ? 'Active' : 'Inactive'}</div>
          </>
        ) : (
          <div>No group info found.</div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-2">Passbook</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Fine</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {passbook.length === 0 ? (
              <tr><td colSpan={4}>No payments found.</td></tr>
            ) : passbook.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.date}</td>
                <td>₹{entry.amount}</td>
                <td>{entry.fine > 0 ? `₹${entry.fine}` : '-'}</td>
                <td>
                  <a href={entry.receiptUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-2">Loan Status</h2>
        {loanStatus ? (
          <>
            <div>Eligible: {loanStatus.eligible ? 'Yes' : 'No'}</div>
            <div>Last Loan: {loanStatus.lastLoan || '-'}</div>
            <div>Next Eligible: {loanStatus.nextEligible || '-'}</div>
            <button
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleRequestLoan}
              disabled={!loanStatus.eligible || loanLoading}
            >
              {loanLoading ? 'Requesting...' : 'Request Loan'}
            </button>
            {loanError && <div className="text-red-600 mt-2">{loanError}</div>}
            {loanSuccess && <div className="text-green-600 mt-2">Loan request submitted!</div>}
          </>
        ) : (
          <div>No loan status found.</div>
        )}
      </div>
    </div>
  );
}; 