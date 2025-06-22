import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit'; // Assuming you have an audit log service

// --- Auction Management ---

/**
 * Create a new auction for a chit group.
 * @param groupId - The ID of the group.
 * @param auctionDate - The date and time of the auction.
 * @param minBidAmount - The minimum bid amount required.
 */
export const createAuction = async (groupId: string, auctionDate: string, minBidAmount: number) => {
  const { data, error } = await supabase
    .from('auctions')
    .insert({
      group_id: groupId,
      auction_date: auctionDate,
      min_bid_amount: minBidAmount,
      status: 'scheduled',
    })
    .select()
    .single();

  if (error) throw error;
  
  await log_audit('auction.create', { auctionId: data.id, groupId });
  return data;
};

/**
 * Get all auctions for a specific group.
 * @param groupId - The ID of the group.
 */
export const getGroupAuctions = async (groupId: string) => {
  const { data, error } = await supabase
    .from('auctions')
    .select('*')
    .eq('group_id', groupId)
    .order('auction_date', { ascending: false });

  if (error) throw error;
  return data;
};


// --- Bidding Management ---

/**
 * Place a bid in an auction.
 * @param auctionId - The ID of the auction.
 * @param userId - The ID of the user placing the bid.
 * @param bidAmount - The amount of the bid.
 */
export const placeBid = async (auctionId: string, userId: string, bidAmount: number) => {
  // Optional: Add logic here to ensure bid is valid (e.g., > min_bid_amount, auction is open)
  
  const { data, error } = await supabase
    .from('bids')
    .insert({
      auction_id: auctionId,
      user_id: userId,
      bid_amount: bidAmount,
    })
    .select()
    .single();
    
  if (error) throw error;

  await log_audit('bid.place', { bidId: data.id, auctionId, userId, bidAmount });
  return data;
};

/**
 * Close an auction, determine the winner, and update the status.
 * This should ideally be a Supabase Edge Function triggered by a schedule.
 * @param auctionId - The ID of the auction to close.
 */
export const closeAuctionAndDetermineWinner = async (auctionId: string) => {
  // 1. Find the lowest bid (winner) for the auction.
  const { data: bids, error: bidsError } = await supabase
    .from('bids')
    .select('id, bid_amount')
    .eq('auction_id', auctionId)
    .order('bid_amount', { ascending: true })
    .limit(1);

  if (bidsError || !bids || bids.length === 0) {
    // Handle case with no bids - maybe cancel the auction
    await supabase.from('auctions').update({ status: 'cancelled' }).eq('id', auctionId);
    throw new Error('No bids were placed in this auction.');
  }

  const winningBid = bids[0];

  // 2. Update the auction with the winning bid and set status to 'closed'.
  const { data: updatedAuction, error: updateError } = await supabase
    .from('auctions')
    .update({
      winning_bid_id: winningBid.id,
      status: 'closed',
    })
    .eq('id', auctionId)
    .select()
    .single();

  if (updateError) throw updateError;
  
  await log_audit('auction.close', { auctionId, winningBidId: winningBid.id });
  return updatedAuction;
}; 