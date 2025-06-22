import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceChatbotProps {
  onCommand: (command: string) => void;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  lastCommand?: string;
  error?: string;
}

const VoiceChatbot: React.FC<VoiceChatbotProps> = ({
  onCommand,
  isListening,
  onStartListening,
  onStopListening,
  onToggleMute,
  isMuted,
  lastCommand,
  error,
}) => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">
          Voice commands are not supported in your browser. Please use Chrome or
          Edge for the best experience.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Voice Controls */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <button
            onClick={isListening ? onStopListening : onStartListening}
            className={`p-3 rounded-full ${
              isListening
                ? 'bg-red-100 text-red-600'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={onToggleMute}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {isListening ? 'Listening...' : 'Click microphone to start'}
        </div>
      </div>

      {/* Last Command */}
      {lastCommand && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Last Command:
          </h3>
          <p className="text-gray-900">{lastCommand}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Available Commands */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Available Commands:
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• "Check my balance"</li>
          <li>• "Show my next payment"</li>
          <li>• "Schedule a meeting"</li>
          <li>• "View my passbook"</li>
          <li>• "Apply for a loan"</li>
          <li>• "Check meeting schedule"</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceChatbot; 