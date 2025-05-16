import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    // <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="w-full h-full">
        <Outlet />
      </div>
    // </div>
  );
};

export default AdminLayout;
