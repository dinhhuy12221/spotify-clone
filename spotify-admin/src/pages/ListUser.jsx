import React, { useEffect, useState } from "react";
import { url } from "../App";
import { toast } from "react-toastify";
import axios from "../utils/axiosConfig";
const ListUser = () => {
  const [data, setData] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/admin/users/");
      console.log(response.data);

      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || error.message);
    }
  };

  const removeUser = async (id) => {
    try {
      const response = await axios.post(`/admin/users`, {
        id,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchUsers();
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  // Tự động gọi `fetchSongs` khi component được mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <p>All Users List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Username</b>
          <b>Email</b>
          <b>Playlist</b>
          <b>Actions</b>
        </div>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 borber border-gray-300 text-sm mr-5"
            >
              {/* <img className='w-12' src={item.image} alt="" /> */}
              <p>{item.username}</p>
              <p>{item.email}</p>
              <div>
                  {item.playlists.map((playlist, index) => (
                    <p key={index}><b>{playlist.name}</b>: {playlist.song_ids}</p>
                  ))}
              </div>
              <p
                className="cursor-pointer"
                onClick={() => removeUser(item._id)}
              >
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListUser;
