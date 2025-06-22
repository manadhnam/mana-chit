import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

interface ReceiptData {
  receiptId: string;
  timestamp: string;
  amount: number;
  userDetails: {
    name: string;
    id: string;
    phone: string;
  };
  collectorDetails: {
    name: string;
    id: string;
    signature: string;
  };
  chitGroupDetails: {
    name: string;
    id: string;
    installment: number;
  };
}

interface ReceiptPDFGeneratorProps {
  data: ReceiptData;
  onGenerate: (pdfBlob: Blob) => void;
}

const ReceiptPDFGenerator: React.FC<ReceiptPDFGeneratorProps> = ({
  data,
  onGenerate,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yOffset = margin;

    // Header
    doc.setFontSize(20);
    doc.text('SmartChit Payment Receipt', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 20;

    // Receipt ID and Timestamp
    doc.setFontSize(12);
    doc.text(`Receipt ID: ${data.receiptId}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Date: ${data.timestamp}`, margin, yOffset);
    yOffset += 20;

    // Amount
    doc.setFontSize(16);
    doc.text(`Amount: ₹${data.amount.toFixed(2)}`, pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 20;

    // User Details
    doc.setFontSize(12);
    doc.text('User Details:', margin, yOffset);
    yOffset += 10;
    doc.text(`Name: ${data.userDetails.name}`, margin, yOffset);
    yOffset += 10;
    doc.text(`ID: ${data.userDetails.id}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Phone: ${data.userDetails.phone}`, margin, yOffset);
    yOffset += 20;

    // Chit Group Details
    doc.text('Chit Group Details:', margin, yOffset);
    yOffset += 10;
    doc.text(`Name: ${data.chitGroupDetails.name}`, margin, yOffset);
    yOffset += 10;
    doc.text(`ID: ${data.chitGroupDetails.id}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Installment: ${data.chitGroupDetails.installment}`, margin, yOffset);
    yOffset += 20;

    // Collector Details
    doc.text('Collected By:', margin, yOffset);
    yOffset += 10;
    doc.text(`Name: ${data.collectorDetails.name}`, margin, yOffset);
    yOffset += 10;
    doc.text(`ID: ${data.collectorDetails.id}`, margin, yOffset);
    yOffset += 20;

    // QR Code
    const qrCodeData = JSON.stringify({
      receiptId: data.receiptId,
      timestamp: data.timestamp,
      amount: data.amount,
      userId: data.userDetails.id,
      collectorId: data.collectorDetails.id,
    });

    QRCode.toDataURL(qrCodeData, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }

      // Add QR Code to PDF
      doc.addImage(
        url,
        'PNG',
        pageWidth / 2 - 50,
        yOffset,
        100,
        100
      );

      // Generate PDF Blob
      const pdfBlob = doc.output('blob');
      onGenerate(pdfBlob);
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={generatePDF}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        Generate Receipt PDF
      </button>
    </div>
  );
};

export default ReceiptPDFGenerator; 