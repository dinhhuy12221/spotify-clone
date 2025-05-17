import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import AddSong from "./pages/AddSong";
import AddAlbum from "./pages/AddAlbum";
import ListSong from "./pages/ListSong";
import ListAlbum from "./pages/ListAlbum";
import ListUser from "./pages/ListUser";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

// Các route bảo vệ
import ProtectedRoute from "./routes/ProtectedRoute";
// Các route public (login, register…)
import PublicRoute from "./routes/PublicRoute";


const AdminLayout = () => (
  <div className="flex items-start min-h-screen">
    <ToastContainer />
    <Sidebar />
    <div className="flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]">
      <Navbar />
      <div className="pt-8 pl-5 sm:pt-12 sm:pl-12">
        <Outlet />
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/list-user" replace />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="add-song" element={<AddSong />} />
          <Route path="add-album" element={<AddAlbum />} />
          <Route path="list-user" element={<ListUser />} />
          <Route path="list-song" element={<ListSong />} />
          <Route path="list-album" element={<ListAlbum />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
