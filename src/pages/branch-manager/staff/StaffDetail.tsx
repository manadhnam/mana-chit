import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const mockStaff = {
  id: 's1',
  name: 'Rajesh Kumar',
  role: 'Agent',
  status: 'Active',
  groups: [
    { id: '1', name: 'Gold' },
    { id: '2', name: 'Silver' },
  ],
  customers: [
    { id: 'c1', name: 'Alice' },
    { id: 'c2', name: 'Bob' },
  ],
  performance: '95%',
};

const StaffDetail = () => {
  const { staffId } = useParams();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    setTimeout(() => {
      setStaff(mockStaff);
      setLoading(false);
    }, 500);
  }, [staffId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!staff) return <div className="p-8 text-center text-gray-500">Staff not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{staff.name}</h1>
      <div className="mb-2">Role: <span className="font-semibold">{staff.role}</span></div>
      <div className="mb-2">Status: <span className="font-semibold">{staff.status}</span></div>
      <div className="mb-2">Performance: <span className="font-semibold">{staff.performance}</span></div>
      <h2 className="text-lg font-semibold mt-4 mb-2">Assigned Groups</h2>
      <ul className="mb-4 list-disc pl-6">
        {staff.groups.map((g: any) => (
          <li key={g.id}>
            <Link to={`/branch-manager/groups/${g.id}`} className="text-primary-600 hover:underline">{g.name}</Link>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-semibold mb-2">Assigned Customers</h2>
      <ul className="mb-4 list-disc pl-6">
        {staff.customers.map((c: any) => (
          <li key={c.id}>
            <Link to={`/branch-manager/customers/${c.id}`} className="text-primary-600 hover:underline">{c.name}</Link>
          </li>
        ))}
      </ul>
      {/* TODO: Add more staff details, collection stats, etc. */}
    </div>
  );
};

export default StaffDetail; 