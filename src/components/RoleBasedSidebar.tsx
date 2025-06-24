import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  UserGroupIcon,
  UserIcon,
  BellIcon,
  HomeIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  QrCodeIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  WalletIcon,
  ClipboardDocumentIcon,
  MicrophoneIcon
} from '@heroicons/react/24/solid';

const sidebarConfig = {
  superAdmin: [
    { name: 'Dashboard', href: '/super-admin/dashboard', icon: HomeIcon },
    { name: 'User Management', href: '/super-admin/user-management', icon: UserGroupIcon },
    { name: 'Role Management', href: '/super-admin/role-management', icon: Cog6ToothIcon },
    { name: 'Enhanced Branch Mgt.', href: '/super-admin/enhanced-branch-management', icon: BuildingOfficeIcon },
    { name: 'Customer Management', href: '/super-admin/customers', icon: UserIcon },
    { name: 'Staff Directory', href: '/super-admin/staff', icon: UserGroupIcon },
    { name: 'Chit Groups', href: '/super-admin/groups', icon: BanknotesIcon },
    { name: 'Collections', href: '/super-admin/collections', icon: ClipboardDocumentListIcon },
    { name: 'File Management', href: '/super-admin/file-management', icon: DocumentTextIcon },
    { name: 'System Settings', href: '/super-admin/system-settings', icon: Cog6ToothIcon },
    { name: 'QR Management', href: '/super-admin/qr-management', icon: QrCodeIcon },
    { name: 'Risk Reports', href: '/super-admin/risk-reports', icon: ExclamationTriangleIcon },
    { name: 'AI Risk Analytics', href: '/super-admin/ai-risk-analytics', icon: ChartBarIcon },
    { name: 'Freeze Accounts', href: '/super-admin/freeze-accounts', icon: ShieldCheckIcon },
    { name: 'System Notifications', href: '/super-admin/system-notifications', icon: BellIcon },
    { name: 'Performance Metrics', href: '/super-admin/performance-metrics', icon: ChartBarIcon },
    { name: 'User Analytics', href: '/super-admin/user-analytics', icon: ChartBarIcon },
    { name: 'Financial Reports', href: '/super-admin/financial-reports', icon: BanknotesIcon },
    { name: 'Audit Logs', href: '/super-admin/audit-logs', icon: DocumentTextIcon },
    { name: 'Profile', href: '/super-admin/profile', icon: UserIcon },
    { name: 'Settings', href: '/super-admin/settings', icon: Cog6ToothIcon },
    { name: 'Help', href: '/super-admin/help', icon: DocumentTextIcon },
    { name: 'Feedback', href: '/super-admin/feedback', icon: ChatBubbleLeftRightIcon }
  ],
  departmentHead: [
    { name: 'Dashboard', href: '/department-head/dashboard', icon: HomeIcon },
    { name: 'Staff Management', href: '/department-head/staff', icon: UserGroupIcon },
    { name: 'Performance', href: '/department-head/performance', icon: ChartBarIcon },
    { name: 'Reports', href: '/department-head/reports', icon: DocumentTextIcon },
    { name: 'Customers', href: '/department-head/customers', icon: UserIcon },
    { name: 'Audit Logs', href: '/department-head/audit-logs', icon: DocumentTextIcon },
    { name: 'Risk Reports', href: '/department-head/risk-reports', icon: ExclamationTriangleIcon },
    { name: 'Profile', href: '/department-head/profile', icon: UserIcon },
    { name: 'Settings', href: '/department-head/settings', icon: Cog6ToothIcon },
    { name: 'Help', href: '/department-head/help', icon: DocumentTextIcon },
    { name: 'Feedback', href: '/department-head/feedback', icon: ChatBubbleLeftRightIcon }
  ],
  mandalHead: [
    { name: 'Dashboard', href: '/mandal-head/dashboard', icon: HomeIcon },
    { name: 'Staff Management', href: '/mandal-head/staff', icon: UserGroupIcon },
    { name: 'Performance', href: '/mandal-head/performance', icon: ChartBarIcon },
    { name: 'Reports', href: '/mandal-head/reports', icon: DocumentTextIcon },
    { name: 'Customers', href: '/mandal-head/customers', icon: UserIcon },
    { name: 'Audit Logs', href: '/mandal-head/audit-logs', icon: DocumentTextIcon },
    { name: 'Risk Reports', href: '/mandal-head/risk-reports', icon: ExclamationTriangleIcon },
    { name: 'Profile', href: '/mandal-head/profile', icon: UserIcon },
    { name: 'Settings', href: '/mandal-head/settings', icon: Cog6ToothIcon },
    { name: 'Help', href: '/mandal-head/help', icon: DocumentTextIcon },
    { name: 'Feedback', href: '/mandal-head/feedback', icon: ChatBubbleLeftRightIcon }
  ],
  branchManager: [
    { name: 'Dashboard', href: '/branch-manager/dashboard', icon: HomeIcon },
    { name: 'Staff Management', href: '/branch-manager/staff', icon: UserGroupIcon },
    { name: 'Agent Performance', href: '/branch-manager/agent-performance', icon: ChartBarIcon },
    { name: 'Collections', href: '/branch-manager/collections', icon: ClipboardDocumentListIcon },
    { name: 'Referrals', href: '/branch-manager/referral-management', icon: UserIcon },
    { name: 'Reports', href: '/branch-manager/reports', icon: DocumentTextIcon },
    { name: 'Customers', href: '/branch-manager/customers', icon: UserIcon },
    { name: 'Groups', href: '/branch-manager/groups', icon: UserGroupIcon },
    { name: 'Profile', href: '/branch-manager/profile', icon: UserIcon },
    { name: 'Settings', href: '/branch-manager/settings', icon: Cog6ToothIcon },
    { name: 'Help', href: '/branch-manager/help', icon: DocumentTextIcon },
    { name: 'Feedback', href: '/branch-manager/feedback', icon: ChatBubbleLeftRightIcon }
  ],
  agent: [
    { name: 'Dashboard', href: '/agent/dashboard', icon: HomeIcon },
    { name: 'Customers', href: '/agent/customers', icon: UserIcon },
    { name: 'Collections', href: '/agent/collections', icon: ClipboardDocumentListIcon },
    { name: 'Performance', href: '/agent/collection-reports', icon: ChartBarIcon },
    { name: 'Manual Payment', href: '/manual-payment', icon: BanknotesIcon },
    { name: 'Attendance Punch', href: '/attendance-punch', icon: CalendarIcon },
    { name: 'Receipt Download', href: '/receipt-download', icon: DocumentTextIcon },
    { name: 'Reminders', href: '/reminders', icon: BellIcon },
    { name: 'Speech-to-Entry', href: '/speech-entry', icon: MicrophoneIcon },
    { name: 'Profile', href: '/agent/profile', icon: UserIcon },
    { name: 'Settings', href: '/agent/settings', icon: Cog6ToothIcon },
    { name: 'Help', href: '/agent/help', icon: DocumentTextIcon },
    { name: 'Feedback', href: '/agent/feedback', icon: ChatBubbleLeftRightIcon }
  ],
  user: [
    { name: 'Dashboard', href: '/customer/dashboard', icon: HomeIcon },
    { name: 'Chit Groups', href: '/customer/chits', icon: UserGroupIcon },
    { name: 'Passbook', href: '/passbook', icon: ClipboardDocumentIcon },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon },
    { name: 'Loans', href: '/customer/loans', icon: BanknotesIcon },
    { name: 'Receipt Download', href: '/receipt-download', icon: DocumentTextIcon },
    { name: 'Reminders', href: '/reminders', icon: BellIcon },
    { name: 'Profile', href: '/customer/profile', icon: UserIcon },
    { name: 'Settings', href: '/customer/settings', icon: Cog6ToothIcon },
    { name: 'Help', href: '/customer/help', icon: DocumentTextIcon },
    { name: 'Feedback', href: '/customer/feedback', icon: ChatBubbleLeftRightIcon }
  ]
};

const RoleBasedSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const role = user?.role || 'user';
  const navItems = sidebarConfig[role] || sidebarConfig['user'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Mana Chit</h1>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname === item.href
                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${
                location.pathname === item.href
                  ? 'text-primary-500 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
              }`}
            />
            {item.name}
          </Link>
        ))}
      </nav>
      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <img
            className="h-8 w-8 rounded-full"
            src={user?.photo_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
            alt={user?.name}
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default RoleBasedSidebar; 