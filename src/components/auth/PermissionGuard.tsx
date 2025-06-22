
import { useAuthStore } from '@/store/authStore';

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ permission, children, fallback = null }) => {
  const { user } = useAuthStore();
  if (!user || !(user as any).permissions?.includes(permission)) {
    return fallback;
  }
  return <>{children}</>;
};

export default PermissionGuard; 