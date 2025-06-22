import { 
  Bars3Icon, 
  XMarkIcon, 
  BanknotesIcon, 
  SunIcon, 
  MoonIcon, 
  TicketIcon, 
  ArrowRightOnRectangleIcon, 
  ClipboardDocumentListIcon, 
  Squares2X2Icon, 
  ChartBarIcon, 
  CalendarIcon, 
  ShieldCheckIcon,
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  UserIcon, 
  QuestionMarkCircleIcon,
  MapPinIcon,
  HeartIcon,
  UsersIcon,
  QrCodeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './notifications/NotificationDropdown';
import { toast } from 'react-hot-toast';
import { sessionManager } from '@/utils/sessionManager';

interface NavigationItem {
  name: string;
  path?: string;
  icon?: React.ComponentType<{ className?: string }>;
  subItems?: NavigationItem[];
  action?: () => void;
}

const Layout = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Session management
  useEffect(() => {
    // Initialize session if user is logged in
    if (user && !sessionInfo?.isActive) {
      sessionManager.startSession(user, `refresh_${Date.now()}`);
    }

    // Update session info every minute
    const updateSessionInfo = () => {
      const info = sessionManager.getSessionInfo();
      setSessionInfo(info);
      
      // Show warning if session is about to expire
      if (info.isWarningActive && !showSessionWarning) {
        setShowSessionWarning(true);
      }
    };

    updateSessionInfo();
    const interval = setInterval(updateSessionInfo, 60000);

    return () => clearInterval(interval);
  }, [user, sessionInfo?.isActive, showSessionWarning]);

  const handleLogout = async () => {
    try {
      sessionManager.logout();
      await logout();
      toast.success('Logged out successfully');
      navigate('/auth/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleExtendSession = () => {
    sessionManager.extendSession();
    setShowSessionWarning(false);
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getNavigationItems = (role: string): NavigationItem[] => {
    const baseItems = (items: NavigationItem[]): NavigationItem[] => [
      ...items,
      { 
        name: 'Logout', 
        icon: ArrowRightOnRectangleIcon,
        action: handleLogout
      }
    ];

    switch (role) {
      case 'admin':
        return baseItems([
          { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
          { name: 'Locations', path: '/admin/locations', icon: MapPinIcon }
        ]);
      case 'superAdmin':
        return baseItems([
          { name: 'Dashboard', path: '/super-admin/dashboard', icon: HomeIcon },
          { name: 'System Health', path: '/super-admin/system-health', icon: HeartIcon },
          { 
            name: 'User Management', 
            path: '/super-admin/user-management', 
            icon: UsersIcon,
            subItems: [
              { name: 'Users', path: '/super-admin/user-management/users', icon: UsersIcon },
              { name: 'Roles', path: '/super-admin/user-management/roles', icon: ShieldCheckIcon },
            ]
          },
          { 
            name: 'Branch Management', 
            path: '/super-admin/branches', 
            icon: BuildingOfficeIcon,
            subItems: [
              { name: 'Basic Management', path: '/super-admin/branches', icon: BuildingOfficeIcon },
              { name: 'Enhanced Management', path: '/super-admin/enhanced-branches', icon: BuildingOfficeIcon },
            ]
          },
          { 
            name: 'Financial Management', 
            path: '/super-admin/funds-management', 
            icon: BanknotesIcon,
            subItems: [
              { name: 'Funds Management', path: '/super-admin/funds-management', icon: BanknotesIcon },
              { name: 'Financial Oversight', path: '/super-admin/financial-oversight', icon: ChartBarIcon },
              { name: 'Financial Reports', path: '/super-admin/financial-reports', icon: DocumentTextIcon },
            ]
          },
          { name: 'UPI QR Generation', path: '/super-admin/upi-qr-generation', icon: QrCodeIcon },
          { name: 'System Notifications', path: '/super-admin/system-notifications', icon: BellIcon },
          { name: 'Performance Metrics', path: '/super-admin/performance-metrics', icon: ChartBarIcon },
          { name: 'User Analytics', path: '/super-admin/user-analytics', icon: UserGroupIcon },
          { name: 'Risk/Flag Reports', path: '/super-admin/risk-reports', icon: ShieldCheckIcon },
          { name: 'QR Management', path: '/super-admin/qr-management', icon: DocumentTextIcon },
          { name: 'AI/Risk Analytics', path: '/super-admin/ai-risk-analytics', icon: ChartBarIcon },
          { name: 'Freeze Accounts', path: '/super-admin/freeze-accounts', icon: Cog6ToothIcon },
          { name: 'WhatsApp Bot/Reminders', path: '/super-admin/whatsapp-bot', icon: BellIcon },
          { name: 'Settings', path: '/super-admin/settings', icon: Cog6ToothIcon },
          { name: 'Help', path: '/super-admin/help', icon: QuestionMarkCircleIcon },
          { name: 'Feedback', path: '/super-admin/feedback', icon: BellIcon },
          { name: 'Locations', path: '/super-admin/locations', icon: MapPinIcon }
        ]);
      case 'departmentHead':
        return baseItems([
          { name: 'Dashboard', path: '/department-head/dashboard', icon: HomeIcon },
          { name: 'Risk/Flag Reports', path: '/department-head/risk-reports', icon: ShieldCheckIcon },
          { name: 'Customers', path: '/department-head/customers', icon: UserGroupIcon },
          { 
            name: 'Staff Management',
            path: '/department-head/staff',
            icon: UserGroupIcon,
            subItems: [
              { name: 'Staff List', path: '/department-head/staff/list', icon: UserGroupIcon },
              { name: 'Performance', path: '/department-head/staff/performance', icon: ChartBarIcon },
              { name: 'Attendance', path: '/department-head/staff/attendance', icon: CalendarIcon },
            ]
          },
          { 
            name: 'Reports',
            path: '/department-head/reports',
            icon: DocumentTextIcon,
            subItems: [
              { name: 'Performance Metrics', path: '/department-head/performance', icon: ChartBarIcon },
              { name: 'Financial Reports', path: '/department-head/reports/financial-reports', icon: BanknotesIcon },
              { name: 'Staff Analytics', path: '/department-head/reports/staff-analytics', icon: ChartBarIcon },
            ]
          },
          { name: 'Settings', path: '/department-head/settings', icon: Cog6ToothIcon },
          { name: 'Help', path: '/department-head/help', icon: QuestionMarkCircleIcon },
          { name: 'Feedback', path: '/department-head/feedback', icon: BellIcon }
        ]);
      case 'mandalHead':
        return baseItems([
          { name: 'Dashboard', path: '/mandal-head/dashboard', icon: HomeIcon },
          { name: 'Risk/Flag Reports', path: '/mandal-head/risk-reports', icon: ShieldCheckIcon },
          { name: 'Customers', path: '/mandal-head/customers', icon: UserGroupIcon },
          { name: 'Performance', path: '/mandal-head/performance', icon: ChartBarIcon },
          { name: 'Budget', path: '/mandal-head/budget', icon: BanknotesIcon },
          { name: 'Staff', path: '/mandal-head/staff', icon: UserGroupIcon },
          { name: 'Reports', path: '/mandal-head/reports', icon: DocumentTextIcon },
          { name: 'Settings', path: '/mandal-head/settings', icon: Cog6ToothIcon },
          { name: 'Help', path: '/mandal-head/help', icon: QuestionMarkCircleIcon },
          { name: 'Feedback', path: '/mandal-head/feedback', icon: BellIcon }
        ]);
      case 'branchManager':
        return baseItems([
          { name: 'Dashboard', path: '/branch-manager/dashboard', icon: HomeIcon },
          { name: 'QR Management', path: '/branch-manager/qr-management', icon: DocumentTextIcon },
          { name: 'Customers', path: '/branch-manager/customers', icon: UserGroupIcon },
          { name: 'Performance', path: '/branch-manager/performance', icon: ChartBarIcon },
          { name: 'Budget', path: '/branch-manager/budget', icon: BanknotesIcon },
          { 
            name: 'Staff',
            path: '/branch-manager/staff',
            icon: UserGroupIcon,
            subItems: [
              { name: 'Staff List', path: '/branch-manager/staff', icon: UserGroupIcon },
              { name: 'Add Staff', path: '/branch-manager/staff/add', icon: UserGroupIcon },
            ]
          },
          { name: 'Reports', path: '/branch-manager/reports', icon: DocumentTextIcon },
          { name: 'Settings', path: '/branch-manager/settings', icon: Cog6ToothIcon },
          { name: 'Help', path: '/branch-manager/help', icon: QuestionMarkCircleIcon },
          { name: 'Feedback', path: '/branch-manager/feedback', icon: BellIcon }
        ]);
      case 'agent':
        return baseItems([
          { name: 'Dashboard', path: '/agent/dashboard', icon: HomeIcon },
          { name: 'Manual Payment', path: '/agent/manual-payment', icon: BanknotesIcon },
          { name: 'Attendance Punch', path: '/agent/attendance-punch', icon: CalendarIcon },
          { name: 'Agent Performance', path: '/agent/agent-performance', icon: ChartBarIcon },
          { name: 'Receipt Download', path: '/agent/receipt-download', icon: DocumentTextIcon },
          { name: 'Reminders', path: '/agent/reminders', icon: BellIcon },
          { name: 'Speech-to-Entry', path: '/agent/speech-entry', icon: TicketIcon },
          { name: 'Performance', path: '/agent/performance', icon: ChartBarIcon },
          { name: 'Collection', path: '/agent/collection', icon: BanknotesIcon },
          { name: 'Reports', path: '/agent/reports', icon: DocumentTextIcon },
          { name: 'Settings', path: '/agent/settings', icon: Cog6ToothIcon },
          { name: 'Help', path: '/agent/help', icon: QuestionMarkCircleIcon },
          { name: 'Feedback', path: '/agent/feedback', icon: BellIcon }
        ]);
      case 'user':
        return baseItems([
          { name: 'Dashboard', path: '/customer/dashboard', icon: HomeIcon },
          { name: 'My Chit Groups', path: '/customer/chit-groups', icon: UserGroupIcon },
          { name: 'My Loans', path: '/customer/loans', icon: BanknotesIcon },
          { name: 'Transactions', path: '/customer/transactions', icon: DocumentTextIcon },
          { name: 'Receipt Download', path: '/customer/receipt-download', icon: DocumentTextIcon },
          { name: 'Reminders', path: '/customer/reminders', icon: BellIcon },
          { name: 'Reports', path: '/customer/reports', icon: ChartBarIcon },
          { name: 'Settings', path: '/customer/settings', icon: Cog6ToothIcon },
          { name: 'Help', path: '/customer/help', icon: QuestionMarkCircleIcon },
          { name: 'Feedback', path: '/customer/feedback', icon: BellIcon }
        ]);
      default:
        return [];
    }
  };

  const navigation = user ? getNavigationItems(user.role) : [];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={{ width: isSidebarOpen ? 280 : 80 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white dark:bg-gray-800 shadow-lg"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {isSidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            {isSidebarOpen && (
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Mana Chit</h1>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {item.icon ? <item.icon className="w-5 h-5 mr-3" /> : null}
                    {isSidebarOpen && <span>{item.name}</span>}
                  </button>
                ) : (
                  <NavLink
                    to={item.path || '#'}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
                        isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`
                    }
                  >
                    {item.icon ? <item.icon className="w-5 h-5 mr-3" /> : null}
                    {isSidebarOpen && <span>{item.name}</span>}
                  </NavLink>
                )}
                {item.subItems && isSidebarOpen && (
                  <div className="ml-8 mt-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path || '#'}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
                            isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`
                        }
                      >
                        {subItem.icon ? <subItem.icon className="w-4 h-4 mr-3" /> : null}
                        <span>{subItem.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {location.pathname.split('/').pop()?.replace(/-/g, ' ')}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </button>
              <NotificationDropdown />
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6" />
                  )}
                  <span className="hidden md:block">{user?.name}</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                    ref={profileRef}
                  >
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <NavLink
                      to={`/${user?.role === 'user' ? 'customer' : user?.role}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to={`/${user?.role === 'user' ? 'customer' : user?.role}/settings`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Session Warning Modal */}
      <AnimatePresence>
        {showSessionWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-6 w-6 text-yellow-500">
                  ⚠️
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Session Expiring Soon
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your session will expire in {formatTimeRemaining(sessionInfo?.timeRemaining || 0)}. 
                Please save your work and extend your session to continue.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleExtendSession}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Extend Session
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Status Bar */}
      {sessionInfo?.isActive && (
        <div className="fixed bottom-4 right-4 z-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-3 max-w-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Session Active
              </span>
              <span className={`text-xs font-mono ${
                sessionInfo.timeRemaining < 300000 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formatTimeRemaining(sessionInfo.timeRemaining)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-2">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  sessionInfo.timeRemaining < 300000 
                    ? 'bg-red-500' 
                    : sessionInfo.timeRemaining < 600000 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.max(0, Math.min(100, (sessionInfo.timeRemaining / (30 * 60 * 1000)) * 100))}%`
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleExtendSession}
                className="flex-1 px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Extend
              </button>
              <button
                onClick={handleLogout}
                className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Layout; 