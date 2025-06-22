import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { exportData } from '@/utils/exportUtils';

interface ExportButtonProps {
  data: any[];
  filename: string;
  title?: string;
  elementId?: string;
  className?: string;
  disabled?: boolean;
  showAllFormats?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  title = 'Report',
  elementId,
  className = '',
  disabled = false,
  showAllFormats = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'excel' | 'pdf' | 'json' | 'csv') => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    setLoading(true);
    try {
      const result = await exportData(data, filename, format, elementId);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const exportOptions = [
    {
      format: 'excel' as const,
      label: 'Excel',
      description: 'Export as Excel spreadsheet',
      color: 'text-green-600 hover:bg-green-50',
    },
    {
      format: 'pdf' as const,
      label: 'PDF',
      description: 'Export as PDF document',
      color: 'text-red-600 hover:bg-red-50',
    },
    {
      format: 'csv' as const,
      label: 'CSV',
      description: 'Export as CSV file',
      color: 'text-blue-600 hover:bg-blue-50',
    },
    {
      format: 'json' as const,
      label: 'JSON',
      description: 'Export as JSON data',
      color: 'text-purple-600 hover:bg-purple-50',
    },
  ];

  if (showAllFormats) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${className}`}
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          {loading ? 'Exporting...' : 'Export'}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-50">
            <div className="py-1">
              {exportOptions.map((option) => (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  disabled={loading}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 ${option.color} hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50`}
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Single format export (Excel by default)
  return (
    <button
      onClick={() => handleExport('excel')}
      disabled={disabled || loading}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${className}`}
    >
      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
      {loading ? 'Exporting...' : 'Export Excel'}
    </button>
  );
};

export default ExportButton; 