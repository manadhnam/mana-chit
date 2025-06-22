import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';

interface TwoFactorAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupComplete: (secret: string, backupCodes: string[]) => void;
  onVerify: (token: string) => Promise<boolean>;
  mode: 'setup' | 'verify' | 'disable';
  userId: string;
  userEmail: string;
  className?: string;
}

interface BackupCode {
  code: string;
  used: boolean;
  usedAt?: Date;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  isOpen,
  onClose,
  onSetupComplete,
  onVerify,
  mode,
  userId,
  userEmail,
  className = '',
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'qr' | 'verify' | 'backup' | 'complete'>('qr');
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [inputRefs, setInputRefs] = useState<React.RefObject<HTMLInputElement>[]>([]);

  // Generate 6-digit input refs
  useEffect(() => {
    setInputRefs(Array(6).fill(0).map(() => React.createRef<HTMLInputElement>()));
  }, []);

  // Timer for TOTP
  useEffect(() => {
    if (mode === 'verify' && isOpen) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [mode, isOpen]);

  // Generate secret and QR code on setup
  useEffect(() => {
    if (mode === 'setup' && isOpen && !secret) {
      generateSecret();
    }
  }, [mode, isOpen, secret]);

  const generateSecret = async () => {
    try {
      setIsLoading(true);
      
      // Generate a random secret (in real app, this would come from backend)
      const generatedSecret = generateRandomSecret();
      setSecret(generatedSecret);

      // Generate QR code
      const otpauthUrl = `otpauth://totp/SmartChit:${userEmail}?secret=${generatedSecret}&issuer=SmartChit&algorithm=SHA1&digits=6&period=30`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      
      setQrCodeUrl(qrCodeDataUrl);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating secret:', error);
      toast.error('Failed to generate 2FA setup');
      setIsLoading(false);
    }
  };

  const generateRandomSecret = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateBackupCodes = (): BackupCode[] => {
    const codes: BackupCode[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      codes.push({ code, used: false });
    }
    return codes;
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newCode = verificationCode.split('');
    newCode[index] = value;
    const updatedCode = newCode.join('');
    setVerificationCode(updatedCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      const isValid = await onVerify(verificationCode);
      
      if (isValid) {
        if (mode === 'setup') {
          // Generate backup codes
          const codes = generateBackupCodes();
          setBackupCodes(codes);
          setStep('backup');
        } else if (mode === 'verify') {
          toast.success('2FA verification successful');
          onClose();
        } else if (mode === 'disable') {
          toast.success('2FA disabled successfully');
          onClose();
        }
      } else {
        toast.error('Invalid verification code');
        setVerificationCode('');
        inputRefs[0]?.current?.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupComplete = () => {
    const backupCodeStrings = backupCodes.map(code => code.code);
    onSetupComplete(secret, backupCodeStrings);
    setStep('complete');
    toast.success('2FA setup completed successfully');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadBackupCodes = () => {
    const content = `SmartChit 2FA Backup Codes\n\n${backupCodes.map(code => code.code).join('\n')}\n\nKeep these codes safe. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smartchit-2fa-backup-codes.txt';
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

  const renderQRStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Set Up Two-Factor Authentication
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
      </p>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
          </div>
        </div>
      )}

      <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Manual Entry</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          If you can't scan the QR code, enter this code manually in your app:
        </p>
        <div className="flex items-center space-x-2">
          <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono">
            {secret}
          </code>
          <button
            onClick={() => copyToClipboard(secret)}
            className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep('verify')}
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {mode === 'setup' ? 'Verify Setup' : mode === 'verify' ? 'Enter 2FA Code' : 'Disable 2FA'}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Enter the 6-digit code from your authenticator app
      </p>

      <div className="flex justify-center space-x-2">
        {Array(6).fill(0).map((_, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={verificationCode[index] || ''}
            onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        ))}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Code expires in {timeRemaining}s
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => mode === 'setup' ? setStep('qr') : onClose()}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleVerify}
          disabled={verificationCode.length !== 6 || isLoading}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );

  const renderBackupStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
          Save Backup Codes
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white">Backup Codes</h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBackupCodes(!showBackupCodes)}
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {showBackupCodes ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={downloadBackupCodes}
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Download
            </button>
          </div>
        </div>
        
        {showBackupCodes ? (
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, index) => (
              <div
                key={index}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono text-center"
              >
                {code.code}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <button
              onClick={() => setShowBackupCodes(true)}
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Click to reveal backup codes
            </button>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Important:</strong> Each backup code can only be used once. Keep them safe and secure.
        </p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setStep('verify')}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSetupComplete}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Setup Complete!
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Two-factor authentication has been successfully enabled for your account.
      </p>
      
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <p className="text-sm text-green-800 dark:text-green-200">
          Your account is now protected with 2FA. You'll need to enter a code from your authenticator app each time you log in.
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        Done
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'qr' && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderQRStep()}
              </motion.div>
            )}
            
            {step === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderVerifyStep()}
              </motion.div>
            )}
            
            {step === 'backup' && (
              <motion.div
                key="backup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderBackupStep()}
              </motion.div>
            )}
            
            {step === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderCompleteStep()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TwoFactorAuth; 