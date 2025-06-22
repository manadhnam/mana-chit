import { Route, Routes } from 'react-router-dom';
import RoleGuard from '@/components/auth/RoleGuard';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<RoleGuard allowedRoles={['super-admin', 'branch-manager']} children={<></>} />}>
        <Route path="dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="role-dashboard" element={<div>Role Dashboard</div>} />
        <Route path="users" element={<div>Manage Users</div>} />
        <Route path="branches" element={<div>Branch Management</div>} />
        <Route path="chit-groups" element={<div>Manage Chit Groups</div>} />
        <Route path="loans" element={<div>Loan Management</div>} />
        <Route path="manage-loans" element={<div>Manage Loans</div>} />
        <Route path="funds" element={<div>Fund Management</div>} />
        <Route path="roles" element={<div>Role Management</div>} />
        <Route path="reports" element={<div>Reports</div>} />
        <Route path="profile" element={<div>Profile</div>} />
        <Route path="notifications" element={<div>Notifications</div>} />
        <Route path="settings" element={<div>Settings</div>} />
        <Route path="kyc" element={<div>KYC Verification</div>} />
        <Route path="branch-staff" element={<div>Branch Staff Management</div>} />
        <Route path="branch-performance" element={<div>Branch Performance Metrics</div>} />
        <Route path="branch-budget" element={<div>Branch Budget Management</div>} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes; 