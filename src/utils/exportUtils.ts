import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// Excel Export Functions
export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length))
    }));
    ws['!cols'] = colWidths;
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}.xlsx`);
    
    return { success: true, message: 'Excel file exported successfully' };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, message: 'Failed to export Excel file' };
  }
};

// PDF Export Functions
export const exportToPDF = async (
  elementId: string, 
  filename: string, 
  title: string = 'Report',
  orientation: 'portrait' | 'landscape' = 'portrait'
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF(orientation, 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add title
    pdf.setFontSize(16);
    pdf.text(title, 105, 15, { align: 'center' });
    position = 25;

    // Add image
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
    return { success: true, message: 'PDF file exported successfully' };
  } catch (error) {
    console.error('PDF export error:', error);
    return { success: false, message: 'Failed to export PDF file' };
  }
};

// JSON Export Functions
export const exportToJSON = (data: any, filename: string) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${filename}.json`);
    
    return { success: true, message: 'JSON file exported successfully' };
  } catch (error) {
    console.error('JSON export error:', error);
    return { success: false, message: 'Failed to export JSON file' };
  }
};

// CSV Export Functions
export const exportToCSV = (data: any[], filename: string) => {
  try {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
    
    return { success: true, message: 'CSV file exported successfully' };
  } catch (error) {
    console.error('CSV export error:', error);
    return { success: false, message: 'Failed to export CSV file' };
  }
};

// Specific Export Functions for Different Data Types

// Financial Reports Export
export const exportFinancialReport = (data: any[], reportType: string) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportType}_Financial_Report_${timestamp}`;
  
  return {
    excel: () => exportToExcel(data, filename, reportType),
    pdf: (elementId: string) => exportToPDF(elementId, filename, `${reportType} Financial Report`),
    json: () => exportToJSON(data, filename),
    csv: () => exportToCSV(data, filename)
  };
};

// Staff Reports Export
export const exportStaffReport = (data: any[], reportType: string) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportType}_Staff_Report_${timestamp}`;
  
  return {
    excel: () => exportToExcel(data, filename, reportType),
    pdf: (elementId: string) => exportToPDF(elementId, filename, `${reportType} Staff Report`),
    json: () => exportToJSON(data, filename),
    csv: () => exportToCSV(data, filename)
  };
};

// Customer Reports Export
export const exportCustomerReport = (data: any[], reportType: string) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportType}_Customer_Report_${timestamp}`;
  
  return {
    excel: () => exportToExcel(data, filename, reportType),
    pdf: (elementId: string) => exportToPDF(elementId, filename, `${reportType} Customer Report`),
    json: () => exportToJSON(data, filename),
    csv: () => exportToCSV(data, filename)
  };
};

// Loan Reports Export
export const exportLoanReport = (data: any[], reportType: string) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportType}_Loan_Report_${timestamp}`;
  
  return {
    excel: () => exportToExcel(data, filename, reportType),
    pdf: (elementId: string) => exportToPDF(elementId, filename, `${reportType} Loan Report`),
    json: () => exportToJSON(data, filename),
    csv: () => exportToCSV(data, filename)
  };
};

// Collection Reports Export
export const exportCollectionReport = (data: any[], reportType: string) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportType}_Collection_Report_${timestamp}`;
  
  return {
    excel: () => exportToExcel(data, filename, reportType),
    pdf: (elementId: string) => exportToPDF(elementId, filename, `${reportType} Collection Report`),
    json: () => exportToJSON(data, filename),
    csv: () => exportToCSV(data, filename)
  };
};

// Generic Export Function
export const exportData = (data: any[], filename: string, format: 'excel' | 'pdf' | 'json' | 'csv', elementId?: string) => {
  switch (format) {
    case 'excel':
      return exportToExcel(data, filename);
    case 'pdf':
      if (!elementId) throw new Error('Element ID required for PDF export');
      return exportToPDF(elementId, filename);
    case 'json':
      return exportToJSON(data, filename);
    case 'csv':
      return exportToCSV(data, filename);
    default:
      throw new Error('Unsupported export format');
  }
}; 