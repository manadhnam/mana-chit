import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
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
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';

const AdminSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigationItems = [
    // Dashboard
    {
      name: 'Dashboard',
      href: '/super-admin/dashboard',
      icon: HomeIcon,
      roles: ['superAdmin']
    },
    
    // Core Management
    {
      name: 'Branch Management',
      href: '/super-admin/branches',
      icon: BuildingOfficeIcon,
      roles: ['superAdmin']
    },
    {
      name: 'User Management',
      href: '/super-admin/user-management',
      icon: UserGroupIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Role Management',
      href: '/super-admin/role-management',
      icon: Cog6ToothIcon,
      roles: ['superAdmin']
    },
    
    // Business Operations
    {
      name: 'Customer Management',
      href: '/super-admin/customers',
      icon: UserIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Staff Directory',
      href: '/super-admin/staff',
      icon: UserGroupIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Chit Groups',
      href: '/super-admin/groups',
      icon: BanknotesIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Collections',
      href: '/super-admin/collections',
      icon: ClipboardDocumentListIcon,
      roles: ['superAdmin']
    },
    
    // System & Security
    {
      name: 'System Settings',
      href: '/super-admin/system-settings',
      icon: Cog6ToothIcon,
      roles: ['superAdmin']
    },
    {
      name: 'QR Management',
      href: '/super-admin/qr-management',
      icon: QrCodeIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Risk Reports',
      href: '/super-admin/risk-reports',
      icon: ExclamationTriangleIcon,
      roles: ['superAdmin']
    },
    {
      name: 'AI Risk Analytics',
      href: '/super-admin/ai-risk-analytics',
      icon: ChartBarIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Freeze Accounts',
      href: '/super-admin/freeze-accounts',
      icon: ShieldCheckIcon,
      roles: ['superAdmin']
    },
    
    // Communication & Support
    {
      name: 'WhatsApp Bot',
      href: '/super-admin/whatsapp-bot',
      icon: ChatBubbleLeftRightIcon,
      roles: ['superAdmin']
    },
    {
      name: 'System Notifications',
      href: '/super-admin/system-notifications',
      icon: BellIcon,
      roles: ['superAdmin']
    },
    
    // Analytics & Reports
    {
      name: 'Performance Metrics',
      href: '/super-admin/performance-metrics',
      icon: ChartBarIcon,
      roles: ['superAdmin']
    },
    {
      name: 'User Analytics',
      href: '/super-admin/user-analytics',
      icon: ChartBarIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Financial Reports',
      href: '/super-admin/financial-reports',
      icon: BanknotesIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Reports',
      href: '/super-admin/reports',
      icon: DocumentTextIcon,
      roles: ['superAdmin']
    },
    
    // Audit & Compliance
    {
      name: 'Audit Logs',
      href: '/super-admin/audit-logs',
      icon: DocumentTextIcon,
      roles: ['superAdmin']
    },
    
    // User Profile & Settings
    {
      name: 'Profile',
      href: '/super-admin/profile',
      icon: UserIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Settings',
      href: '/super-admin/settings',
      icon: Cog6ToothIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Help',
      href: '/super-admin/help',
      icon: DocumentTextIcon,
      roles: ['superAdmin']
    },
    {
      name: 'Feedback',
      href: '/super-admin/feedback',
      icon: ChatBubbleLeftRightIcon,
      roles: ['superAdmin']
    }
  ];

  const filteredNavigationItems = navigationItems.filter(item =>
    item.roles.includes(user?.role || '')
  );

  // Group navigation items by category for better organization
  const groupedItems = {
    'Dashboard': filteredNavigationItems.filter(item => item.name === 'Dashboard'),
    'Core Management': filteredNavigationItems.filter(item => 
      ['Branch Management', 'User Management', 'Role Management'].includes(item.name)
    ),
    'Business Operations': filteredNavigationItems.filter(item => 
      ['Customer Management', 'Staff Directory', 'Chit Groups', 'Collections'].includes(item.name)
    ),
    'System & Security': filteredNavigationItems.filter(item => 
      ['System Settings', 'QR Management', 'Risk Reports', 'AI Risk Analytics', 'Freeze Accounts'].includes(item.name)
    ),
    'Communication': filteredNavigationItems.filter(item => 
      ['WhatsApp Bot', 'System Notifications'].includes(item.name)
    ),
    'Analytics & Reports': filteredNavigationItems.filter(item => 
      ['Performance Metrics', 'User Analytics', 'Financial Reports', 'Reports'].includes(item.name)
    ),
    'Audit & Compliance': filteredNavigationItems.filter(item => 
      ['Audit Logs'].includes(item.name)
    ),
    'User Settings': filteredNavigationItems.filter(item => 
      ['Profile', 'Settings', 'Help', 'Feedback'].includes(item.name)
    )
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Mana Chit Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => {
          if (items.length === 0) return null;
          
          return (
            <div key={category}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {category}
              </h3>
              <div className="space-y-1">
                {items.map((item) => (
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
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <img
            className="h-8 w-8 rounded-full"
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
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
  )
}

export default AdminSidebar 