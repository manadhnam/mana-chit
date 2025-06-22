import React, { useState } from 'react';

const mockGroups = [
  { id: 1, name: 'Chit Group A', joined: true },
  { id: 2, name: 'Chit Group B', joined: false },
  { id: 3, name: 'Chit Group C', joined: false },
];

const ChitAssignment = () => {
  const [groups, setGroups] = useState(mockGroups);

  const handleJoin = (id: number) => {
    setGroups(groups.map(g => g.id === id ? { ...g, joined: true } : g));
  };
  const handleLeave = (id: number) => {
    setGroups(groups.map(g => g.id === id ? { ...g, joined: false } : g));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Chit Group Assignments</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chit Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((g) => (
              <tr key={g.id}>
                <td className="px-6 py-4 whitespace-nowrap">{g.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{g.joined ? 'Joined' : 'Not Joined'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {g.joined ? (
                    <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleLeave(g.id)}>
                      Leave
                    </button>
                  ) : (
                    <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => handleJoin(g.id)}>
                      Join
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChitAssignment; 