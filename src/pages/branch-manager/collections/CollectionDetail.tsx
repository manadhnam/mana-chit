import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const mockCollection = {
  id: 'col1',
  customer: 'Alice',
  group: 'Gold',
  amount: 5000,
  status: 'Paid',
  date: '2024-06-01',
};

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    setTimeout(() => {
      setCollection(mockCollection);
      setLoading(false);
    }, 500);
  }, [collectionId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!collection) return <div className="p-8 text-center text-gray-500">Collection not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Collection Detail</h1>
      <div className="mb-2">Customer: <Link to={`/branch-manager/customers/c1`} className="text-primary-600 hover:underline">{collection.customer}</Link></div>
      <div className="mb-2">Group: <Link to={`/branch-manager/groups/1`} className="text-primary-600 hover:underline">{collection.group}</Link></div>
      <div className="mb-2">Amount: <span className="font-semibold">₹{collection.amount}</span></div>
      <div className="mb-2">Status: <span className="font-semibold">{collection.status}</span></div>
      <div className="mb-2">Date: <span className="font-semibold">{collection.date}</span></div>
      {/* TODO: Add more collection/payment details, receipt download, etc. */}
    </div>
  );
};

export default CollectionDetail; 