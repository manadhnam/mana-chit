import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import notificationService from '@/services/notificationService';
import toast from 'react-hot-toast';

const mockNotifications = [
  { id: '1', type: 'Info', message: 'Welcome to Mana Chit!', date: '2024-06-01', read: false },
  { id: '2', type: 'Alert', message: 'Your KYC is pending.', date: '2024-06-02', read: true },
  { id: '3', type: 'Reminder', message: 'Next chit payment due soon.', date: '2024-06-03', read: false },
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState({ email: true, sms: false, whatsapp: true });
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const data = await notificationService.getUserNotifications(user.id);
        setNotifications(data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch notifications.');
      }
    };
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markNotificationAsRead(id);
      setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    } catch (err: any) {
      toast.error(err.message || 'Failed to mark as read.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400">Notification Center</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Notifications</h2>
        <ul className="divide-y">
          {notifications.map(n => (
            <li key={n.id} className={`py-3 flex items-center justify-between ${n.read ? 'opacity-60' : ''}`}>
              <div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold mr-2 ${n.type === 'Alert' ? 'bg-red-200 text-red-800' : n.type === 'Reminder' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>{n.type}</span>
                <span>{n.message}</span>
                <span className="ml-4 text-xs text-gray-500">{n.date}</span>
              </div>
              {!n.read && (
                <button className="text-primary-600 hover:underline" onClick={() => markAsRead(n.id)}>
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Notification Settings</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.checked }))} />
            Email
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.sms} onChange={e => setSettings(s => ({ ...s, sms: e.target.checked }))} />
            SMS
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.whatsapp} onChange={e => setSettings(s => ({ ...s, whatsapp: e.target.checked }))} />
            WhatsApp
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 