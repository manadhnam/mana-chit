import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
  CreditCard,
  Users,
  Wallet,
  BookOpen,
  Calendar,
  Settings,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  BarChart3,
  UserCircle2,
  PiggyBank,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

type DashboardLayoutProps = {
  isAdmin?: boolean;
};

const DashboardLayout = ({ isAdmin = false }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { logout, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Effect for dark mode
  useEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Navigation items based on user role
  const navigationItems = isAdmin
    ? [
        { name: 'Dashboard', to: '/admin', icon: BarChart3 },
        { name: 'Users', to: '/admin/users', icon: Users },
        { name: 'Chit Groups', to: '/admin/chit-groups', icon: PiggyBank },
        { name: 'Loans', to: '/admin/loans', icon: CreditCard },
        { name: 'Reports', to: '/admin/reports', icon: FileText },
      ]
    : [
        { name: 'Dashboard', to: '/dashboard', icon: BarChart3 },
        { name: 'Chit Groups', to: '/chit-groups', icon: PiggyBank },
        { name: 'Passbook', to: '/passbook', icon: BookOpen },
        { name: 'Loans', to: '/loans', icon: CreditCard },
        { name: 'Wallet', to: '/wallet', icon: Wallet },
        { name: 'Meetings', to: '/meetings', icon: Calendar },
      ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center md:hidden">
        <div className="flex items-center">
          <CreditCard className="h-8 w-8 text-primary-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">SmartChit</h1>
        </div>
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <CreditCard className="h-8 w-8 text-primary-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">SmartChit</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4 p-2 rounded-md bg-gray-50 dark:bg-gray-700">
            <div className="flex-shrink-0">
              {user?.photo_url ? (
                <img 
                  src={user.photo_url} 
                  alt={user.name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <UserCircle2 className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <NavLink
              to={isAdmin ? '/admin/profile' : '/profile'}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </NavLink>
            
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <>
                  <Sun className="mr-3 h-5 w-5" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-3 h-5 w-5" />
                  Dark Mode
                </>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            
            <motion.nav
              className="relative flex flex-col w-full max-w-xs h-full bg-white dark:bg-gray-800 pt-5 pb-4 overflow-y-auto"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-primary-600 mr-2" />
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">SmartChit</h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-6 px-4 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
              
              <div className="mt-auto px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4 p-2 rounded-md bg-gray-50 dark:bg-gray-700">
                  <div className="flex-shrink-0">
                    {user?.photo_url ? (
                      <img 
                        src={user.photo_url} 
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <UserCircle2 className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <NavLink
                    to={isAdmin ? '/admin/profile' : '/profile'}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </NavLink>
                  
                  <button
                    onClick={() => {
                      toggleDarkMode();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="mr-3 h-5 w-5" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-3 h-5 w-5" />
                        Dark Mode
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;