
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { ToastProvider } from '../components/ToastProvider';
import ErrorBoundary from '../components/ErrorBoundary';

interface AppLayoutProps {
  showSidebar?: boolean;
  showHeader?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  showSidebar = true,
  showHeader = true,
}) => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {showHeader && <Header />}
          <div className="flex">
            {showSidebar && <Sidebar />}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default AppLayout; 