import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'

import { useAuthStore } from '@/store/authStore'
import { toast } from 'react-hot-toast'
import { BellIcon } from '@heroicons/react/24/solid';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './notifications/NotificationBell';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Your Company"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <NotificationBell />
            {user ? (
              <div className="flex items-center space-x-2">
                <span>{user.name}</span>
                <button onClick={handleLogout} className="btn btn-sm">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 