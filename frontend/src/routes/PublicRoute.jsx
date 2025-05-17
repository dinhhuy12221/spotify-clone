import { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import Navbar from "../components/Navbar";

const ProtectedRoute = () => {
  const displayRef = useRef();
  const [bgColor, setBgColor] = useState("#333333");

  useEffect(() => {
    displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
  }, [bgColor]);
  return (
    <>
      <Sidebar />
      <div
        ref={displayRef}
        className="w-screen  h-screen bg-black"
      >
        <Navbar />
        <div className="">
          <Outlet />
        </div>
      </div>
      <Player />
    </>
  );
};

export default ProtectedRoute;
