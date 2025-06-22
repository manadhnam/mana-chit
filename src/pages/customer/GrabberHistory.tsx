import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { UserIcon } from '@heroicons/react/24/outline';



interface GrabberHistory {
  id: string;
  chitGroupId: string;
  chitGroupName: string;
  auctionDate: string;
  totalAmount: number;
  winningBid: number;
  winnerName: string;
  status: 'completed' | 'cancelled' | 'pending';
  bids: {
    id: string;
    bidderName: string;
    amount: number;
    timestamp: string;
    status: 'winning' | 'losing' | 'pending';
  }[];
}

const GrabberHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<GrabberHistory[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<GrabberHistory | null>(null);

  useEffect(() => {
    const fetchGrabberHistory = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData: GrabberHistory[] = [
          {
            id: 'AUCT001',
            chitGroupId: 'CHIT001',
            chitGroupName: 'Monthly Chit Group',
            auctionDate: '2024-03-15',
            totalAmount: 100000,
            winningBid: 85000,
            winnerName: 'John Doe',
            status: 'completed',
            bids: [
              {
                id: 'BID001',
                bidderName: 'John Doe',
                amount: 85000,
                timestamp: '2024-03-15T10:30:00',
                status: 'winning',
              },
              {
                id: 'BID002',
                bidderName: 'Jane Smith',
                amount: 82000,
                timestamp: '2024-03-15T10:25:00',
                status: 'losing',
              },
            ],
          },
          {
            id: 'AUCT002',
            chitGroupId: 'CHIT001',
            chitGroupName: 'Monthly Chit Group',
            auctionDate: '2024-02-15',
            totalAmount: 100000,
            winningBid: 88000,
            winnerName: 'Jane Smith',
            status: 'completed',
            bids: [
              {
                id: 'BID003',
                bidderName: 'Jane Smith',
                amount: 88000,
                timestamp: '2024-02-15T10:30:00',
                status: 'winning',
              },
              {
                id: 'BID004',
                bidderName: 'John Doe',
                amount: 85000,
                timestamp: '2024-02-15T10:25:00',
                status: 'losing',
              },
            ],
          },
        ];
        
        setHistory(mockData);
      } catch (error) {
        console.error('Failed to fetch grabber history:', error);
        toast.error('Failed to load grabber history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrabberHistory();
  }, []);

  const getStatusColor = (status: GrabberHistory['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getBidStatusColor = (status: GrabberHistory['bids'][0]['status']) => {
    switch (status) {
      case 'winning':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'losing':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading grabber history...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Grabber History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View the history of chit auctions and bids
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Auction List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Auction Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Chit Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Winning Bid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {history.map((auction) => (
                    <tr
                      key={auction.id}
                      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        selectedAuction?.id === auction.id ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                      }`}
                      onClick={() => setSelectedAuction(auction)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(auction.auctionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {auction.chitGroupName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ₹{auction.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ₹{auction.winningBid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(auction.status)}`}>
                          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 dark:text-primary-400">
                        View Details
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Auction Details */}
        <div className="space-y-6">
          {selectedAuction ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Auction Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Chit Group</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedAuction.chitGroupName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Auction Date</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(selectedAuction.auctionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      ₹{selectedAuction.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Winning Bid</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      ₹{selectedAuction.winningBid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Winner</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedAuction.winnerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAuction.status)}`}>
                      {selectedAuction.status.charAt(0).toUpperCase() + selectedAuction.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Bid History
                </h2>
                <div className="space-y-4">
                  {selectedAuction.bids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {bid.bidderName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(bid.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{bid.amount.toLocaleString()}
                        </p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBidStatusColor(bid.status)}`}>
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Select an auction to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrabberHistory; 