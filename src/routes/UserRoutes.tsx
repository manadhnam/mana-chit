import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import RoleGuard from '@/components/auth/RoleGuard';
import Dashboard from '@/pages/customer/Dashboard';
import Profile from '@/pages/customer/Profile';
import ChitGroups from '@/pages/customer/MyChitGroups';
import ChitGroupDetails from '@/pages/customer/ChitGroupDetails';
import Passbook from '@/pages/customer/Passbook';
import Loans from '@/pages/customer/MyLoans';
import Notifications from '@/pages/customer/Notifications';
import Settings from '@/pages/customer/Settings';
// import Help from '@/pages/customer/Help';
import NotFound from '@/pages/NotFound';

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<RoleGuard allowedRoles={['customer', 'agent']} children={<></>} />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chit-groups" element={<ChitGroups />} />
          <Route path="chit-groups/:id" element={<ChitGroupDetails />} />
          <Route path="passbook" element={<Passbook />} />
          <Route path="wallet" element={<div>Wallet</div>} />
          <Route path="loans" element={<Loans />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<div>Help</div>} />
          <Route path="faq" element={<div>FAQ</div>} />
          <Route path="privacy" element={<div>Privacy</div>} />
          <Route path="terms" element={<div>Terms</div>} />
          <Route path="meetings" element={<div>Meetings</div>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes; 