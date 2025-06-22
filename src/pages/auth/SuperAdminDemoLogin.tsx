
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const SuperAdminDemoLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await login('1111111111', '123456', 'superAdmin');
    navigate('/super-admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Super Admin Demo Login</h2>
        <button
          onClick={handleDemo}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Login as Demo Super Admin
        </button>
      </div>
    </div>
  );
};

export default SuperAdminDemoLogin; 