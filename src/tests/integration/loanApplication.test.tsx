import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoanApplication from '@/components/loan/LoanApplication';
import { useDocumentStore } from '@/store/documentStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuditStore } from '@/store/auditStore';
import { vi } from 'vitest';

// Mock the stores
vi.mock('@/store/documentStore', () => ({
  useDocumentStore: vi.fn(),
}));

vi.mock('@/store/notificationStore', () => ({
  useNotificationStore: vi.fn(),
}));

vi.mock('@/store/auditStore', () => ({
  useAuditStore: vi.fn(),
}));

const mockUploadDocument = vi.fn();
const mockSendNotification = vi.fn();
const mockLogAction = vi.fn();

describe('Loan Application Flow', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock implementations with proper typing
    const mockDocumentStore = {
      uploadDocument: mockUploadDocument,
    };
    (useDocumentStore as any).mockReturnValue(mockDocumentStore);

    const mockNotificationStore = {
      sendNotification: mockSendNotification,
    };
    (useNotificationStore as any).mockReturnValue(mockNotificationStore);

    const mockAuditStore = {
      logAction: mockLogAction,
    };
    (useAuditStore as any).mockReturnValue(mockAuditStore);
  });

  const renderComponent = () => {
    const store = configureStore({
      reducer: {
        // Add your reducers here if needed
      },
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <LoanApplication
            userId="test-user-id"
            onApplicationComplete={vi.fn()}
          />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders the loan application form', () => {
    renderComponent();

    // Check for form fields
    expect(screen.getByLabelText(/loan amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tenure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/loan purpose/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/employment type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly income/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderComponent();

    // Try to submit without filling required fields
    fireEvent.click(screen.getByText(/submit application/i));

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/loan amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/tenure is required/i)).toBeInTheDocument();
      expect(screen.getByText(/loan purpose is required/i)).toBeInTheDocument();
    });
  });

  it('handles document upload', async () => {
    renderComponent();

    // Mock file upload
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const uploadInput = screen.getAllByLabelText(/upload/i)[0];

    fireEvent.change(uploadInput, { target: { files: [file] } });

    // Check if upload was called
    await waitFor(() => {
      expect(mockUploadDocument).toHaveBeenCalledWith(file, 'ID_PROOF');
    });
  });

  it('submits the loan application successfully', async () => {
    renderComponent();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/loan amount/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText(/tenure/i), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText(/loan purpose/i), { target: { value: 'Home renovation' } });
    fireEvent.change(screen.getByLabelText(/employment type/i), { target: { value: 'SALARIED' } });
    fireEvent.change(screen.getByLabelText(/monthly income/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText(/employment details/i), { target: { value: 'Software Engineer at XYZ Corp' } });

    // Submit the form
    fireEvent.click(screen.getByText(/submit application/i));

    // Check if notification was sent
    await waitFor(() => {
      expect(mockSendNotification).toHaveBeenCalledWith({
        userId: 'test-user-id',
        type: 'in_app',
        title: 'Loan Application Submitted',
        message: 'Your loan application has been submitted successfully.',
      });
    });

    // Check if action was logged
    expect(mockLogAction).toHaveBeenCalledWith({
      userId: 'test-user-id',
      userRole: 'USER',
      action: 'SUBMIT_LOAN_APPLICATION',
      module: 'LOAN',
      details: expect.any(Object),
      ipAddress: '',
      userAgent: navigator.userAgent,
    });
  });

  it('handles existing loans section', () => {
    renderComponent();

    // Check existing loans checkbox
    const existingLoansCheckbox = screen.getByLabelText(/do you have any existing loans/i);
    fireEvent.click(existingLoansCheckbox);

    // Check if details field appears
    expect(screen.getByLabelText(/existing loan details/i)).toBeInTheDocument();
  });

  it('validates minimum loan amount', async () => {
    renderComponent();

    // Enter amount less than minimum
    fireEvent.change(screen.getByLabelText(/loan amount/i), { target: { value: '500' } });

    // Submit form
    fireEvent.click(screen.getByText(/submit application/i));

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText(/minimum loan amount is ₹1,000/i)).toBeInTheDocument();
    });
  });

  it('validates tenure limits', async () => {
    renderComponent();

    // Enter tenure less than minimum
    fireEvent.change(screen.getByLabelText(/tenure/i), { target: { value: '2' } });

    // Submit form
    fireEvent.click(screen.getByText(/submit application/i));

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText(/minimum tenure is 3 months/i)).toBeInTheDocument();
    });

    // Enter tenure more than maximum
    fireEvent.change(screen.getByLabelText(/tenure/i), { target: { value: '61' } });

    // Submit form
    fireEvent.click(screen.getByText(/submit application/i));

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText(/maximum tenure is 60 months/i)).toBeInTheDocument();
    });
  });

  // New test cases for document upload
  describe('Document Upload', () => {
    it('validates document file types', async () => {
      renderComponent();

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const uploadInput = screen.getAllByLabelText(/upload/i)[0];

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/only pdf, jpg, and png files are allowed/i)).toBeInTheDocument();
      });
    });

    it('validates document file size', async () => {
      renderComponent();

      // Create a large file (6MB)
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
      const uploadInput = screen.getAllByLabelText(/upload/i)[0];

      fireEvent.change(uploadInput, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/file size should be less than 5MB/i)).toBeInTheDocument();
      });
    });

    it('shows upload progress indicator', async () => {
      renderComponent();

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const uploadInput = screen.getAllByLabelText(/upload/i)[0];

      fireEvent.change(uploadInput, { target: { files: [file] } });

      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });
  });

  // New test cases for employment details
  describe('Employment Details', () => {
    it('shows additional fields for self-employed users', () => {
      renderComponent();

      fireEvent.change(screen.getByLabelText(/employment type/i), { target: { value: 'SELF_EMPLOYED' } });

      expect(screen.getByLabelText(/business type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business registration number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/years in business/i)).toBeInTheDocument();
    });

    it('validates business registration number format', async () => {
      renderComponent();

      fireEvent.change(screen.getByLabelText(/employment type/i), { target: { value: 'SELF_EMPLOYED' } });
      fireEvent.change(screen.getByLabelText(/business registration number/i), { target: { value: 'invalid' } });

      fireEvent.click(screen.getByText(/submit application/i));

      await waitFor(() => {
        expect(screen.getByText(/invalid business registration number format/i)).toBeInTheDocument();
      });
    });
  });

  // New test cases for loan calculations
  describe('Loan Calculations', () => {
    it('calculates EMI correctly', async () => {
      renderComponent();

      fireEvent.change(screen.getByLabelText(/loan amount/i), { target: { value: '100000' } });
      fireEvent.change(screen.getByLabelText(/tenure/i), { target: { value: '12' } });

      await waitFor(() => {
        expect(screen.getByText(/estimated monthly payment: ₹8,792/i)).toBeInTheDocument();
      });
    });

    it('updates EMI when interest rate changes', async () => {
      renderComponent();

      fireEvent.change(screen.getByLabelText(/loan amount/i), { target: { value: '100000' } });
      fireEvent.change(screen.getByLabelText(/tenure/i), { target: { value: '12' } });
      fireEvent.change(screen.getByLabelText(/interest rate/i), { target: { value: '15' } });

      await waitFor(() => {
        expect(screen.getByText(/estimated monthly payment: ₹9,025/i)).toBeInTheDocument();
      });
    });
  });

  // New test cases for error handling
  describe('Error Handling', () => {
    it('handles network errors during document upload', async () => {
      mockUploadDocument.mockRejectedValueOnce(new Error('Network error'));

      renderComponent();

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const uploadInput = screen.getAllByLabelText(/upload/i)[0];

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/failed to upload document/i)).toBeInTheDocument();
      });
    });

    it('handles validation errors gracefully', async () => {
      renderComponent();

      // Submit without filling required fields
      fireEvent.click(screen.getByText(/submit application/i));

      // Check if error messages are displayed
      await waitFor(() => {
        expect(screen.getByText(/loan amount is required/i)).toBeInTheDocument();
        expect(screen.getByText(/tenure is required/i)).toBeInTheDocument();
        expect(screen.getByText(/loan purpose is required/i)).toBeInTheDocument();
      });

      // Check if form is still interactive
      expect(screen.getByLabelText(/loan amount/i)).toBeEnabled();
      expect(screen.getByLabelText(/tenure/i)).toBeEnabled();
    });
  });

  // New test cases for form state persistence
  describe('Form State Persistence', () => {
    it('persists form data on page refresh', async () => {
      renderComponent();

      // Fill form data
      fireEvent.change(screen.getByLabelText(/loan amount/i), { target: { value: '50000' } });
      fireEvent.change(screen.getByLabelText(/tenure/i), { target: { value: '12' } });
      fireEvent.change(screen.getByLabelText(/loan purpose/i), { target: { value: 'Home renovation' } });

      // Simulate page refresh
      renderComponent();

      // Check if data is persisted
      expect(screen.getByLabelText(/loan amount/i)).toHaveValue(50000);
      expect(screen.getByLabelText(/tenure/i)).toHaveValue(12);
      expect(screen.getByLabelText(/loan purpose/i)).toHaveValue('Home renovation');
    });
  });
}); 