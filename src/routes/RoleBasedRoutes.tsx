import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useRoleStore } from '@/store/roleStore';
import Layout from '@/components/Layout';
import RoleGuard from '@/components/auth/RoleGuard';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import RoleLogin from '@/pages/auth/RoleLogin';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import VerifyOTP from '@/pages/auth/VerifyOTP';
import CustomerRegistration from '@/pages/auth/CustomerRegistration';
import AgentDemoLogin from '@/pages/auth/AgentDemoLogin';
import CustomerDemoLogin from '@/pages/auth/CustomerDemoLogin';

// Super Admin Pages
import SuperAdminDashboard from '@/pages/super-admin/Dashboard';
import SystemHealth from '@/pages/super-admin/SystemHealth';
import UserManagement from '@/pages/super-admin/UserManagement';
import RoleManagement from '@/pages/super-admin/RoleManagement';
import SystemSettings from '@/pages/super-admin/SystemSettings';
import Reports from '@/pages/super-admin/Reports';
import Profile from '@/pages/super-admin/Profile';
import Settings from '@/pages/super-admin/Settings';
import Help from '@/pages/super-admin/Help';
import Feedback from '@/pages/super-admin/Feedback';
import SystemNotifications from '@/pages/super-admin/SystemNotifications';
import PerformanceMetrics from '@/pages/super-admin/PerformanceMetrics';
import FinancialReports from '@/pages/super-admin/FinancialReports';
import UserAnalytics from '@/pages/super-admin/UserAnalytics';
import SuperAdminLocations from '@/pages/super-admin/Locations';
import BranchManagement from '@/pages/super-admin/BranchManagement';
import EnhancedBranchManagement from '@/pages/super-admin/EnhancedBranchManagement';
import FundsManagement from '@/pages/super-admin/FundsManagement';
import FinancialOversight from '@/pages/super-admin/FinancialOversight';
import SuperAdminBranchStaffManagement from '@/pages/super-admin/BranchStaffManagement';
import BranchCustomerManagement from '@/pages/super-admin/BranchCustomerManagement';
import BranchLoanManagement from '@/pages/super-admin/BranchLoanManagement';
import BranchCollectionManagement from '@/pages/super-admin/BranchCollectionManagement';
import SuperAdminAuditLogs from '@/pages/super-admin/AuditLogs';
import RiskReports from '@/pages/super-admin/RiskReports';
import QRManagement from '@/pages/super-admin/QRManagement';
import AIRiskAnalytics from '@/pages/super-admin/AIRiskAnalytics';
import FreezeAccounts from '@/pages/super-admin/FreezeAccounts';
import WhatsAppBot from '@/pages/super-admin/WhatsAppBot';
import SAGroups from '@/pages/super-admin/groups/GroupList';
import SAGroupDetail from '@/pages/super-admin/groups/GroupDetail';
import SANewGroup from '@/pages/super-admin/groups/NewGroup';
import SACustomers from '@/pages/super-admin/customers/CustomerList';
import SACustomerDetail from '@/pages/super-admin/customers/CustomerDetail';
import SANewCustomer from '@/pages/super-admin/customers/NewCustomer';
import SAStaffDirectory from '@/pages/super-admin/staff/StaffDirectory';
import SAStaffDetail from '@/pages/super-admin/staff/StaffDetail';
import SANewStaff from '@/pages/super-admin/staff/NewStaff';
import SACollectionList from '@/pages/super-admin/collections/CollectionList';
import SACollectionDetail from '@/pages/super-admin/collections/CollectionDetail';
import SANewCollection from '@/pages/super-admin/collections/NewCollection';
import UPIQRGeneration from '@/pages/super-admin/UPIQRGeneration';

// Department Head Pages
import DepartmentDashboard from '@/pages/department-head/Dashboard';
import DepartmentPerformanceMetrics from '@/pages/department-head/Performance';
import DepartmentBudgetManagement from '@/pages/department-head/BudgetManagement';
import DepartmentStaffManagement from '@/pages/department-head/StaffManagement';
import DepartmentReports from '@/pages/department-head/Reports';
import DepartmentProfile from '@/pages/department-head/Profile';
import DepartmentSettings from '@/pages/department-head/Settings';
import DepartmentHelp from '@/pages/department-head/Help';
import DepartmentFeedback from '@/pages/department-head/Feedback';
import DepartmentAddNewStaff from '@/pages/department-head/AddNewStaff';
import DepartmentStaffList from '@/pages/department-head/staff/List';
import DepartmentStaffAttendance from '@/pages/department-head/staff/Attendance';
import DepartmentFinancialReports from '@/pages/department-head/FinancialReports';
import DepartmentStaffAnalytics from '@/pages/department-head/StaffAnalytics';
import DepartmentCustomerList from '@/pages/department-head/CustomerList';
import DepartmentHeadAuditLogs from '@/pages/department-head/AuditLogs';
import DepartmentHeadRiskReports from '@/pages/department-head/RiskReports';

