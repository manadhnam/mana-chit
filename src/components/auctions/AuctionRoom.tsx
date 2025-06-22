import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { placeBid } from '@/services/auctionApi';
import toast from 'react-hot-toast';

interface Bid {
  id: string;
  user_id: string;
  bid_amount: number;
  created_at: string;
  // You might want to join the user's name in the query
  users?: { name: string };
}

const AuctionRoom = ({ auctionId }: { auctionId: string }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [newBid, setNewBid] = useState('');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Fetch initial bids
    const fetchBids = async () => {
      const { data, error } = await supabase
        .from('bids')
        .select('*, users(name)') // Join user name
        .eq('auction_id', auctionId)
        .order('created_at', { ascending: false });
      
      if (data) setBids(data as Bid[]);
    };
    fetchBids();

    // Listen for new bids in real-time
    const channel = supabase
      .channel(`auction_${auctionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bids', filter: `auction_id=eq.${auctionId}` },
        (payload) => {
          // You'd need to fetch the user's name for the new bid separately
          // or adjust your logic to handle this.
          setBids((prevBids) => [payload.new as Bid, ...prevBids]);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newBid) return;

    try {
      await placeBid(auctionId, user.id, parseFloat(newBid));
      setNewBid('');
      // The real-time subscription will handle updating the UI
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">Live Auction Room</h3>
      
      {/* Bid Form */}
      <form onSubmit={handlePlaceBid} className="flex gap-2 mb-4">
        <input
          type="number"
          value={newBid}
          onChange={(e) => setNewBid(e.target.value)}
          placeholder="Enter your bid"
          className="flex-grow input input-bordered"
        />
        <button type="submit" className="btn btn-primary">Place Bid</button>
      </form>

      {/* Live Bids List */}
      <div className="space-y-2">
        {bids.map((bid) => (
          <div key={bid.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span className="font-semibold">{bid.users?.name || 'A user'}</span> bid <span className="text-green-600 font-bold">₹{bid.bid_amount}</span>
            <div className="text-xs text-gray-500">{new Date(bid.created_at).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionRoom; 