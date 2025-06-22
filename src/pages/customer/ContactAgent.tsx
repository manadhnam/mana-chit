import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/solid';

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
  phone: string;
  branch: string;
  address: string;
  workingHours: string;
  availability: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

const ContactAgent = () => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  );

  useEffect(() => {
    fetchAgentDetails();
  }, []);

  const fetchAgentDetails = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData: Agent = {
        id: '1',
        name: 'John Smith',
        role: 'Loan Officer',
        avatar: 'https://ui-avatars.com/api/?name=John+Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        branch: 'Main Branch',
        address: '123 Main Street, City, State 12345',
        workingHours: '9:00 AM - 6:00 PM',
        availability: {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 6:00 PM',
          saturday: '10:00 AM - 2:00 PM',
          sunday: 'Closed',
        },
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAgent(mockData);
    } catch (error) {
      toast.error('Failed to fetch agent details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = () => {
    if (agent) {
      window.location.href = `tel:${agent.phone}`;
    }
  };

  const handleEmail = () => {
    if (agent) {
      window.location.href = `mailto:${agent.email}`;
    }
  };

  const handleVideoCall = () => {
    // TODO: Implement video call functionality
    toast.success('Video call request sent to agent');
  };

  const handleChat = () => {
    // TODO: Implement chat functionality
    toast.success('Chat session initiated');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No agent assigned to your account
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contact Your Agent
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Get in touch with your assigned loan officer
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Agent Profile */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-16 h-16 rounded-full"
            />
            <div className="ml-4">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                {agent.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {agent.role}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Contact Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleCall}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <PhoneIcon className="w-5 h-5 mr-2" />
              Call Agent
            </button>
            <button
              onClick={handleEmail}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              Send Email
            </button>
            <button
              onClick={handleVideoCall}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <VideoCameraIcon className="w-5 h-5 mr-2" />
              Video Call
            </button>
            <button
              onClick={handleChat}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
              Start Chat
            </button>
          </div>
        </div>

        {/* Branch Information */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Branch Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {agent.branch}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {agent.address}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <ClockIcon className="w-5 h-5 text-gray-400 mt-1" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Working Hours
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {agent.workingHours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Weekly Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(agent.availability).map(([day, hours]) => (
              <div
                key={day}
                className={`p-4 rounded-lg ${
                  selectedDay === day
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'bg-gray-50 dark:bg-gray-700/20'
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {day}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {hours}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactAgent; 