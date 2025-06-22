import { lazy } from 'react';
import { RouteObject, useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuthStore } from '@/store/authStore';

const LoanApplication = lazy(() => import('@/components/loan/LoanApplication'));
const LoanApplicationStatus = lazy(() => import('@/components/loan/LoanApplicationStatus'));
const LoanApprovalWorkflow = lazy(() => import('@/components/loan/LoanApprovalWorkflow'));
const DocumentVerification = lazy(() => import('@/components/document/DocumentVerification'));
const RiskAssessmentDashboard = lazy(() => import('@/components/risk/RiskAssessmentDashboard'));
const LoanCalculator = lazy(() => import('@/components/loan/LoanCalculator'));
const LoanHistory = lazy(() => import('@/components/loan/LoanHistory'));
const LoanDocuments = lazy(() => import('@/components/loan/LoanDocuments'));

// Layout wrapper
const LayoutWrapper = () => {
  return <Layout />;
};

// Wrapper components to handle props
const LoanApplicationWrapper = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={['customer', 'super-admin', 'branch-manager']}>
      <LoanApplication
        userId={user.id}
        onApplicationComplete={() => navigate('/loans')}
      />
    </RoleGuard>
  );
};

const LoanApplicationStatusWrapper = () => {
  const { loanId } = useParams();
  const { user } = useAuthStore();

  if (!user || !loanId) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={['customer', 'super-admin', 'branch-manager']}>
      <LoanApplicationStatus
        loanId={loanId}
        userId={user.id}
      />
    </RoleGuard>
  );
};

const LoanApprovalWorkflowWrapper = () => {
  const { loanId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user || !loanId) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={['super-admin', 'branch-manager']}>
      <LoanApprovalWorkflow
        loanId={loanId}
        userId={user.id}
        onApprovalComplete={() => navigate(`/loans/${loanId}/status`)}
      />
    </RoleGuard>
  );
};

const DocumentVerificationWrapper = () => {
  const { loanId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user || !loanId) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={['super-admin', 'branch-manager']}>
      <DocumentVerification
        userId={user.id}
        onVerificationComplete={() => navigate(`/loans/${loanId}/status`)}
      />
    </RoleGuard>
  );
};

const RiskAssessmentDashboardWrapper = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={['super-admin', 'branch-manager']}>
      <RiskAssessmentDashboard
        userId={user.id}
      />
    </RoleGuard>
  );
};

const LoanCalculatorWrapper = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={['customer', 'super-admin', 'branch-manager']}>
      <LoanCalculator />
    </RoleGuard>
  );
};

const LoanHistoryWrapper = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={['customer', 'super-admin', 'branch-manager']}>
      <LoanHistory userId={user.id} />
    </RoleGuard>
  );
};

const LoanDocumentsWrapper = () => {
  const { loanId } = useParams();
  const { user } = useAuthStore();

  if (!user || !loanId) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={['customer', 'super-admin', 'branch-manager']}>
      <LoanDocuments loanId={loanId} userId={user.id} />
    </RoleGuard>
  );
};

export const loanRoutes: RouteObject[] = [
  {
    path: '/loans',
    element: <LayoutWrapper />,
    children: [
      {
        path: 'apply',
        element: <LoanApplicationWrapper />,
      },
      {
        path: 'calculator',
        element: <LoanCalculatorWrapper />,
      },
      {
        path: 'history',
        element: <LoanHistoryWrapper />,
      },
      {
        path: ':loanId',
        children: [
          {
            path: 'status',
            element: <LoanApplicationStatusWrapper />,
          },
          {
            path: 'approval',
            element: <LoanApprovalWorkflowWrapper />,
          },
          {
            path: 'documents',
            element: <LoanDocumentsWrapper />,
          },
        ],
      },
      {
        path: 'verification',
        element: <DocumentVerificationWrapper />,
      },
      {
        path: 'risk-assessment',
        element: <RiskAssessmentDashboardWrapper />,
      },
    ],
  },
]; 