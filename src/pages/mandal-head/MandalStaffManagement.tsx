

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

const MandalStaffManagement = () => <PlaceholderPage title="Mandal Staff Management" />;

export default MandalStaffManagement; 