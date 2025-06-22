
import { useAuthStore } from '@/store/authStore';

interface RoleGuardProps {
  allowed: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowed, children, fallback }) => {
  const { user } = useAuthStore();
  if (!user) return <div className="p-4 text-red-600">You must be logged in to access this page.</div>;
  if (!allowed.includes(user.role)) {
    return fallback || <div className="p-4 text-red-600">You do not have permission to view this page.</div>;
  }
  return <>{children}</>;
};

export default RoleGuard; 