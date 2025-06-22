

const mockFiles = [
  { id: 1, name: 'KYC_Agent1.pdf', type: 'KYC', uploadedBy: 'Agent 1', date: '2024-06-01' },
  { id: 2, name: 'Receipt_456.pdf', type: 'Receipt', uploadedBy: 'Agent 2', date: '2024-06-02' },
];

const FileManagement = () => {
  const handleDownload = (name: string) => {
    alert(`Downloading ${name}`);
  };
  const handleDelete = (id: number) => {
    alert(`Deleting file with id ${id}`);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">File Management</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockFiles.map((file) => (
              <tr key={file.id}>
                <td className="px-6 py-4 whitespace-nowrap">{file.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{file.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{file.uploadedBy}</td>
                <td className="px-6 py-4 whitespace-nowrap">{file.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded mr-2" onClick={() => handleDownload(file.name)}>Download</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(file.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileManagement; 