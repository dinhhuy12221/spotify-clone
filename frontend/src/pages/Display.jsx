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
import DisplayAlbum from "./DisplayAlbum";

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
              <DisplayHome />
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
        <Route path="/playlist/:id" element={<DisplayPlaylist />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default Display;
