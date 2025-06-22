import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

interface SyncItem {
  id: string;
  type: 'payment' | 'attendance' | 'meeting' | 'receipt';
  data: any;
  timestamp: string;
  status: 'pending' | 'synced' | 'failed';
  error?: string;
}

interface OfflineSyncModuleProps {
  syncItems: SyncItem[];
  onSync: (itemId: string) => Promise<void>;
  onRetry: (itemId: string) => Promise<void>;
  onDelete: (itemId: string) => void;
}

const OfflineSyncModule: React.FC<OfflineSyncModuleProps> = ({
  syncItems,
  onSync,
  onRetry,
  onDelete,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSyncAll = async () => {
    if (!isOnline) return;

    setIsSyncing(true);
    try {
      const pendingItems = syncItems.filter((item) => item.status === 'pending');
      for (const item of pendingItems) {
        await onSync(item.id);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusColor = (status: SyncItem['status']) => {
    switch (status) {
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: SyncItem['type']) => {
    switch (type) {
      case 'payment':
        return '💰';
      case 'attendance':
        return '📝';
      case 'meeting':
        return '👥';
      case 'receipt':
        return '📄';
      default:
        return '📦';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isOnline ? (
            <Wifi className="w-6 h-6 text-green-600" />
          ) : (
            <WifiOff className="w-6 h-6 text-red-600" />
          )}
          <span className="font-medium">
            {isOnline ? 'Online' : 'Offline Mode'}
          </span>
        </div>
        <button
          onClick={handleSyncAll}
          disabled={!isOnline || isSyncing}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isOnline && !isSyncing
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
        </button>
      </div>

      {/* Sync Items List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Pending Sync Items</h2>
        <div className="space-y-4">
          {syncItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(item.type)}</span>
                <div>
                  <p className="font-medium capitalize">{item.type}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

                {item.status === 'failed' && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{item.error}</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  {item.status === 'failed' && (
                    <button
                      onClick={() => onRetry(item.id)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                      title="Retry Sync"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    title="Delete Item"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {syncItems.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No pending sync items
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineSyncModule; 