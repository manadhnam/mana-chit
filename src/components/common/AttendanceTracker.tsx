import React, { useState } from 'react';
import { User, Check, X } from 'lucide-react';

interface Attendee {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
  notes?: string;
}

interface AttendanceTrackerProps {
  meetingId: string;
  meetingTitle: string;
  attendees: Attendee[];
  onUpdateAttendance: (attendeeId: string, status: Attendee['status'], notes?: string) => void;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  meetingId,
  meetingTitle,
  attendees,
  onUpdateAttendance,
}) => {
  const [selectedAttendee, setSelectedAttendee] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleStatusUpdate = (attendeeId: string, status: Attendee['status']) => {
    onUpdateAttendance(attendeeId, status, notes);
    setSelectedAttendee(null);
    setNotes('');
  };

  const getStatusColor = (status: Attendee['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{meetingTitle}</h2>
        <p className="text-sm text-gray-600 mb-6">Meeting ID: {meetingId}</p>

        <div className="space-y-4">
          {attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{attendee.name}</h3>
                  <p className="text-sm text-gray-500">ID: {attendee.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    attendee.status
                  )}`}
                >
                  {attendee.status}
                </span>

                {attendee.checkInTime && (
                  <span className="text-sm text-gray-600">
                    Check-in: {attendee.checkInTime}
                  </span>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(attendee.id, 'present')}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                    title="Mark Present"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(attendee.id, 'absent')}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    title="Mark Absent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedAttendee && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Add Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Enter notes about attendance..."
            />
            <div className="mt-2 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedAttendee(null)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedAttendee) {
                    handleStatusUpdate(selectedAttendee, 'present');
                  }
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker; 