// Mandal Head Pages
import MandalHeadDashboard from '@/pages/mandal-head/Dashboard';
import MandalHeadPerformanceMetrics from '@/pages/mandal-head/PerformanceMetrics';
import MandalHeadBudgetManagement from '@/pages/mandal-head/BudgetManagement';
import MandalHeadReports from '@/pages/mandal-head/Reports';
import MandalHeadProfile from '@/pages/mandal-head/Profile';
import MandalHeadSettings from '@/pages/mandal-head/Settings';
import MandalHeadHelp from '@/pages/mandal-head/Help';
import MandalHeadFeedback from '@/pages/mandal-head/Feedback';
import MandalHeadStaffList from '@/pages/mandal-head/staff/List';
import MandalHeadStaffAnalytics from '@/pages/mandal-head/staff/Analytics';
import MandalHeadStaffAttendance from '@/pages/mandal-head/staff/Attendance';
import MandalHeadCustomerManagement from '@/pages/mandal-head/CustomerManagement';
import MandalHeadAuditLogs from '@/pages/mandal-head/AuditLogs';
import MandalHeadRiskReports from '@/pages/mandal-head/RiskReports';

// Branch Manager Pages
import BranchDashboard from '@/pages/branch-manager/Dashboard';
import BranchPerformanceMetrics from '@/pages/branch-manager/PerformanceMetrics';
import BranchBudgetManagement from '@/pages/branch-manager/BudgetManagement';
import BranchManagerStaffManagement from '@/pages/branch-manager/StaffManagement';
import BranchReports from '@/pages/branch-manager/Reports';
import BranchProfile from '@/pages/branch-manager/Profile';
import BranchSettings from '@/pages/branch-manager/Settings';
import BranchHelp from '@/pages/branch-manager/Help';
import BranchFeedback from '@/pages/branch-manager/Feedback';
import BranchManagerStaffAdd from '@/pages/branch-manager/staff/Add';
import BranchManagerSettings from '@/pages/branch-manager/Settings';
import StaffAttendance from '@/pages/branch-manager/staff/Attendance';
import ReferralManagement from '@/pages/branch-manager/referrals/ReferralManagement';
import BranchManagerCustomerList from '@/pages/branch-manager/customers/CustomerList';
import BranchManagerAuditLogs from '@/pages/branch-manager/AuditLogs';
import GroupList from '@/pages/branch-manager/groups/GroupList';
import GroupDetail from '@/pages/branch-manager/groups/GroupDetail';
import GroupMembers from '@/pages/branch-manager/groups/GroupMembers';
import GroupAuctions from '@/pages/branch-manager/groups/GroupAuctions';
import AuctionDetail from '@/pages/branch-manager/groups/AuctionDetail';
import CustomerDetail from '@/pages/branch-manager/customers/CustomerDetail';
import StaffDirectory from '@/pages/branch-manager/staff/StaffDirectory';
import StaffDetail from '@/pages/branch-manager/staff/StaffDetail';
import CollectionList from '@/pages/branch-manager/collections/CollectionList';
import CollectionDetail from '@/pages/branch-manager/collections/CollectionDetail';

// Branch Manager New Features
import NewLoan from '@/pages/branch-manager/loans/NewLoan';
import NewChitGroup from '@/pages/branch-manager/chit-groups/NewChitGroup';
import NewCustomer from '@/pages/branch-manager/customers/NewCustomer';
import CollectPayment from '@/pages/branch-manager/payments/CollectPayment';

// Agent Pages
import AgentDashboard from '@/pages/agent/Dashboard';
import TransactionHistory from '@/pages/agent/TransactionHistory';
import CollectionReports from '@/pages/agent/CollectionReports';
import ReferralLeaderboard from '@/pages/agent/ReferralLeaderboard';
import AgentProfile from '@/pages/agent/Profile';
import AgentSettings from '@/pages/agent/Settings';
import AgentHelp from '@/pages/agent/Help';
import AgentFeedback from '@/pages/agent/Feedback';
import AgentReceiptEntry from '@/pages/agent/ReceiptEntry';
import AgentAuditLogs from '@/pages/agent/AuditLogs';
import AgentCustomerList from '@/pages/agent/customers/CustomerList';
import AgentNewCustomer from '@/pages/agent/customers/NewCustomer';

