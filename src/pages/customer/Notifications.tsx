import React, { useEffect, useState } from 'react';
import { getNotifications, sendNotification, Notification } from '@/api/notifications';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ message: '', channel: 'Email' });

  useEffect(() => {
    setLoading(true);
    getNotifications()
      .then(res => setNotifications(res.data))
      .catch(() => setError('Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async () => {
    try {
      const res = await sendNotification(form);
      setNotifications([res.data, ...notifications]);
      setForm({ message: '', channel: 'Email' });
    } catch {
      setError('Failed to send notification');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading notifications...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="mb-6 bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Send Notification</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Notification Message"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
        <select
          className="w-full mb-2 p-2 border rounded"
          value={form.channel}
          onChange={e => setForm({ ...form, channel: e.target.value })}
        >
          <option value="Email">Email</option>
          <option value="Push">Push</option>
          <option value="SMS">SMS</option>
        </select>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSend}>Send Notification</button>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notifications.map((n) => (
              <tr key={n.id}>
                <td className="px-6 py-4 whitespace-nowrap">{n.message}</td>
                <td className="px-6 py-4 whitespace-nowrap">{n.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{n.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{n.channel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notifications; 