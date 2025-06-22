import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  isRead: boolean;
  attachments?: Array<{
    type: 'image' | 'file' | 'document';
    name: string;
    url: string;
    size?: number;
  }>;
}

interface ChatSupportProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userRole: string;
  userName: string;
  className?: string;
}

const ChatSupport: React.FC<ChatSupportProps> = ({
  isOpen,
  onClose,
  userId,
  userRole,
  userName,
  className = '',
}) => {
  const { t } = useTranslation();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [agentInfo, setAgentInfo] = useState<{
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'busy';
  } | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize socket connection
  useEffect(() => {
    if (isOpen && !socket) {
      const newSocket = io(import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:3001', {
        query: {
          userId,
          userRole,
          userName,
        },
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setChatStatus('connected');
        toast.success('Connected to support chat');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        setChatStatus('disconnected');
        toast.error('Disconnected from support chat');
      });

      newSocket.on('message', (message: Message) => {
        setMessages(prev => [...prev, message]);
        if (message.sender === 'agent') {
          toast.success('New message from support agent');
        }
      });

      newSocket.on('agentTyping', (typing: boolean) => {
        setAgentTyping(typing);
      });

      newSocket.on('agentInfo', (info: any) => {
        setAgentInfo(info);
      });

      newSocket.on('quickReplies', (replies: string[]) => {
        setQuickReplies(replies);
      });

      newSocket.on('chatEnded', () => {
        toast('Chat session ended by agent');
        onClose();
      });

      setSocket(newSocket);

      // Load initial messages
      loadInitialMessages();
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [isOpen, userId, userRole, userName]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadInitialMessages = async () => {
    try {
      // Simulate loading initial messages
      const initialMessages: Message[] = [
        {
          id: '1',
          text: 'Hello! Welcome to SmartChit support. How can I help you today?',
          sender: 'agent',
          timestamp: new Date(),
          isRead: true,
        },
        {
          id: '2',
          text: 'You can ask me about payments, loans, chit groups, or any other queries.',
          sender: 'agent',
          timestamp: new Date(),
          isRead: true,
        },
      ];
      setMessages(initialMessages);

      // Set quick replies
      setQuickReplies([
        'I need help with payments',
        'How do I join a chit group?',
        'I want to apply for a loan',
        'My KYC is pending',
        'I have a technical issue',
      ]);
    } catch (error) {
      console.error('Error loading initial messages:', error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !socket) return;

    const message: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      isRead: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      socket.emit('message', {
        text: text.trim(),
        userId,
        userRole,
        userName,
      });

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
    setShowQuickReplies(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }

    // Simulate file upload
    const attachment = {
      type: (file.type.startsWith('image/') ? 'image' : 'file') as 'image' | 'file' | 'document',
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    };

    const message: Message = {
      id: Date.now().toString(),
      text: `Sent: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      isRead: false,
      attachments: [attachment],
    };

    setMessages(prev => [...prev, message]);
    toast.success('File uploaded successfully');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConnectionStatusColor = () => {
    switch (chatStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 w-96 h-[500px] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
            </div>
            <div>
              <h3 className="font-semibold">SmartChit Support</h3>
              <p className="text-xs opacity-90">
                {agentInfo ? `${agentInfo.name} • ${agentInfo.status}` : 'Connecting...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-500 text-white'
                    : message.sender === 'agent'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs opacity-80">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicators */}
          {agentTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <AnimatePresence>
          {showQuickReplies && quickReplies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-4 py-2 border-t border-gray-200 dark:border-gray-600"
            >
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowQuickReplies(!showQuickReplies)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Quick replies"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Attach file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </motion.div>
    </div>
  );
};

export default ChatSupport; 