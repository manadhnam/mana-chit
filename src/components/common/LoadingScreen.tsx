import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
          className="text-primary-600 dark:text-primary-400 mb-4"
        >
          <CreditCard size={64} />
        </motion.div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">SmartChit</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Loading your smart savings...</p>
        
        <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;