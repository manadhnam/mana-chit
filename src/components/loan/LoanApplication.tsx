import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDocumentStore } from '@/store/documentStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuditStore } from '@/store/auditStore';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, DocumentIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';


interface LoanApplicationForm {
  amount: number;
  purpose: string;
  tenure: number;
  monthlyIncome: number;
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS';
  employmentDetails: string;
  existingLoans: boolean;
  existingLoanDetails?: string;
  businessType?: string;
  businessRegNumber?: string;
  yearsInBusiness?: string;
  interestRate?: number;
}

interface LoanApplicationProps {
  userId: string;
  onApplicationComplete: () => void;
}

const LoanApplication = ({ userId, onApplicationComplete }: LoanApplicationProps) => {
  const { uploadDocument } = useDocumentStore();
  const { createNotification } = useNotificationStore();
  const { logAction } = useAuditStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingInput, setUploadingInput] = useState<null | 'generic' | string>(null);
  const [employmentType, setEmploymentType] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessRegNumber, setBusinessRegNumber] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [interestRate, setInterestRate] = useState(10);
  const [emi, setEmi] = useState<number | null>(null);
  const [businessRegError, setBusinessRegError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoanApplicationForm>();

  const watchedAmount = watch('amount');
  const watchedTenure = watch('tenure');

  // Shared file validation and upload simulation
  const validateAndSimulateUpload = async (file: File, inputType: 'generic' | string): Promise<boolean> => {
    setUploadError('');
    setIsUploading(false);
    setUploadingInput(inputType);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only PDF, JPG, and PNG files are allowed');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size should be less than 5MB');
      return false;
    }
    setIsUploading(true);
    await new Promise(res => setTimeout(res, 1500));
    setIsUploading(false);
    setUploadingInput(null);
    return true;
  };

  // File upload handler for generic upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = await validateAndSimulateUpload(file, 'generic');
    // No further action for generic upload
  };

  // File upload handler for required documents
  const handleDocumentUpload = async (type: string, file: File) => {
    const valid = await validateAndSimulateUpload(file, type);
    if (!valid) return;
    try {
      await uploadDocument(file, type as 'ID_PROOF' | 'ADDRESS_PROOF' | 'INCOME_PROOF' | 'BANK_STATEMENT' | 'OTHER');
      setUploadedDocuments(prev => ({ ...prev, [type]: file.name }));
      await logAction({
        userId,
        userRole: 'USER',
        action: 'UPLOAD_DOCUMENT',
        module: 'LOAN',
        details: { documentType: type, fileName: file.name },
        ipAddress: '',
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to upload document:', error);
      setError('Failed to upload document. Please try again.');
    }
  };

  const onSubmit = async (data: LoanApplicationForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Here you would typically call your API to submit the loan application
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      await createNotification({
        userId,
        type: 'IN_APP',
        title: 'Loan Application Submitted',
        message: 'Your loan application has been submitted successfully.',
      });

      await logAction({
        userId,
        userRole: 'USER',
        action: 'SUBMIT_LOAN_APPLICATION',
        module: 'LOAN',
        details: { ...data, documents: uploadedDocuments },
        ipAddress: '',
        userAgent: navigator.userAgent,
      });

      onApplicationComplete();
    } catch (error) {
      console.error('Failed to submit loan application:', error);
      setError('Failed to submit loan application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredDocuments = [
    { type: 'ID_PROOF', label: 'ID Proof (Aadhaar/PAN)' },
    { type: 'ADDRESS_PROOF', label: 'Address Proof' },
    { type: 'INCOME_PROOF', label: 'Income Proof' },
    { type: 'BANK_STATEMENT', label: 'Bank Statement (Last 3 months)' },
  ];

  // EMI calculation
  const calculateEmi = (amount: number, tenure: number, rate: number) => {
    const monthlyRate = rate / 12 / 100;
    if (!amount || !tenure || !rate) return null;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  useEffect(() => {
    if (watchedAmount && watchedTenure && interestRate) {
      setEmi(calculateEmi(Number(watchedAmount), Number(watchedTenure), Number(interestRate)));
    } else {
      setEmi(null);
    }
  }, [watchedAmount, watchedTenure, interestRate]);

  // Business registration number validation
  useEffect(() => {
    if ((employmentType === 'BUSINESS' || employmentType === 'SELF_EMPLOYED') && businessRegNumber) {
      // Example: must be alphanumeric and 8-12 chars
      const valid = /^[A-Za-z0-9]{8,12}$/.test(businessRegNumber);
      setBusinessRegError(valid ? '' : 'Invalid business registration number format');
    } else {
      setBusinessRegError('');
    }
  }, [businessRegNumber, employmentType]);

  return (
    <div className="space-y-6">
      {/* Loan Application Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Loan Application</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Loan Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                {...register('amount', { required: 'Loan amount is required', min: { value: 1000, message: 'Minimum loan amount is ₹1,000' } })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tenure (months)
              </label>
              <input
                type="number"
                id="tenure"
                {...register('tenure', { required: 'Tenure is required', min: { value: 3, message: 'Minimum tenure is 3 months' }, max: { value: 60, message: 'Maximum tenure is 60 months' } })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
              {errors.tenure && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tenure.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Loan Purpose
            </label>
            <textarea
              id="purpose"
              rows={3}
              {...register('purpose', { required: 'Loan purpose is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.purpose.message}</p>
            )}
          </div>

          {/* Employment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employment Type
              </label>
              <select
                id="employmentType"
                name="employmentType"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={employmentType}
                onChange={e => setEmploymentType(e.target.value)}
              >
                <option value="">Select employment type</option>
                <option value="SALARIED">Salaried</option>
                <option value="SELF_EMPLOYED">Self Employed</option>
                <option value="BUSINESS">Business</option>
              </select>
              {errors.employmentType && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employmentType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Monthly Income (₹)
              </label>
              <input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
              {errors.monthlyIncome && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.monthlyIncome.message}</p>
              )}
            </div>
          </div>

          {/* Conditionally render business/self-employed fields */}
          {(employmentType === 'BUSINESS' || employmentType === 'SELF_EMPLOYED') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Business Type
                </label>
                <input
                  id="businessType"
                  name="businessType"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="businessRegNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Business Registration Number
                </label>
                <input
                  id="businessRegNumber"
                  name="businessRegNumber"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  value={businessRegNumber}
                  onChange={e => setBusinessRegNumber(e.target.value)}
                />
                {businessRegError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {businessRegError}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Years in Business
                </label>
                <input
                  id="yearsInBusiness"
                  name="yearsInBusiness"
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  value={yearsInBusiness}
                  onChange={e => setYearsInBusiness(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Interest Rate input */}
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Interest Rate
            </label>
            <input
              id="interestRate"
              name="interestRate"
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="employmentDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employment Details
            </label>
            <textarea
              id="employmentDetails"
              rows={3}
              {...register('employmentDetails', { required: 'Employment details are required' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.employmentDetails && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employmentDetails.message}</p>
            )}
          </div>

          {/* Existing Loans */}
          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="existingLoans"
                {...register('existingLoans')}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="existingLoans" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Do you have any existing loans?
              </label>
            </div>
            {watch('existingLoans') && (
              <div className="mt-4">
                <label htmlFor="existingLoanDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Existing Loan Details
                </label>
                <textarea
                  id="existingLoanDetails"
                  rows={3}
                  {...register('existingLoanDetails', { required: watch('existingLoans') ? 'Existing loan details are required' : false })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
                {errors.existingLoanDetails && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.existingLoanDetails.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Required Documents</h4>
            <div className="space-y-4">
              {requiredDocuments.map((doc) => (
                <div key={doc.type} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <DocumentIcon className="h-5 w-5 text-gray-400" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{doc.label}</span>
                  </div>
                  <div className="flex items-center">
                    {uploadedDocuments[doc.type] ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <label className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                        <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                        Upload
                        <input
                          type="file"
                          className="hidden"
                          data-testid={`upload-input-${doc.type}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleDocumentUpload(doc.type, file);
                            }
                          }}
                        />
                      </label>
                    )}
                    {uploadError && uploadingInput === doc.type && (
                      <span className="mt-1 text-sm" style={{ color: '#dc2626' }}>{uploadError}</span>
                    )}
                    {isUploading && uploadingInput === doc.type && (
                      <span className="mt-1 text-sm">Uploading...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document upload */}
          <div>
            <label htmlFor="documentUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Document
            </label>
            <input
              id="documentUpload"
              name="documentUpload"
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              onChange={handleFileChange}
            />
            {uploadError && uploadingInput === 'generic' && (
              <span className="mt-1 text-sm" style={{ color: '#dc2626' }}>{uploadError}</span>
            )}
            {error && uploadingInput === 'generic' && (
              <span className="mt-1 text-sm" style={{ color: '#dc2626' }}>{error}</span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* EMI Calculation display */}
          {emi !== null && (
            <div className="mt-4 text-primary-700 dark:text-primary-300 font-semibold">
              Estimated monthly payment: ₹{emi.toLocaleString('en-IN')}
            </div>
          )}

          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplication; 