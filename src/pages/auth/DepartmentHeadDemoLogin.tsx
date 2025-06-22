
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const DepartmentHeadDemoLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await login('2222222222', '123456', 'departmentHead');
    navigate('/department-head/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Department Head Demo Login</h2>
        <button
          onClick={handleDemo}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login as Demo Department Head
        </button>
      </div>
    </div>
  );
};

export default DepartmentHeadDemoLogin; 