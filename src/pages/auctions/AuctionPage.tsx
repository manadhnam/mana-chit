
import AuctionManagement from '@/components/auctions/AuctionManagement';
import AuctionRoom from '@/components/auctions/AuctionRoom';
import { useAuthStore } from '@/store/authStore';
import { useParams, Link } from 'react-router-dom';

const AuctionPage = () => {
  const { groupId, auctionId } = useParams<{ groupId: string; auctionId: string }>();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'superAdmin' || user?.role === 'branchManager';

  // This is a simplified example. In a real app, you'd have a list of auctions
  // and the user would navigate to a specific auction room.
  
  if (auctionId) {
    return <AuctionRoom auctionId={auctionId} />;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Chit Group Auctions</h1>
      <div className="max-w-4xl mx-auto">
        {isAdmin && groupId && <AuctionManagement groupId={groupId} />}
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Auctions</h2>
          {/* This would be a dynamic list fetched from your API */}
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <p>Auction for Group X on 2024-08-01</p>
              <Link to={`/groups/${groupId}/auctions/1`} className="text-blue-600">
                Enter Auction Room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPage; 