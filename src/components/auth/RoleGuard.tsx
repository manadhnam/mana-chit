
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAuditStore } from '@/store/auditStore';
import { toast } from 'react-hot-toast';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, fallbackPath = '/unauthorized' }) => {
  const location = useLocation();
  const { user, isAuthenticated, setIntendedPath } = useAuthStore();
  const { logAction } = useAuditStore();

  if (!isAuthenticated) {
    // Store the intended path for redirect after login
    setIntendedPath(location.pathname);
    return <Navigate to="/auth/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Audit log for access denial
    logAction({
      userId: user?.id || 'anonymous',
      userRole: user?.role || 'unknown',
      action: 'ACCESS_DENIED',
      module: 'UI',
      details: { attemptedPath: location.pathname, requiredRoles: allowedRoles },
      ipAddress: '', // Optionally fill if available
      userAgent: navigator.userAgent,
    });
    toast.error('You do not have permission to access this page');
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard; 