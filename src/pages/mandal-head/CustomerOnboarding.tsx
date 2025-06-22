import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Customer } from '@/types/database';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface Location {
  id: string;
  name: string;
  type: 'state' | 'district' | 'mandal' | 'village';
  parent_id: string | null;
}

interface CustomerOnboarding {
  id: string;
  customer_id: string;
  status: 'pending' | 'approved' | 'rejected';
  kyc_status: 'pending' | 'verified' | 'rejected';
  documents: {
    id_proof: string;
    address_proof: string;
    photo: string;
    aadhaar: File | null;
    pan: File | null;
    signature: File | null;
  };
  created_at: string;
  updated_at: string;
}

const CustomerOnboarding = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [onboarding, setOnboarding] = useState<CustomerOnboarding[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedMandal, setSelectedMandal] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    village_id: '',
    documents: {
      id_proof: '',
      address_proof: '',
      photo: '',
      aadhaar: null as File | null,
      pan: null as File | null,
      signature: null as File | null,
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
    fetchCustomers();
    fetchOnboarding();
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      const mockLocations: Location[] = [
        {
          id: '1',
          name: 'Telangana',
          type: 'state',
          parent_id: null,
        },
        {
          id: '2',
          name: 'Hyderabad',
          type: 'district',
          parent_id: '1',
        },
        {
          id: '3',
          name: 'Rangareddy',
          type: 'mandal',
          parent_id: '2',
        },
        {
          id: '4',
          name: 'Gandipet',
          type: 'village',
          parent_id: '3',
        },
      ];
      setLocations(mockLocations);
    } catch (error) {
      toast.error('Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          mobile: '+91 9876543210',
          code: 'CUST001',
          status: 'active',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];
      setCustomers(mockCustomers);
    } catch (error) {
      toast.error('Failed to load customers');
    }
  };

  const fetchOnboarding = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockOnboarding: CustomerOnboarding[] = [
        {
          id: '1',
          customer_id: '1',
          status: 'pending',
          kyc_status: 'pending',
          documents: {
            id_proof: 'aadhar.pdf',
            address_proof: 'electricity_bill.pdf',
            photo: 'photo.jpg',
            aadhaar: null,
            pan: null,
            signature: null,
          },
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];
      setOnboarding(mockOnboarding);
    } catch (error) {
      toast.error('Failed to load onboarding data');
    }
  };

  const handleAddCustomer = () => {
    setShowAddModal(true);
  };

  const handleApproveCustomer = async (id: string) => {
    try {
      // TODO: Implement customer approval
      setOnboarding(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
      await supabase.from('audit_logs').insert({ action: 'approve_customer', details: { id } });
      toast.success('Customer approved successfully');
      fetchOnboarding();
    } catch (error) {
      toast.error('Failed to approve customer');
    }
  };

  const handleRejectCustomer = async (id: string) => {
    try {
      // TODO: Implement customer rejection
      setOnboarding(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
      await supabase.from('audit_logs').insert({ action: 'reject_customer', details: { id } });
      toast.success('Customer rejected');
      fetchOnboarding();
    } catch (error) {
      toast.error('Failed to reject customer');
    }
  };

  const handleVerifyKYC = async (id: string) => {
    try {
      // TODO: Implement KYC verification
      setOnboarding(prev => prev.map(c => c.id === id ? { ...c, kyc_status: 'verified' } : c));
      await supabase.from('audit_logs').insert({ action: 'verify_kyc', details: { id } });
      toast.success('KYC verified successfully');
      fetchOnboarding();
    } catch (error) {
      toast.error('Failed to verify KYC');
    }
  };

  const handleSubmitCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement customer creation
      // Upload files to Supabase storage or mock
      const fileInfo = {
        aadhaar: newCustomer.documents.aadhaar?.name,
        pan: newCustomer.documents.pan?.name,
        photo: newCustomer.documents.photo,
        signature: newCustomer.documents.signature?.name,
      };
      await supabase.from('audit_logs').insert({ action: 'add_customer', details: { ...newCustomer, fileInfo } });
      toast.success('Customer created successfully');
      setShowAddModal(false);
      fetchCustomers();
      fetchOnboarding();
    } catch (error) {
      toast.error('Failed to create customer');
    }
  };

  const getFilteredLocations = (type: Location['type'], parentId: string | null) => {
    return locations.filter((loc) => loc.type === type && loc.parent_id === parentId);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Onboarding
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage customer registrations and KYC verification
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddCustomer}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Customer
          </button>
        </div>
      </div>

      {/* Onboarding Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Customers
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {customers.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending Approvals
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {onboarding.filter((o) => o.status === 'pending').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending KYC
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {onboarding.filter((o) => o.kyc_status === 'pending').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Documents Uploaded
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {onboarding.reduce(
                        (sum, o) =>
                          sum +
                          (o.documents.id_proof ? 1 : 0) +
                          (o.documents.address_proof ? 1 : 0) +
                          (o.documents.photo ? 1 : 0),
                        0
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Onboarding List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {onboarding.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Customer {item.customer_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.kyc_status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : item.kyc_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.kyc_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-2">
                      {item.documents.id_proof && (
                        <span className="text-blue-600 hover:text-blue-900 cursor-pointer">
                          ID Proof
                        </span>
                      )}
                      {item.documents.address_proof && (
                        <span className="text-blue-600 hover:text-blue-900 cursor-pointer">
                          Address
                        </span>
                      )}
                      {item.documents.photo && (
                        <span className="text-blue-600 hover:text-blue-900 cursor-pointer">
                          Photo
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveCustomer(item.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectCustomer(item.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-4"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                    {item.kyc_status === 'pending' && (
                      <button
                        onClick={() => handleVerifyKYC(item.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Verify KYC
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSubmitCustomer} className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Add New Customer
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newCustomer.name}
                        onChange={(e) =>
                          setNewCustomer({ ...newCustomer, name: e.target.value })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) =>
                          setNewCustomer({ ...newCustomer, email: e.target.value })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) =>
                          setNewCustomer({ ...newCustomer, phone: e.target.value })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                      </label>
                      <textarea
                        value={newCustomer.address}
                        onChange={(e) =>
                          setNewCustomer({ ...newCustomer, address: e.target.value })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        State
                      </label>
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="">Select State</option>
                        {getFilteredLocations('state', null).map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedState && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          District
                        </label>
                        <select
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          required
                        >
                          <option value="">Select District</option>
                          {getFilteredLocations('district', selectedState).map((district) => (
                            <option key={district.id} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedDistrict && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Mandal
                        </label>
                        <select
                          value={selectedMandal}
                          onChange={(e) => setSelectedMandal(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          required
                        >
                          <option value="">Select Mandal</option>
                          {getFilteredLocations('mandal', selectedDistrict).map((mandal) => (
                            <option key={mandal.id} value={mandal.id}>
                              {mandal.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedMandal && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Village
                        </label>
                        <select
                          value={selectedVillage}
                          onChange={(e) => {
                            setSelectedVillage(e.target.value);
                            setNewCustomer({ ...newCustomer, village_id: e.target.value });
                          }}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          required
                        >
                          <option value="">Select Village</option>
                          {getFilteredLocations('village', selectedMandal).map((village) => (
                            <option key={village.id} value={village.id}>
                              {village.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Aadhaar</label>
                        <input type="file" accept="image/*,.pdf" onChange={e => setNewCustomer(c => ({ ...c, documents: { ...c.documents, aadhaar: e.target.files?.[0] || null } }))} className="mt-1 block w-full text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">PAN</label>
                        <input type="file" accept="image/*,.pdf" onChange={e => setNewCustomer(c => ({ ...c, documents: { ...c.documents, pan: e.target.files?.[0] || null } }))} className="mt-1 block w-full text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Photo</label>
                        <input type="file" accept="image/*" onChange={e => setNewCustomer(c => ({ ...c, documents: { ...c.documents, photo: e.target.files?.[0]?.name || '' } }))} className="mt-1 block w-full text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Signature</label>
                        <input type="file" accept="image/*" onChange={e => setNewCustomer(c => ({ ...c, documents: { ...c.documents, signature: e.target.files?.[0] || null } }))} className="mt-1 block w-full text-xs" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                  >
                    Create Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* After successful onboarding, show navigation buttons */}
      {onboarding.filter(c => c.status === 'approved').map(c => (
        <div key={c.id} className="flex gap-2 mt-2">
          <button onClick={() => navigate('/mandal-head/CustomerGroupMapping')} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Assign to Group</button>
          <button onClick={() => navigate('/mandal-head/LoanApplication')} className="px-2 py-1 bg-green-600 text-white rounded text-xs">Apply for Loan</button>
        </div>
      ))}
    </div>
  );
};

export default CustomerOnboarding; 