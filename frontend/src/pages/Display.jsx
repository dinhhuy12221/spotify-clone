// src/App.jsx hoặc nơi bạn đặt router
import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import DisplayHome from "./DisplayHome";
import DisplayPlaylist from "./DisplayPlaylist";
import Profile from "./Profile";
import PublicRoute from "../routes/PublicRoute";
import ProtectedRoute from "../routes/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";

const Display = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PublicRoute />}>
        <Route
          path="/"
          element={
            <>
              <Sidebar />
              <DisplayHome />
              <Player />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Sidebar />
              <div>Not found</div>
              <Player />
            </>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/playlist/:name" element={<DisplayPlaylist />} />
        <Route path="/profile" element={<Profile />} />
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
