import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import RoleBasedRoutes from '@/routes/RoleBasedRoutes';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import notificationService from './services/notificationService';
import InstallPWA from './components/InstallPWA';
import './i18n'; // Initialize i18n

const App: React.FC = () => {
  useEffect(() => {
    // Initialize notification service
    return () => {
      // Cleanup notification service on unmount
    };
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
              <RoleBasedRoutes />
              <InstallPWA />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;