import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit';
import toast from 'react-hot-toast';

interface Collection {
  id: string;
  chit_group_id: string;
  chit_group_name: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  payment_date: string;
  status: 'paid' | 'pending' | 'overdue';
  payment_method: string;
  created_at: string;
}

const CollectionList = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCollections = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('payment_date', { ascending: false });

      if (collectionsError) throw collectionsError;

      // Fetch chit groups
      const { data: chitGroupsData, error: chitGroupsError } = await supabase
        .from('chit_groups')
        .select('id, name');

      if (chitGroupsError) throw chitGroupsError;

      // Create a map of chit group names
      const chitGroupMap = new Map<string, string>();
      chitGroupsData?.forEach(group => {
        chitGroupMap.set(group.id, group.name);
      });

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, name');

      if (customersError) throw customersError;

      // Create a map of customer names
      const customerMap = new Map<string, string>();
      customersData?.forEach(customer => {
        customerMap.set(customer.id, customer.name);
      });

      // Transform the data
      const transformedCollections: Collection[] = (collectionsData || []).map(collection => ({
        id: collection.id,
        chit_group_id: collection.chit_group_id,
        chit_group_name: chitGroupMap.get(collection.chit_group_id) || 'Unknown Group',
        customer_id: collection.customer_id,
        customer_name: customerMap.get(collection.customer_id) || 'Unknown Customer',
        amount: collection.amount,
        payment_date: collection.payment_date,
        status: collection.status,
        payment_method: collection.payment_method || 'Cash',
        created_at: collection.created_at,
      }));

      setCollections(transformedCollections);
      
      // Log audit
      await log_audit('super_admin.collections.list', {
        count: transformedCollections.length,
        action: 'Listed all collections'
      });

    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch collections');
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const filtered = collections.filter(c =>
    c.chit_group_name.toLowerCase().includes(search.toLowerCase()) ||
    c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.payment_method.toLowerCase().includes(search.toLowerCase())
  );

  const paidCollections = collections.filter(c => c.status === 'paid').length;
  const pendingCollections = collections.filter(c => c.status === 'pending').length;
  const overdueCollections = collections.filter(c => c.status === 'overdue').length;
  const totalAmount = collections.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collections (Super Admin)</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View all collections across all branches and groups
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Total Collections</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{collections.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Total Amount</div>
          <div className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Paid</div>
          <div className="text-2xl font-bold text-green-600">{paidCollections}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCollections}</div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <input
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Search by group, customer, or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading collections...</p>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchCollections}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {search ? 'No collections found matching your search.' : 'No collections found.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map(collection => (
                <tr key={collection.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{collection.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{collection.chit_group_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{collection.customer_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">₹{collection.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(collection.payment_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{collection.payment_method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      collection.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : collection.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      to={`/super-admin/collections/${collection.id}`} 
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CollectionList; 