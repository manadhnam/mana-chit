import React, { useState } from 'react';
import { QrCodeIcon, ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BranchQrDisplayProps {
  branchId: string;
  branchName: string;
  qrData: string;
  amount?: number;
  description?: string;
  onDownload?: () => void;
  onShare?: () => void;
}

const BranchQrDisplay: React.FC<BranchQrDisplayProps> = ({
  branchId,
  branchName,
  qrData,
  amount,
  description,
  onDownload,
  onShare
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      if (onDownload) {
        await onDownload();
      } else {
        // Default download behavior
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Create a simple QR code representation
          canvas.width = 200;
          canvas.height = 200;
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, 200, 200);
          ctx.fillStyle = '#fff';
          ctx.fillRect(10, 10, 180, 180);
          
          const link = document.createElement('a');
          link.download = `qr-${branchId}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (onShare) {
        await onShare();
      } else if (navigator.share) {
        await navigator.share({
          title: `${branchName} QR Code`,
          text: description || `Scan to pay ${amount ? `₹${amount}` : ''}`,
          url: qrData
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(qrData);
        alert('QR code data copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCodeIcon className="h-5 w-5" />
          QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <QrCodeIcon className="h-24 w-24 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{branchName}</h3>
            {amount && (
              <div className="text-2xl font-bold text-green-600">
                ₹{amount.toLocaleString()}
              </div>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            )}
            <Badge variant="outline" className="text-xs">
              Branch ID: {branchId}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleDownload} 
            disabled={isLoading}
            className="flex-1"
            variant="outline"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            onClick={handleShare}
            className="flex-1"
            variant="outline"
          >
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Scan this QR code to make a payment to {branchName}
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchQrDisplay; 