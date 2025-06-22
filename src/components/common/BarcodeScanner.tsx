import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan?: (result: string, format: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  title?: string;
  supportedFormats?: string[];
  showScanner?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  onClose,
  title = 'Barcode Scanner',
  supportedFormats = [
    'QR_CODE',
    'CODE_128',
    'CODE_39',
    'EAN_13',
    'EAN_8',
    'UPC_A',
    'UPC_E',
    'DATA_MATRIX',
    'PDF_417',
    'AZTEC'
  ],
  showScanner = false,
  className = '',
  width = 400,
  height = 300,
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [lastScanned, setLastScanned] = useState<string>('');
  const [scanHistory, setScanHistory] = useState<Array<{ code: string; format: string; timestamp: Date }>>([]);

  useEffect(() => {
    if (showScanner && !isScanning) {
      startScanner();
    } else if (!showScanner && isScanning) {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [showScanner]);

  const startScanner = async () => {
    if (!containerRef.current) return;

    try {
      // Check camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);

      // Initialize scanner
      scannerRef.current = new Html5QrcodeScanner(
        containerRef.current.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          supportedScanTypes: supportedFormats.map(format => Html5QrcodeScanType[format as keyof typeof Html5QrcodeScanType]),
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
        },
        false
      );

      scannerRef.current.render(
        (decodedText, decodedResult) => {
          if (decodedResult?.result?.format?.formatName) {
            const format = decodedResult.result.format.formatName;
            setLastScanned(decodedText);
            
            // Add to scan history
            setScanHistory(prev => [
              { code: decodedText, format, timestamp: new Date() },
              ...prev.slice(0, 9) // Keep last 10 scans
            ]);

            onScan?.(decodedText, format);
            toast.success(`Scanned: ${decodedText}`);
          }
        },
        (errorMessage) => {
          // Ignore errors during scanning
          console.log('Scan error:', errorMessage);
        }
      );

      setIsScanning(true);
    } catch (error) {
      console.error('Scanner initialization error:', error);
      setHasPermission(false);
      onError?.('Failed to access camera. Please check permissions.');
      toast.error('Camera access denied');
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      startScanner();
    } catch (error) {
      setHasPermission(false);
      onError?.('Camera permission denied');
      toast.error('Camera permission denied');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadScanHistory = () => {
    const csvContent = [
      'Code,Format,Timestamp',
      ...scanHistory.map(scan => 
        `"${scan.code}","${scan.format}","${scan.timestamp.toISOString()}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-scans-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('Scan history downloaded');
  };

  if (!showScanner) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scanner Container */}
        <div className="p-4">
          {hasPermission === null && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Initializing scanner...</p>
            </div>
          )}

          {hasPermission === false && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Camera Access Required
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please allow camera access to use the barcode scanner.
              </p>
              <button
                onClick={requestPermission}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Grant Permission
              </button>
            </div>
          )}

          {hasPermission === true && (
            <div className="space-y-4">
              {/* Scanner */}
              <div 
                ref={containerRef}
                id={`scanner-${Date.now()}`}
                className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
                style={{ width, height }}
              />

              {/* Last Scanned Result */}
              {lastScanned && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Last Scanned:
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 break-all">
                        {lastScanned}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(lastScanned)}
                      className="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Scan History */}
              {scanHistory.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Recent Scans ({scanHistory.length})
                    </h3>
                    <button
                      onClick={downloadScanHistory}
                      className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Download CSV
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {scanHistory.map((scan, index) => (
                      <div
                        key={index}
                        className="p-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-900 dark:text-white truncate">
                              {scan.code}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {scan.format} • {scan.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(scan.code)}
                            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supported Formats */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="mb-1">Supported formats:</p>
                <div className="flex flex-wrap gap-1">
                  {supportedFormats.map(format => (
                    <span
                      key={format}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                    >
                      {format.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isScanning ? 'Scanning...' : 'Scanner ready'}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BarcodeScanner; 