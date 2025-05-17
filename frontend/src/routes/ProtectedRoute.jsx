import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../utils/axiosConfig";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        await axios.get("/accounts/test-auth/");
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return null;

  return isAuth ? (
   <>
    <Sidebar />
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="">
          <Outlet />
        </div>
      </div>
      <Player />
   </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
