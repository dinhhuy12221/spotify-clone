import { useState, useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

const PublicRoute = () => {
  const isAuth = useAuth();
  const displayRef = useRef();
  const [bgColor, setBgColor] = useState("#333333");

  useEffect(() => {
    displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
  }, [bgColor]);
  // Nếu đã login rồi, redirect thẳng vào dashboard
  return (
    <>
      <div
        ref={displayRef}
        className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0"
      >
        <Outlet />
      </div>
    </>
  );
};

export default PublicRoute;
