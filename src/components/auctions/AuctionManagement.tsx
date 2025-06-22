import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createAuction, getGroupAuctions } from '@/services/auctionApi';
import toast from 'react-hot-toast';

interface Auction {
  id: string;
  auction_date: string;
  min_bid_amount: number;
  status: 'scheduled' | 'open' | 'closed' | 'cancelled';
}

type Inputs = {
  auction_date: string;
  min_bid_amount: number;
};

const AuctionManagement = ({ groupId }: { groupId: string }) => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAuctions();
  }, [groupId]);

  const fetchAuctions = async () => {
    try {
      const data = await getGroupAuctions(groupId);
      setAuctions(data);
    } catch (error) {
      toast.error('Failed to fetch auctions.');
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      await createAuction(groupId, data.auction_date, data.min_bid_amount);
      toast.success('Auction scheduled successfully!');
      reset();
      fetchAuctions(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      {/* Create Auction Form */}
      <h3 className="text-lg font-semibold mb-4">Schedule New Auction</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div>
          <label htmlFor="auction_date">Auction Date & Time</label>
          <input
            id="auction_date"
            type="datetime-local"
            {...register('auction_date', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="min_bid_amount">Minimum Bid</label>
          <input
            id="min_bid_amount"
            type="number"
            {...register('min_bid_amount', { required: true, min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button type="submit" disabled={isLoading} className="w-full btn btn-primary">
          {isLoading ? 'Scheduling...' : 'Schedule Auction'}
        </button>
      </form>

      {/* List of Auctions */}
      <h3 className="text-lg font-semibold mb-4">Scheduled Auctions</h3>
      <div className="space-y-3">
        {auctions.map((auction) => (
          <div key={auction.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <p>Date: {new Date(auction.auction_date).toLocaleString()}</p>
              <p>Min Bid: ₹{auction.min_bid_amount}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800`}>
              {auction.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionManagement; 