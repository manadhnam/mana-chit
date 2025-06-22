import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { Auction, Bid, User, ChitGroup } from '@/types/database';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { formatCurrency, formatDate } from '@/utils/formatters';

type EnrichedBid = Bid & { user_name: string };

const AuctionDetail = () => {
  const { groupId, auctionId } = useParams<{ groupId: string, auctionId: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [group, setGroup] = useState<ChitGroup | null>(null);
  const [bids, setBids] = useState<EnrichedBid[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMember, setSelectedMember] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  const fetchAuctionDetails = useCallback(async () => {
    if (!auctionId || !groupId) return;
    setLoading(true);

    try {
      const { data: auctionData, error: auctionError } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', auctionId)
        .single();
      if (auctionError) throw auctionError;
      setAuction(auctionData);

      const { data: groupData, error: groupError } = await supabase
        .from('chit_groups')
        .select('*')
        .eq('id', groupId)
        .single();
      if (groupError) throw groupError;
      setGroup(groupData);

      // Fetch Members for bidding form
      const { data: memberLinks, error: memberError } = await supabase
        .from('chit_members').select('user_id').eq('chit_group_id', groupId);
      if (memberError) throw memberError;
      const memberIds = memberLinks.map(m => m.user_id);
      if(memberIds.length > 0) {
        const { data: memberData, error: userError } = await supabase
            .from('users').select('*').in('id', memberIds);
        if (userError) throw userError;
        setMembers(memberData);
      }

      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .select('*')
        .eq('auction_id', auctionId)
        .order('amount', { ascending: true });
      if (bidError) throw bidError;

      const userIds = bidData.map(b => b.user_id);
      let usersMap: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name')
          .in('id', userIds);
        if (userError) throw userError;
        usersMap = userData.reduce((acc, user) => {
            acc[user.id] = user.name;
            return acc;
        }, {} as Record<string, string>);
      }

      const enrichedBids = bidData.map(b => ({
        ...b,
        user_name: usersMap[b.user_id] || 'Unknown',
      }));

      setBids(enrichedBids);

    } catch (error: any) {
      toast.error('Failed to fetch auction details: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [auctionId, groupId]);

  useEffect(() => {
    fetchAuctionDetails();
  }, [fetchAuctionDetails]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !bidAmount || !auction || !group) return;
    
    const amount = parseFloat(bidAmount);
    if(isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid bid amount.');
        return;
    }
    
    if(amount >= group.chit_value) {
        toast.error(`Bid must be less than the total chit value of ${formatCurrency(group.chit_value)}.`);
        return;
    }

    if(bids.length > 0 && amount >= bids[0].amount) {
        toast.error(`Your bid must be lower than the current lowest bid of ${formatCurrency(bids[0].amount)}.`);
        return;
    }

    const toastId = toast.loading('Placing bid...');
    try {
        const { error } = await supabase.from('bids').insert({
            auction_id: auction.id,
            user_id: selectedMember,
            amount,
        });
        if (error) throw error;
        toast.success('Bid placed successfully!', { id: toastId });
        setBidAmount('');
        setSelectedMember('');
        fetchAuctionDetails();
    } catch(error: any) {
        toast.error(`Failed to place bid: ${error.message}`, { id: toastId });
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading auction details...</div>;
  if (!auction || !group) return <div className="p-8 text-center text-red-500">Auction or Group not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          to={`/branch-manager/groups/${groupId}/auctions`}
          className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Auctions
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Auction for Cycle {auction.cycle_number}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Group: {group.group_name}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="font-semibold">Status: <span className="font-normal capitalize">{auction.status}</span></span>
            <span className="font-semibold">Starts: <span className="font-normal">{formatDate(auction.start_time)}</span></span>
            <span className="font-semibold">Ends: <span className="font-normal">{formatDate(auction.end_time)}</span></span>
          </div>
        </div>
      </div>
      
      {auction.status === 'active' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-semibold p-6 text-gray-900 dark:text-white">Place a Bid on Behalf of a Member</h2>
            <form onSubmit={handlePlaceBid} className="p-6 border-t dark:border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Member</label>
                    <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                        <option value="">Choose a member...</option>
                        {members.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bid Amount</label>
                    <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500" placeholder={`Current lowest: ${bids.length > 0 ? formatCurrency(bids[0].amount) : 'N/A'}`} />
                </div>
                <div className="text-right">
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Place Bid</button>
                </div>
            </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-lg font-semibold p-6 text-gray-900 dark:text-white">Bids</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bidder</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {bids.length > 0 ? (
                bids.map((bid) => (
                  <tr key={bid.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{bid.user_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(bid.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(bid.created_at).toLocaleString('en-IN')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No bids have been placed for this auction yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;