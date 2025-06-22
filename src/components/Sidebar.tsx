import { 
  UserGroupIcon, 
  ShieldCheckIcon, 
  UserIcon, 
  CheckIcon, 
  BellIcon, 
  DocumentTextIcon, 
  HomeIcon, 
  Cog6ToothIcon, 
  QuestionMarkCircleIcon, 
  CalendarIcon,
  ArrowRightOnRectangleIcon, 
  BanknotesIcon,
  ClipboardDocumentIcon,
  WalletIcon,
  ChartBarIcon,
  MicrophoneIcon
} from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore, UserRole } from '@/store/authStore';



const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getNavigationItems = (role: UserRole) => {
    const baseItems = [
      {
        name: 'Main',
        items: [
          { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
          { name: 'Chit Groups', href: '/chit-groups', icon: UserGroupIcon },
          { name: 'Passbook', href: '/passbook', icon: ClipboardDocumentIcon },
          { name: 'Wallet', href: '/wallet', icon: WalletIcon },
          { name: 'Loans', href: '/loans', icon: BanknotesIcon },
        ]
      },
      {
        name: 'Account',
        items: [
          { name: 'Profile', href: '/profile', icon: UserIcon },
          { name: 'KYC', href: '/profile/kyc', icon: ShieldCheckIcon },
          { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
          { name: 'Notifications', href: '/notifications', icon: BellIcon },
        ]
      },
      {
        name: 'Support',
        items: [
          { name: 'Help & Support', href: '/help', icon: QuestionMarkCircleIcon },
          { name: 'FAQ', href: '/faq', icon: QuestionMarkCircleIcon },
          { name: 'Privacy Policy', href: '/privacy', icon: QuestionMarkCircleIcon },
          { name: 'Terms of Service', href: '/terms', icon: QuestionMarkCircleIcon },
        ]
      }
    ];

    // Add role-specific items
    if (role === 'agent') {
      baseItems[0].items.push(
        { name: 'Manual Payment', href: '/manual-payment', icon: BanknotesIcon },
        { name: 'Attendance Punch', href: '/attendance-punch', icon: CalendarIcon },
        { name: 'Agent Performance', href: '/agent-performance', icon: ChartBarIcon },
        { name: 'Receipt Download', href: '/receipt-download', icon: DocumentTextIcon },
        { name: 'Reminders', href: '/reminders', icon: BellIcon },
        { name: 'Speech-to-Entry', href: '/speech-entry', icon: MicrophoneIcon },
        { name: 'Collection Reports', href: '/collection-reports', icon: ChartBarIcon }
      );
    }
    if (role === 'user') {
      baseItems[0].items.push(
        { name: 'Receipt Download', href: '/receipt-download', icon: DocumentTextIcon },
        { name: 'Reminders', href: '/reminders', icon: BellIcon }
      );
    }

    return baseItems;
  };

  const navigation = getNavigationItems(user?.role || 'user');

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Mana Chit</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-8">
        {navigation.map((section) => (
          <div key={section.name}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {section.name}
            </h3>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 ${
                      location.pathname === item.href
                        ? 'text-gray-500 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                    }`} 
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
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
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar 