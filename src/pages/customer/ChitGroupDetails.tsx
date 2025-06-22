import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, BanknotesIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import ChitGroupDetailsView from '@/components/chit/ChitGroupDetailsView';

interface Member {
  id: string;
  name: string;
  joinedAt: string;
  status: 'active' | 'inactive';
}

interface Auction {
  id: string;
  date: string;
  winner?: string;
  amount: number;
  status: 'completed' | 'upcoming';
}

interface ChitGroup {
  id: string;
  name: string;
  amount: number;
  duration: number;
  members: Member[];
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  auctions: Auction[];
  rules: string[];
}

const mockGroup: ChitGroup = {
  id: 'CG001',
  name: 'SmartChit Gold 5L',
  amount: 500000,
  duration: 10,
  members: [
    { id: '1', name: 'John Doe', joinedAt: '2024-01-01', status: 'active' },
    { id: '2', name: 'Jane Smith', joinedAt: '2024-01-01', status: 'active' },
    { id: '3', name: 'Ravi Kumar', joinedAt: '2024-01-01', status: 'active' },
    { id: '4', name: 'Priya Patel', joinedAt: '2024-01-01', status: 'active' },
  ],
  status: 'active',
  startDate: '2024-01-01',
  endDate: '2024-10-01',
  auctions: [
    { id: 'A1', date: '2024-02-01', winner: 'John Doe', amount: 450000, status: 'completed' },
    { id: 'A2', date: '2024-03-01', winner: 'Jane Smith', amount: 460000, status: 'completed' },
    { id: 'A3', date: '2024-04-01', status: 'upcoming', amount: 0 },
  ],
  rules: [
    'Monthly payment must be made before the 5th of each month.',
    'Auction winner must submit required documents within 3 days.',
    'Late payment will incur a penalty as per company policy.',
    'Members must attend monthly meetings.',
  ],
};

const ChitGroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [group, setGroup] = useState<ChitGroup | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGroup(mockGroup);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading group details...</p>
        </div>
      ) : group ? (
        <ChitGroupDetailsView group={group} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Chit group not found.</p>
        </div>
      )}
    </div>
  );
};

export default ChitGroupDetails; 