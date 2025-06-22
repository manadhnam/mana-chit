import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Meeting } from '@/types/database';

interface MeetingDetails extends Meeting {
    staff_name: string;
    staff_role: string;
    staff_avatar?: string;
}

const MeetingSchedule = () => {
  const { user } = useAuthStore();
  const [meetings, setMeetings] = useState<MeetingDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const fetchMeetings = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const { data: meetingsData, error: meetingsError } = await supabase
            .from('meetings')
            .select('*')
            .eq('customer_id', user.id);

        if (meetingsError) throw meetingsError;

        if (meetingsData && meetingsData.length > 0) {
            const staffIds = meetingsData.map(m => m.staff_id);
            const { data: staffData, error: staffError } = await supabase
                .from('users')
                .select('id, name, role')
                .in('id', staffIds);
            
            if (staffError) throw staffError;

            const staffMap = new Map(staffData.map(s => [s.id, s]));

            const formattedMeetings = meetingsData.map((m: Meeting) => ({
                ...m,
                staff_name: staffMap.get(m.staff_id)?.name || 'Unknown Staff',
                staff_role: staffMap.get(m.staff_id)?.role || 'N/A',
                staff_avatar: '', // You can add avatar URL to users table later
            }));
            setMeetings(formattedMeetings);
        } else {
            setMeetings([]);
        }

    } catch (error: any) {
      toast.error('Failed to fetch meetings: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [user]); // Re-fetch when user changes, date change is handled by filtering

  const getMeetingTypeIcon = (type: Meeting['type']) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="w-5 h-5" />;
      case 'phone':
        return <PhoneIcon className="w-5 h-5" />;
      case 'in-person':
        return <MapPinIcon className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled':
      case 'rescheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  const getStatusIcon = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled':
      case 'rescheduled':
        return <ClockIcon className="w-5 h-5" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
    }
  };

  const handleJoinMeeting = (meeting: MeetingDetails) => {
    if (meeting.type === 'video' && meeting.meeting_link) {
      window.open(meeting.meeting_link, '_blank');
    } else if (meeting.type === 'phone' && meeting.staff_id) {
      // In a real app you might have a different way to get staff phone number
      toast('Please check your email for the dial-in number.', { icon: '📞' });
    } else if (meeting.type === 'in-person') {
      toast.success(`Meeting is at: ${meeting.location || 'the branch office'}`);
    }
  };

  const filteredMeetings = meetings.filter(
    (meeting) => meeting.scheduled_at.startsWith(selectedDate)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meeting Schedule</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">View and manage your upcoming meetings.</p>
        </div>
         <button onClick={fetchMeetings} disabled={isLoading} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowPathIcon className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading meetings...</div>
          ) : filteredMeetings.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No meetings scheduled for this date.</div>
          ) : (
            filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <img src={meeting.staff_avatar || `https://ui-avatars.com/api/?name=${meeting.staff_name.replace(' ', '+')}`} alt={meeting.staff_name} className="w-10 h-10 rounded-full"/>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{meeting.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">with {meeting.staff_name} ({meeting.staff_role})</p>
                        </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {meeting.agenda}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <ClockIcon className="w-4 h-4 mr-1.5" />
                        {new Date(meeting.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        {getMeetingTypeIcon(meeting.type)}
                        <span className="ml-1.5 capitalize">{meeting.type}</span>
                      </div>
                      {meeting.location && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4 mr-1.5" />
                          {meeting.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        meeting.status
                      )}`}
                    >
                      <span className="capitalize">{meeting.status}</span>
                    </span>
                    {meeting.status === 'scheduled' && (
                      <button
                        onClick={() => handleJoinMeeting(meeting)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {meeting.type === 'video' ? 'Join Now' : 'View Details'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MeetingSchedule; 