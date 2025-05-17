// Sidebar.jsx
import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Playlist from "./Playlist";
import axios from "../utils/axiosConfig";

const Sidebar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await axios.get(
        `/songs/?search=${query}`
      );
      const data = await response.data;
      navigate("/", { state: { searchResults: data } });
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="w-[25%] p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[20%] rounded flex flex-col justify-around p-4 gap-3">
        <div
          className="flex items-center gap-3 cursor-pointer  z-20"
          onClick={() => navigate("/")}
        >
          <img className="w-6" src={assets.home_icon} alt="home" />
          <p className="font-bold">Home</p>
        </div>
        <div className="flex items-center gap-2 bg-[#242424] p-2 rounded">
          <img className="w-6" src={assets.search_icon} alt="search" />
          <input
            className="bg-transparent outline-none text-white flex-1"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      <div className="bg-[#121212] h-[80%] rounded overflow-y-auto p-4">
        <Playlist />
      </div>
    </div>
  );
};

export default Sidebar;
