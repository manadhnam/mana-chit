import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { ToastProvider } from '../components/ToastProvider';
import ErrorBoundary from '../components/ErrorBoundary';

interface AppLayoutProps {
  showHeader?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  showHeader = true,
}) => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {showHeader && <Header />}
          <div className="flex">
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