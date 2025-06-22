import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Users } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row">
      {/* Left side: Brand and features */}
      <motion.div 
        className="md:w-1/2 p-8 flex flex-col justify-center items-center md:items-end"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md">
          <div className="flex items-center mb-6">
            <CreditCard className="h-10 w-10 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">SmartChit</h1>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6">
            The smart way to save, invest and grow your money
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Users className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Join Chit Groups</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Connect with others, contribute monthly, and grow your savings in a secure, structured way.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <CreditCard className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Digital Passbooks</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Track all your contributions, grabs, and loan payments in a digital passbook accessible anytime.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <ShieldCheck className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Secure Loans</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Apply for loans based on your contribution history and CIBIL score with competitive interest rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Right side: Auth form */}
      <motion.div 
        className="md:w-1/2 bg-white dark:bg-gray-800 p-8 flex items-center justify-center rounded-t-3xl md:rounded-none md:rounded-l-3xl shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;