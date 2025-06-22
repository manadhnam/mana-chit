import React, { useState } from 'react';
import { QrReader } from '@cmdnio/react-qr-reader';

interface QRCodeScannerProps {
  onResult: (result: string | null, error: Error | null) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onResult,
}) => {
  const [isScanning, setIsScanning] = useState(true);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-md aspect-square">
        {isScanning ? (
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (result) {
                onResult(result.getText(), null);
                setIsScanning(false);
              }

              if (error) {
                onResult(null, error);
              }
            }}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-600">Scan complete</p>
          </div>
        )}
      </div>
      <button
        onClick={() => setIsScanning(!isScanning)}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isScanning ? 'Stop Scanning' : 'Start Scanning'}
      </button>
    </div>
  );
};

export default QRCodeScanner; 