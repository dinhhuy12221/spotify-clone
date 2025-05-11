// src/App.jsx hoặc nơi bạn đặt router
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Login from "./Login";
import Register from "./Register";
import DisplayHome from "./DisplayHome";
import DisplayPlaylist from "./DisplayPlaylist";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";
import PrivateRoute from "./PrivateRoute";

const Display = () => {
  return (
    <Routes>
      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<DisplayHome />} />
        <Route
          path="/playlist/:name"
          element={
            <PrivateRoute>
              <DisplayPlaylist />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />{" "}
        {/* Thêm dòng này */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        {/* Add other protected/main routes here */}
        <Route path="*" element={<div>Not found</div>} />
      </Route>
    </Routes>
  );
};

export default Display;

// import React, { useEffect, useRef, useState } from 'react'
// import { Route, Routes, useLocation, useParams } from 'react-router-dom'
// import DisplayHome from './DisplayHome'
// import Login from './Login'
// import Register from './Register'
// import DisplayPlaylist from './DisplayPlaylist'

// const Display = () => {
//   const displayRef = useRef()
//   const location = useLocation()
//   const [bgColor, setBgColor] = useState('#333333') // Mặc định
//   const isAlbum = location.pathname.includes('album')
//   const albumId = isAlbum ? location.pathname.split('/').pop() : ''

//   useEffect(() => {
//     displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`
//   }, [bgColor])

//   return (
//     <div ref={displayRef} className='w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
//       <Routes>
//         <Route path='/' element={<DisplayHome />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path='/playlist/:name' element={<DisplayPlaylist />} />
//       </Routes>
//     </div>
//   )
// }

// export default Display