// Customer Pages
import CustomerDashboard from '@/pages/customer/Dashboard';
import CustomerChitGroupList from '@/pages/customer/ChitGroupList';
import CustomerLoanList from '@/pages/customer/LoanList';
import CustomerApplyLoan from '@/pages/customer/ApplyLoan';
import MyTransactions from '@/pages/customer/MyTransactions';
import CustomerProfile from '@/pages/customer/Profile';
import CustomerSettings from '@/pages/customer/Settings';
import CustomerFeedback from '@/pages/customer/Feedback';
import CustomerMeetingSchedule from '@/pages/customer/MeetingSchedule';
import CustomerReferralDashboard from '@/pages/customer/ReferralDashboard';
import CustomerNotifications from '@/pages/customer/Notifications';
import CustomerSupport from '@/pages/customer/Support';
import CustomerContactAgent from '@/pages/customer/ContactAgent';
import CustomerFAQs from '@/pages/customer/FAQs';
import CustomerRaiseTicket from '@/pages/customer/RaiseTicket';
import CustomerAuditLog from '@/pages/customer/AuditLog';

// Common Pages
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import Home from '@/pages/Home';

const DebugRoute = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const forceLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/auth/login';
  };
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, background: '#222', color: '#fff', padding: 8, zIndex: 9999 }}>
      <div>DEBUG: Current path: <b>{location.pathname}</b></div>
      <div>isAuthenticated: <b>{String(isAuthenticated)}</b></div>
      <div>User: <b>{user ? JSON.stringify(user) : 'null'}</b></div>
      <button onClick={forceLogout} style={{marginTop: 8, padding: '4px 8px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer'}}>Force Logout</button>
    </div>
  );
};

