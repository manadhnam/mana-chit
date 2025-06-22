import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureCaptureProps {
  onSave?: (signatureData: string) => void;
  onCancel?: () => void;
  title?: string;
  required?: boolean;
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
  className?: string;
}

const SignatureCapture: React.FC<SignatureCaptureProps> = ({
  onSave,
  onCancel,
  title = 'Digital Signature',
  required = true,
  width = 400,
  height = 200,
  penColor = '#000000',
  backgroundColor = '#ffffff',
  className = '',
}) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBegin = () => {
    setIsDrawing(true);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    if (signatureRef.current) {
      const isEmpty = signatureRef.current.isEmpty();
      setHasSignature(!isEmpty);
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setHasSignature(false);
    }
  };

  const handleSave = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        if (required) {
          toast.error('Please provide a signature');
          return;
        }
        // If not required, save empty signature
        onSave?.('');
        return;
      }

      try {
        // Get signature as data URL
        const signatureData = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
        onSave?.(signatureData);
        toast.success('Signature saved successfully');
      } catch (error) {
        console.error('Error saving signature:', error);
        toast.error('Failed to save signature');
      }
    }
  };

  const handleCancel = () => {
    if (hasSignature) {
      if (window.confirm('Are you sure you want to cancel? Your signature will be lost.')) {
        handleClear();
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  const downloadSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      try {
        const canvas = signatureRef.current.getTrimmedCanvas();
        const link = document.createElement('a');
        link.download = `signature-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        toast.success('Signature downloaded');
      } catch (error) {
        console.error('Error downloading signature:', error);
        toast.error('Failed to download signature');
      }
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        <div className="flex items-center space-x-2">
          {isMobile && (
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
              Mobile Mode
            </span>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isMobile 
            ? 'Use your finger to sign in the box below. Tap and drag to draw your signature.'
            : 'Use your mouse or touchpad to sign in the box below. Click and drag to draw your signature.'
          }
        </p>
      </div>

      {/* Signature Canvas */}
      <div className="relative mb-4">
        <div 
          className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
          style={{ 
            width: isMobile ? '100%' : width, 
            height: isMobile ? 150 : height,
            backgroundColor 
          }}
        >
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: 'w-full h-full',
              style: {
                width: '100%',
                height: '100%',
                backgroundColor,
              }
            }}
            penColor={penColor}
            backgroundColor={backgroundColor}
            onBegin={handleBegin}
            onEnd={handleEnd}
            throttle={16} // 60fps
            minWidth={isMobile ? 1 : 2}
            maxWidth={isMobile ? 3 : 4}
            velocityFilterWeight={0.7}
          />
        </div>

        {/* Drawing Indicator */}
        {isDrawing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
          >
            Drawing...
          </motion.div>
        )}

        {/* Signature Status */}
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-sm ${hasSignature ? 'text-green-600' : 'text-gray-500'}`}>
            {hasSignature ? '✓ Signature captured' : 'No signature yet'}
          </span>
          {hasSignature && (
            <button
              onClick={downloadSignature}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Download
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleClear}
          disabled={!hasSignature}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
        
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSave}
          disabled={required && !hasSignature}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
        >
          Save Signature
        </button>
      </div>

      {/* Mobile Tips */}
      {isMobile && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
            Mobile Tips:
          </h4>
          <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Use your finger or stylus for better precision</li>
            <li>• Sign slowly and deliberately</li>
            <li>• Make sure your signature is clearly visible</li>
            <li>• You can clear and re-sign if needed</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SignatureCapture; 