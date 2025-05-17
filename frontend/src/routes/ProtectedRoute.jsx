import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../utils/axiosConfig";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null);

  const [bgColor, setBgColor] = useState("#333333");


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
      <div
        className="w-screen h-screen"
        style={{ background: `linear-gradient(${bgColor}, #121212)` }}
      >
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