const RoleBasedRoutes = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Helper function to get default route based on role
  const getDefaultRoute = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return '/super-admin/dashboard';
      case 'departmentHead':
        return '/department-head/dashboard';
      case 'mandalHead':
        return '/mandal-head/dashboard';
      case 'branchManager':
        return '/branch-manager/dashboard';
      case 'agent':
        return '/agent/dashboard';
      case 'user':
      case 'customer':
        return '/customer/dashboard';
      default:
        return '/unauthorized';
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Auth routes */}
      {!isAuthenticated ? (
        <>
          <Route path="/auth/login" element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(user?.role || '')} replace />
            ) : (
              <RoleLogin />
            )
          } />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/customer-register" element={<CustomerRegistration />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/auth/agent-demo" element={<AgentDemoLogin />} />
          <Route path="/auth/customer-demo" element={<CustomerDemoLogin />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </>
      ) : (
        <Route element={<Layout />}>
          {/* Super Admin Routes */}
          <Route
            path="/super-admin/*"
            element={
              <RoleGuard allowedRoles={['superAdmin']}>
                <Routes>
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                  <Route path="system-health" element={<SystemHealth />} />
                  <Route path="user-management" element={<UserManagement />} />
                  <Route path="role-management" element={<RoleManagement />} />
                  <Route path="system-settings" element={<SystemSettings />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="financial-reports" element={<FinancialReports />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="help" element={<Help />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="system-notifications" element={<SystemNotifications />} />
                  <Route path="performance-metrics" element={<PerformanceMetrics />} />
                  <Route path="user-analytics" element={<UserAnalytics />} />
                  <Route path="locations" element={<SuperAdminLocations />} />
                  <Route path="branches" element={<BranchManagement />} />
                  <Route path="enhanced-branches" element={<EnhancedBranchManagement />} />
                  <Route path="funds-management" element={<FundsManagement />} />
                  <Route path="financial-oversight" element={<FinancialOversight />} />
                  <Route path="branches/:branchId/staff" element={<SuperAdminBranchStaffManagement />} />
                  <Route path="branches/:branchId/customers" element={<BranchCustomerManagement />} />
                  <Route path="branches/:branchId/loans" element={<BranchLoanManagement />} />
                  <Route path="branches/:branchId/collections" element={<BranchCollectionManagement />} />
                  <Route path="audit-logs" element={<SuperAdminAuditLogs />} />
                  <Route path="risk-reports" element={<RiskReports />} />
                  <Route path="qr-management" element={<QRManagement />} />
                  <Route path="ai-risk-analytics" element={<AIRiskAnalytics />} />
                  <Route path="freeze-accounts" element={<FreezeAccounts />} />
                  <Route path="whatsapp-bot" element={<WhatsAppBot />} />
                  <Route path="groups" element={<SAGroups />} />
                  <Route path="groups/new" element={<SANewGroup />} />
                  <Route path="groups/:groupId" element={<SAGroupDetail />} />
                  <Route path="customers" element={<SACustomers />} />
                  <Route path="customers/new" element={<SANewCustomer />} />
                  <Route path="customers/:customerId" element={<SACustomerDetail />} />
                  <Route path="staff" element={<SAStaffDirectory />} />
                  <Route path="staff/new" element={<SANewStaff />} />
                  <Route path="staff/:id" element={<SAStaffDetail />} />
                  <Route path="collections" element={<SACollectionList />} />
                  <Route path="collections/new" element={<SANewCollection />} />
                  <Route path="collections/:id" element={<SACollectionDetail />} />
                  <Route path="qr-management" element={<QRManagement />} />
                  <Route path="upi-qr-generation" element={<UPIQRGeneration />} />
                  <Route path="logout" element={<Navigate to="/auth/login" replace />} />
                  <Route path="*" element={<Navigate to="/super-admin/dashboard" replace />} />
                </Routes>
              </RoleGuard>
            }
          />

          {/* Department Head Routes */}
          <Route
            path="/department-head/*"
            element={
              <RoleGuard allowedRoles={['departmentHead']}>
                <Routes>
                  <Route path="dashboard" element={<DepartmentDashboard />} />
                  <Route path="performance" element={<DepartmentPerformanceMetrics />} />
                  <Route path="budget" element={<DepartmentBudgetManagement />} />
                  <Route path="staff" element={<DepartmentStaffManagement />} />
                  <Route path="staff/list" element={<DepartmentStaffList />} />
                  <Route path="staff/attendance" element={<DepartmentStaffAttendance />} />
                  <Route path="staff/performance" element={<DepartmentStaffAnalytics />} />
                  <Route path="reports" element={<DepartmentReports />} />
                  <Route path="reports/financial-reports" element={<DepartmentFinancialReports />} />
                  <Route path="reports/staff-analytics" element={<DepartmentStaffAnalytics />} />
                  <Route path="profile" element={<DepartmentProfile />} />
                  <Route path="settings" element={<DepartmentSettings />} />
                  <Route path="help" element={<DepartmentHelp />} />
                  <Route path="feedback" element={<DepartmentFeedback />} />
                  <Route path="customers" element={<DepartmentCustomerList />} />
                  <Route path="audit-logs" element={<DepartmentHeadAuditLogs />} />
                  <Route path="risk-reports" element={<DepartmentHeadRiskReports />} />
                  <Route path="logout" element={<Navigate to="/auth/login" replace />} />
                  <Route path="*" element={<Navigate to="/department-head/dashboard" replace />} />
                </Routes>
              </RoleGuard>
            }
          />

          {/* Mandal Head Routes */}
          <Route
            path="/mandal-head/*"
            element={
              <RoleGuard allowedRoles={['mandalHead']}>
                <Routes>
                  <Route path="dashboard" element={<MandalHeadDashboard />} />
                  <Route path="performance" element={<MandalHeadPerformanceMetrics />} />
                  <Route path="budget" element={<MandalHeadBudgetManagement />} />
                  <Route path="staff" element={<MandalHeadStaffList />} />
                  <Route path="staff/list" element={<MandalHeadStaffList />} />
                  <Route path="staff/analytics" element={<MandalHeadStaffAnalytics />} />
                  <Route path="staff/attendance" element={<MandalHeadStaffAttendance />} />
                  <Route path="reports" element={<MandalHeadReports />} />
                  <Route path="profile" element={<MandalHeadProfile />} />
                  <Route path="settings" element={<MandalHeadSettings />} />
                  <Route path="help" element={<MandalHeadHelp />} />
                  <Route path="feedback" element={<MandalHeadFeedback />} />
                  <Route path="customers" element={<MandalHeadCustomerManagement />} />
                  <Route path="audit-logs" element={<MandalHeadAuditLogs />} />
                  <Route path="risk-reports" element={<MandalHeadRiskReports />} />
                  <Route path="logout" element={<Navigate to="/auth/login" replace />} />
                  <Route path="*" element={<Navigate to="/mandal-head/dashboard" replace />} />
                </Routes>
              </RoleGuard>
            }
          />

          {/* Branch Manager Routes */}
          <Route
            path="/branch-manager/*"
            element={
              <RoleGuard allowedRoles={['branchManager']}>
                <Routes>
                  <Route path="dashboard" element={<BranchDashboard />} />
                  <Route path="performance" element={<BranchPerformanceMetrics />} />
                  <Route path="budget" element={<BranchBudgetManagement />} />
                  <Route path="staff" element={<BranchManagerStaffManagement />} />
                  <Route path="staff/add" element={<BranchManagerStaffAdd />} />
                  <Route path="reports" element={<BranchReports />} />
                  <Route path="profile" element={<BranchProfile />} />
                  <Route path="settings" element={<BranchManagerSettings />} />
                  <Route path="help" element={<BranchHelp />} />
                  <Route path="feedback" element={<BranchFeedback />} />
                  <Route path="staff/attendance" element={<StaffAttendance />} />
                  <Route path="referral-management" element={<ReferralManagement />} />
                  <Route path="customers" element={<BranchManagerCustomerList />} />
                  <Route path="groups" element={<GroupList />} />
                  <Route path="groups/:groupId" element={<GroupDetail />} />
                  <Route path="groups/:groupId/members" element={<GroupMembers />} />
                  <Route path="groups/:groupId/auctions" element={<GroupAuctions />} />
                  <Route path="groups/:groupId/auctions/:auctionId" element={<AuctionDetail />} />
                  <Route path="customers/:customerId" element={<CustomerDetail />} />
                  <Route path="staff" element={<StaffDirectory />} />
                  <Route path="staff/:staffId" element={<StaffDetail />} />
                  <Route path="collections" element={<CollectionList />} />
                  <Route path="collections/:collectionId" element={<CollectionDetail />} />
                  
                  {/* New Branch Manager Features */}
                  <Route path="loans/new" element={<NewLoan />} />
                  <Route path="chit-groups/new" element={<NewChitGroup />} />
                  <Route path="customers/new" element={<NewCustomer />} />
                  <Route path="payments/collect" element={<CollectPayment />} />
                  
                  <Route path="audit-log" element={<BranchManagerAuditLogs />} />
                  <Route path="logout" element={<Navigate to="/auth/login" replace />} />
                  <Route path="*" element={<Navigate to="/branch-manager/dashboard" replace />} />
                </Routes>
              </RoleGuard>
            }
          />

          {/* Agent Routes */}
          <Route
            path="/agent/*"
            element={
              <RoleGuard allowedRoles={['agent']}>
                <Routes>
                  <Route path="dashboard" element={<AgentDashboard />} />
                  <Route path="transactions" element={<TransactionHistory />} />
                  <Route path="collections" element={<CollectionReports />} />
                  <Route path="receipts" element={<AgentReceiptEntry />} />
                  <Route path="customers" element={<AgentCustomerList />} />
                  <Route path="customers/new" element={<AgentNewCustomer />} />
                  <Route path="referrals" element={<ReferralLeaderboard />} />
                  <Route path="profile" element={<AgentProfile />} />
                  <Route path="settings" element={<AgentSettings />} />
                  <Route path="help" element={<AgentHelp />} />
                  <Route path="feedback" element={<AgentFeedback />} />
                  <Route path="audit-logs" element={<AgentAuditLogs />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Routes>
              </RoleGuard>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customer/*"
            element={
              <RoleGuard allowedRoles={['user', 'customer']}>
                <Routes>
                  <Route path="dashboard" element={<CustomerDashboard />} />
                  <Route path="chits" element={<CustomerChitGroupList />} />
                  <Route path="loans" element={<CustomerLoanList />} />
                  <Route path="loans/apply" element={<CustomerApplyLoan />} />
                  <Route path="transactions" element={<MyTransactions />} />
                  <Route path="profile" element={<CustomerProfile />} />
                  <Route path="settings" element={<CustomerSettings />} />
                  <Route path="feedback" element={<CustomerFeedback />} />
                  <Route path="meetings" element={<CustomerMeetingSchedule />} />
                  <Route path="referrals" element={<CustomerReferralDashboard />} />
                  <Route path="notifications" element={<CustomerNotifications />} />
                  <Route path="support" element={<CustomerSupport />} />
                  <Route path="contact-agent" element={<CustomerContactAgent />} />
                  <Route path="faqs" element={<CustomerFAQs />} />
                  <Route path="raise-ticket" element={<CustomerRaiseTicket />} />
                  <Route path="audit-log" element={<CustomerAuditLog />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Routes>
              </RoleGuard>
            }
          />

          {/* Default redirect based on user role */}
          <Route
            path="/"
            element={<Navigate to={user ? getDefaultRoute(user.role) : '/auth/login'} replace />}
          />
        </Route>
      )}
      <Route path="*" element={<DebugRoute />} />
    </Routes>
  );
};

export default RoleBasedRoutes; 