import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  mobile: string;
  email: string;
}

interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes: string;
}

const StaffAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      const mockStaff: StaffMember[] = [
        { id: '1', name: 'Rajesh Kumar', role: 'Agent', mobile: '9876543210', email: 'rajesh@example.com' },
        { id: '2', name: 'Priya Sharma', role: 'Agent', mobile: '9876543211', email: 'priya@example.com' },
        { id: '3', name: 'Amit Patel', role: 'Accountant', mobile: '9876543212', email: 'amit@example.com' },
        { id: '4', name: 'Sneha Reddy', role: 'Agent', mobile: '9876543213', email: 'sneha@example.com' },
        { id: '5', name: 'Vikram Singh', role: 'Manager', mobile: '9876543214', email: 'vikram@example.com' },
      ];

      const mockAttendance: AttendanceRecord[] = [
        { id: '1', staffId: '1', date: selectedDate, checkIn: '09:00', checkOut: '18:00', status: 'present', notes: '' },
        { id: '2', staffId: '2', date: selectedDate, checkIn: '09:15', checkOut: '18:00', status: 'late', notes: 'Traffic delay' },
        { id: '3', staffId: '3', date: selectedDate, checkIn: '08:45', checkOut: '17:30', status: 'present', notes: '' },
        { id: '4', staffId: '4', date: selectedDate, checkIn: '', checkOut: '', status: 'absent', notes: 'Sick leave' },
        { id: '5', staffId: '5', date: selectedDate, checkIn: '09:00', checkOut: '14:00', status: 'half-day', notes: 'Personal work' },
      ];

      setTimeout(() => {
        setStaffMembers(mockStaff);
        setAttendanceRecords(mockAttendance);
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, [selectedDate]);

  const handleAttendanceChange = (staffId: string, field: keyof AttendanceRecord, value: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.staffId === staffId 
          ? { ...record, [field]: value }
          : record
      )
    );
  };

  const handleSaveAttendance = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Attendance saved successfully');
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      case 'half-day': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const attendanceStats = {
    total: staffMembers.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    halfDay: attendanceRecords.filter(r => r.status === 'half-day').length,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Attendance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track staff attendance</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(selectedDate).toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mr-3">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceStats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 mr-3">
              <CheckIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Present</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceStats.present}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mr-3">
              <XMarkIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceStats.absent}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 mr-3">
              <ExclamationTriangleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Late</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceStats.late}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 mr-3">
              <ClockIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Half Day</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceStats.halfDay}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Records</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {staffMembers.map((staff) => {
                const attendance = attendanceRecords.find(r => r.staffId === staff.id);
                return (
                  <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {staff.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {staff.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="time"
                        value={attendance?.checkIn || ''}
                        onChange={(e) => handleAttendanceChange(staff.id, 'checkIn', e.target.value)}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="time"
                        value={attendance?.checkOut || ''}
                        onChange={(e) => handleAttendanceChange(staff.id, 'checkOut', e.target.value)}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={attendance?.status || 'present'}
                        onChange={(e) => handleAttendanceChange(staff.id, 'status', e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance?.status || 'present')}`}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="half-day">Half Day</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={attendance?.notes || ''}
                        onChange={(e) => handleAttendanceChange(staff.id, 'notes', e.target.value)}
                        placeholder="Add notes..."
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm w-full dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffAttendance; 