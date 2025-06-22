import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  onClear: () => void;
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  onClear,
  width = 500,
  height = 200,
  penColor = '#000000',
  backgroundColor = '#ffffff',
}) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  }, []);

  const handleSave = () => {
    if (signatureRef.current && !isEmpty) {
      const signature = signatureRef.current.toDataURL();
      onSave(signature);
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsEmpty(true);
      onClear();
    }
  };

  const handleEnd = () => {
    if (signatureRef.current) {
      setIsEmpty(signatureRef.current.isEmpty());
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="border-2 border-gray-300 rounded-lg"
        style={{ width, height, backgroundColor }}
      >
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            width,
            height,
            className: 'signature-canvas',
          }}
          penColor={penColor}
          onEnd={handleEnd}
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          disabled={isEmpty}
          className={`px-4 py-2 rounded-lg ${
            isEmpty
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Save Signature
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SignaturePad; 