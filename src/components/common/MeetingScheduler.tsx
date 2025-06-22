import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];
  agenda: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface MeetingSchedulerProps {
  onSchedule: (meeting: Omit<Meeting, 'id' | 'status'>) => void;
  onCancel: (meetingId: string) => void;
  onComplete: (meetingId: string) => void;
  meetings: Meeting[];
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  onSchedule,
  onCancel,
  onComplete,
  meetings,
}) => {
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: [] as string[],
    agenda: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(newMeeting);
    setNewMeeting({
      title: '',
      date: '',
      time: '',
      location: '',
      attendees: [],
      agenda: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Schedule New Meeting Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Schedule New Meeting</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newMeeting.date}
              onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={newMeeting.time}
              onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={newMeeting.location}
              onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Agenda</label>
          <textarea
            value={newMeeting.agenda}
            onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Schedule Meeting
        </button>
      </form>

      {/* Meetings List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">{meeting.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  meeting.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : meeting.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {meeting.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{meeting.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{meeting.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{meeting.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{meeting.attendees.length} attendees</span>
              </div>
            </div>

            <p className="text-sm text-gray-600">{meeting.agenda}</p>

            <div className="flex space-x-2">
              {meeting.status === 'scheduled' && (
                <>
                  <button
                    onClick={() => onComplete(meeting.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() => onCancel(meeting.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingScheduler; 