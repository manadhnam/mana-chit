import React, { useState } from 'react';
import { attendancePunchIn } from '@/services/chitFundApi';

interface AttendancePunchProps {
  agentId: string;
  onSubmit?: (data: any) => void;
}

export const AttendancePunch: React.FC<AttendancePunchProps> = ({ agentId, onSubmit }) => {
  const [selfie, setSelfie] = useState<File | null>(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfie(e.target.files[0]);
    }
  };

  const handleGetLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toString());
          setLng(pos.coords.longitude.toString());
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
      alert('Geolocation not supported');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!selfie || !lat || !lng) {
      setError('Selfie and GPS location are required.');
      setLoading(false);
      return;
    }
    const res = await attendancePunchIn({
      agentId,
      selfie,
      lat,
      lng,
      remarks,
    });
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setSelfie(null);
      setLat('');
      setLng('');
      setRemarks('');
      if (onSubmit) onSubmit(res);
    } else {
      setError(res.error || 'Failed to punch in attendance');
    }
  };

  return (
    <form className="bg-white rounded-lg shadow p-4 space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Attendance Punch-In</h2>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">Attendance punched in successfully!</div>}
      <div>
        <label className="block mb-1 font-medium">Selfie</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
      </div>
      <div className="flex items-center space-x-2">
        <button type="button" className="bg-blue-500 text-white px-2 py-1 rounded" onClick={handleGetLocation} disabled={loading}>
          {loading ? 'Getting Location...' : 'Get GPS Location'}
        </button>
        <span className="text-sm text-gray-600">{lat && lng ? `Lat: ${lat}, Lng: ${lng}` : ''}</span>
      </div>
      <div>
        <label className="block mb-1 font-medium">Remarks</label>
        <textarea
          className="border rounded px-2 py-1 w-full"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Submitting...' : 'Punch In'}
      </button>
    </form>
  );
}; 