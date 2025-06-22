import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { ChitGroup, Auction, User } from '@/types/database';
import { ArrowLeftIcon, PlusIcon, ClockIcon, TrophyIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { formatDate } from '@/utils/formatters';

type EnrichedAuction = Auction & { winner_name?: string };

const GroupAuctions = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<ChitGroup | null>(null);
  const [auctions, setAuctions] = useState<EnrichedAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAuctionData = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('chit_groups')
        .select('*')
        .eq('id', groupId)
        .single();
      if (groupError) throw groupError;
      setGroup(groupData);

      const { data: auctionData, error: auctionError } = await supabase
        .from('auctions')
        .select('*')
        .eq('chit_group_id', groupId)
        .order('cycle_number', { ascending: false });
      if (auctionError) throw auctionError;

      const winnerIds = auctionData.map(a => a.winner_id).filter(Boolean) as string[];
      let winnersMap: Record<string, string> = {};

      if (winnerIds.length > 0) {
        const { data: winnerData, error: winnerError } = await supabase
          .from('users')
          .select('id, name')
          .in('id', winnerIds);
        if (winnerError) throw winnerError;
        winnersMap = winnerData.reduce((acc, user) => {
            acc[user.id] = user.name;
            return acc;
        }, {} as Record<string, string>);
      }

      const enrichedAuctions = auctionData.map(a => ({
        ...a,
        winner_name: a.winner_id ? winnersMap[a.winner_id] : 'N/A',
      }));

      setAuctions(enrichedAuctions);

    } catch (error: any) {
      toast.error('Failed to fetch auction data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchAuctionData();
  }, [fetchAuctionData]);

  const handleStartNewAuction = async (startTime: string, endTime: string) => {
    if (!group) return;

    const toastId = toast.loading('Starting new auction...');
    try {
      const { error } = await supabase.from('auctions').insert({
        chit_group_id: group.id,
        cycle_number: group.current_cycle,
        start_time: startTime,
        end_time: endTime,
        status: 'scheduled',
      });
      if (error) throw error;
      
      toast.success('New auction for cycle ' + group.current_cycle + ' has been scheduled.', { id: toastId });
      setIsModalOpen(false);
      fetchAuctionData();
    } catch (error: any) {
      toast.error('Failed to start auction: ' + error.message, { id: toastId });
    }
  };

  const canStartNewAuction = group && group.status === 'active' && !auctions.some(a => a.cycle_number === group.current_cycle);

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading auctions...</div>;
  if (!group) return <div className="p-8 text-center text-red-500">Group not found.</div>;
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          to={`/branch-manager/groups/${groupId}`}
          className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Group Details
        </Link>
      </div>

      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {group.group_name} Auctions
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage auctions for this chit group. Current Cycle: {group.current_cycle}
          </p>
        </div>
        <button
          disabled={!canStartNewAuction}
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Start New Auction
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cycle</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Winner</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {auctions.length > 0 ? (
                auctions.map((auction) => (
                  <tr key={auction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{auction.cycle_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(auction.start_time)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(auction.end_time)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          auction.status === 'active' ? 'bg-green-100 text-green-800' :
                          auction.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          auction.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {auction.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{auction.winner_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/branch-manager/groups/${group.id}/auctions/${auction.id}`} className="text-primary-600 hover:text-primary-900" title="View Bids">
                            <EyeIcon className="h-5 w-5" />
                        </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No auctions have been held for this group yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
          <StartAuctionModal 
            group={group}
            onClose={() => setIsModalOpen(false)}
            onStart={handleStartNewAuction}
          />
      )}
    </div>
  );
};

const StartAuctionModal = ({ group, onClose, onStart }: { group: ChitGroup, onClose: () => void, onStart: (startTime: string, endTime: string) => void }) => {
    const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
    const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16));
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStart(startTime, endTime);
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4">
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Start New Auction for Cycle {group.current_cycle}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
                <div className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-600 rounded-b">
                    <button type="button" onClick={onClose} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                    <button type="submit" className="ml-3 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Schedule Auction</button>
                </div>
            </form>
          </div>
        </div>
    )
}

export default GroupAuctions; 