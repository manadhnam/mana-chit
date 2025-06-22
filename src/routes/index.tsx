import { createBrowserRouter } from 'react-router-dom';
import RoleBasedLayout from '../layouts/RoleBasedLayout';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Public Pages
import LandingPage from '../pages/LandingPage';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

// Super Admin Pages
import SuperAdminDashboard from '../pages/super-admin/Dashboard';
import UserManagement from '../pages/super-admin/UserManagement';
import SystemSettings from '../pages/super-admin/SystemSettings';
import RiskReports from '../pages/super-admin/RiskReports';
import QRManagement from '../pages/super-admin/QRManagement';
import AIRiskAnalytics from '../pages/super-admin/AIRiskAnalytics';
import FreezeAccounts from '../pages/super-admin/FreezeAccounts';
import WhatsAppBot from '../pages/super-admin/WhatsAppBot';

// Mandal Head Pages
import MandalDashboard from '../pages/mandal-head/Dashboard';

// Branch Manager Pages
import BranchDashboard from '../pages/branch-manager/Dashboard';
import BranchStaffManagement from '../pages/branch-manager/BranchStaffManagement';
import BranchReports from '../pages/branch-manager/BranchReports';

// Agent Pages
import AgentDashboard from '../pages/agent/Dashboard';
import CollectionReports from '../pages/agent/CollectionReports';
// import CustomerManagement from '../pages/agent/CustomerManagement';
import MeetingSchedule from '../pages/customer/MeetingSchedule';
import ReferralDashboard from '../pages/customer/ReferralDashboard';
import Settings from '../pages/customer/Settings';

// User Pages
import UserDashboard from '../pages/customer/Dashboard';
import ChitGroups from '../pages/customer/MyChitGroups';
import Passbook from '../pages/customer/Passbook';
// import CustomerSpeechEntry from '../pages/customer/SpeechEntry';
// import CustomerQRManagement from '../pages/customer/QRManagement';
// import CustomerRiskReports from '../pages/customer/RiskReports';
// import CustomerAIRiskAnalytics from '../pages/customer/AIRiskAnalytics';
// import CustomerFreezeAccounts from '../pages/customer/FreezeAccounts';
// import CustomerWhatsAppBot from '../pages/customer/WhatsAppBot';
import CustomerReminders from '../pages/customer/Reminders';
import CustomerReceiptDownload from '../pages/customer/ReceiptDownload';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout showSidebar={false} showHeader={false} />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'unauthorized', element: <Unauthorized /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/super-admin',
    element: <RoleBasedLayout allowedRoles={['super-admin']} />,
    children: [
      { path: 'dashboard', element: <SuperAdminDashboard /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'settings', element: <SystemSettings /> },
      { path: 'risk-reports', element: <RiskReports /> },
      { path: 'qr-management', element: <QRManagement /> },
      { path: 'ai-risk-analytics', element: <AIRiskAnalytics /> },
      { path: 'freeze-accounts', element: <FreezeAccounts /> },
      { path: 'whatsapp-bot', element: <WhatsAppBot /> },
    ],
  },
  {
    path: '/mandal-head',
    element: <RoleBasedLayout allowedRoles={['mandal-head']} />,
    children: [
      { path: 'dashboard', element: <MandalDashboard /> },
      { path: 'staff', element: <div>Mandal Staff Management</div> },
      { path: 'reports', element: <div>Mandal Reports</div> },
    ],
  },
  {
    path: '/branch-manager',
    element: <RoleBasedLayout allowedRoles={['branch-manager']} />,
    children: [
      { path: 'dashboard', element: <BranchDashboard /> },
      { path: 'staff', element: <BranchStaffManagement /> },
      { path: 'reports', element: <BranchReports /> },
    ],
  },
  {
    path: '/agent',
    element: <RoleBasedLayout allowedRoles={['agent']} />,
    children: [
      { path: 'dashboard', element: <AgentDashboard /> },
      { path: 'collections', element: <CollectionReports /> },
      { path: 'customers', element: <div>Customer Management</div> },
      { path: 'manual-payment', element: <div>Manual Payment</div> },
      { path: 'attendance-punch', element: <div>Attendance Punch</div> },
      { path: 'agent-performance', element: <div>Agent Performance</div> },
      { path: 'receipt-download', element: <div>Receipt Download</div> },
      { path: 'reminders', element: <div>Reminders</div> },
      { path: 'speech-entry', element: <div>Speech Entry</div> },
    ],
  },
  {
    path: '/customer',
    element: <RoleBasedLayout allowedRoles={['customer']} />,
    children: [
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'chit-groups', element: <ChitGroups /> },
      { path: 'passbook', element: <Passbook /> },
      { path: 'meetings', element: <MeetingSchedule /> },
      { path: 'referrals', element: <ReferralDashboard /> },
      { path: 'settings', element: <Settings /> },
      { path: 'receipt-download', element: <CustomerReceiptDownload /> },
      { path: 'reminders', element: <CustomerReminders /> },
      { path: 'speech-entry', element: <div>Speech Entry</div> },
      { path: 'qr-management', element: <div>QR Management</div> },
      { path: 'risk-reports', element: <div>Risk Reports</div> },
      { path: 'ai-risk-analytics', element: <div>AI Risk Analytics</div> },
      { path: 'freeze-accounts', element: <div>Freeze Accounts</div> },
      { path: 'whatsapp-bot', element: <div>WhatsApp Bot</div> },
    ],
  },
]);

export default router; 