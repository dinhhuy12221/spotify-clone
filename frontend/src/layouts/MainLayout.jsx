// src/components/layouts/MainLayout.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';


const MainLayout = () => {
  const displayRef = useRef();
  const location = useLocation();
  const [bgColor, setBgColor] = useState('#333333');

  useEffect(() => {
    displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
  }, [bgColor]);

  return (
    <>
      <Sidebar />
      <div
        ref={displayRef}
        className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0"
      >
        <Outlet />
      </div>
      <Player />
    </>
  );
};

export default MainLayout;
